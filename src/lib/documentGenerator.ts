import { ragChat } from "@/lib/rag-chat";
import { ratelimitConfig } from "@/lib/rateLimiter";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/db";

interface GeneratedContent {
  title: string;
  introduction: string;
  mainContent: { heading: string; paragraphs: string[] }[];
  conclusion: string;
  references: string[];
}

export async function generateDocument(type: string, url: string, jobId: string): Promise<GeneratedContent | { error: string }> {
  try {
    console.log('Generating document for URL:', url);

    // Fetch the job
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new Error(`Job not found for jobId: ${jobId}`);
    }

    // Rate limiting check
    if (ratelimitConfig.enabled && ratelimitConfig.ratelimit) {
      const { success, reset, remaining } = await ratelimitConfig.ratelimit.limit(job.userId);
      const resetInMinutes = Math.ceil((reset - Date.now()) / 60000);
      console.log(`Rate limit check for user ${job.userId}: success=${success}, remaining=${remaining}, reset in ${resetInMinutes} minutes`);
      if (!success) {
        throw new Error(`Rate limit exceeded. Please try again in ${resetInMinutes} minutes.`);
      }
    }

    const prompt = `
    Generate a structured ${type} about the main topic discussed on this webpage: ${url}
    Format the ${type} as follows, without using any asterisks or other markdown symbols:

    Title: A concise title that reflects the main topic of the webpage

    Introduction: A brief introduction to the specific topic discussed on this webpage

    Main Content:
    Include at least three main sections, each with a heading and 1-3 paragraphs. Format each section like this:
    
    Heading 1: 
    [Paragraph about the first main point]
    [Another paragraph about the first main point if needed]

    Heading 2:  
    [Paragraph about the second main point]
    [Another paragraph about the second main point if needed]

    Heading 3: 
    [Paragraph about the third main point]
    [Another paragraph about the third main point if needed]

    Conclusion: A brief conclusion summarizing the main points discussed on this webpage

    References:
    - Include a list of references used in the content, citing specific pages or sections within the ${url} website.
    - Each reference should be on a new line and in the format: [Page Title or Section Name] (${url}/specific-page-path)
    - Ensure that all information in the main content is supported by these references.
    - Always include the main URL (${url}) as a general reference at the end of the reference list.

    Important:
    1. Use information only from the provided URL and its subpages.
    2. Do not include any external sources or made-up information.
    3. Do not include the heading:1 to 3 within the response, just say the header name, don't have the heading 1 on the output.
    4. If you can't find enough information on a particular point, simply state that the information is not available on the website.
    5. Make sure to include the References section in your output.
    `;

    const cacheKey = `document:${type}:${job.userId}:${url}`;
    const cachedResponse = await redis.get(cacheKey);
    if (cachedResponse && typeof cachedResponse === 'string') {
      const parsedResponse = JSON.parse(cachedResponse);
      await updateJobStatus(jobId, 'completed', parsedResponse);
      return parsedResponse;
    }

    const chatResponse = await ragChat.chat(prompt, { streaming: false });
    
    if ('output' in chatResponse && typeof chatResponse.output === 'string') {
      console.log('Raw AI output:', chatResponse.output);

      try {
        const parsedOutput = parseGeneratedContent(chatResponse.output);
        console.log('Parsed output:', parsedOutput);

        await redis.set(cacheKey, JSON.stringify(parsedOutput), { ex: 3600 }); // Cache for 1 hour

        await updateJobStatus(jobId, 'completed', parsedOutput);

        return parsedOutput;
      } catch (jsonError) {
        console.error("Error parsing AI output:", jsonError);
        throw new Error('Invalid JSON format in AI output');
      }
    } else {
      console.error("Unexpected response structure:", chatResponse);
      throw new Error('Unexpected response structure from AI');
    }
  } catch (error) {
    console.error("Error generating document:", error);
    
    await updateJobStatus(jobId, 'failed', undefined, error instanceof Error ? error.message : 'Unknown error occurred.');

    return { 
      error: `Error: Unable to generate document. ${error instanceof Error ? error.message : 'Unknown error occurred.'}`
    };
  }
}

async function updateJobStatus(jobId: string, status: 'completed' | 'failed', result?: GeneratedContent, error?: string): Promise<void> {
  try {
    await prisma.job.update({
      where: { id: jobId },
      data: { 
        status,
        result: result ? JSON.stringify(result) : undefined,
        error,
        updatedAt: new Date()
      }
    });
  } catch (updateError) {
    console.error(`Failed to update job ${jobId}:`, updateError);
    // You might want to implement a retry mechanism or additional error handling here
  }
}

function parseGeneratedContent(output: string): GeneratedContent {
  const sections = output.split(/\n(?=Title:|Introduction:|Heading \d+:|Conclusion:|References:)/);
  let title = '';
  let introduction = '';
  let conclusion = '';
  const mainContent: { heading: string; paragraphs: string[] }[] = [];
  let references: string[] = [];

  sections.forEach(section => {
    const [heading, ...content] = section.split('\n');
    const sectionContent = content.join('\n').trim();

    if (heading.toLowerCase().includes('title')) {
      title = heading.replace(/^Title:\s*/, '').trim();
    } else if (heading.toLowerCase().includes('introduction')) {
      introduction = sectionContent;
    } else if (heading.toLowerCase().includes('conclusion')) {
      conclusion = sectionContent;
    } else if (heading.toLowerCase().includes('heading')) {
      const cleanHeading = heading.replace(/^Heading \d+:\s*/, '').trim();
      mainContent.push({
        heading: cleanHeading,
        paragraphs: sectionContent.split('\n\n').map(p => p.trim())
      });
    } else if (heading.toLowerCase().includes('references')) {
      references = sectionContent.split('\n').map(ref => ref.trim()).filter(ref => ref !== '');
    }
  });

  console.log('Parsed content:', { title, introduction, mainContent, conclusion, references });

  if (!title || !introduction || mainContent.length === 0 || !conclusion || references.length === 0) {
    throw new Error('Generated content is missing required fields');
  }

  return {
    title,
    introduction,
    mainContent,
    conclusion,
    references
  };
}