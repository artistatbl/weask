import { ragChat } from "@/lib/rag-chat";
import { ratelimitConfig } from "@/lib/rateLimiter";
import { tokenTracker } from "@/lib/tokenTracker";
import { estimateTokens } from "@/lib/utils";
import { redis } from "@/lib/redis";

interface GeneratedContent {
  title: string;
  introduction: string;
  mainContent: { heading: string; paragraphs: string[] }[];
  conclusion: string;
  references: string[]; // New field for references
}

export async function generateDocument(type: string, url: string, userId: string) {
  try {
    console.log('Generating document for URL:', url);

    // Rate limiting check
    if (ratelimitConfig.enabled && ratelimitConfig.ratelimit) {
      const { success, reset, remaining } = await ratelimitConfig.ratelimit.limit(userId);
      const resetInMinutes = Math.ceil((reset - Date.now()) / 60000);
      console.log(`Rate limit check for user ${userId}: success=${success}, remaining=${remaining}, reset in ${resetInMinutes} minutes`);
      if (!success) {
        throw new Error(`Rate limit exceeded. Please try again in ${resetInMinutes} minutes.`);
      }
    }

    // Token usage check
    const estimatedTokens = estimateTokens(url);
    if (!(await tokenTracker.canMakeRequest(estimatedTokens))) {
      throw new Error("API rate limit approached. Please try again later.");
    }

    const prompt = `
    Generate a structured ${type} about the main topic discussed on this webpage: ${url}
    Format the ${type} as follows, without using any asterisks or other markdown symbols:

    Title: A concise title that reflects the main topic of the webpage

    Introduction: A brief introduction to the specific topic discussed on this webpage

    Main Content:
    Include at least three main sections, each with a heading and 1-2 paragraphs. Format each section like this:
    
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
    3. If you can't find enough information on a particular point, simply state that the information is not available on the website.
    4. Make sure to include the References section in your output.
  `;

    const cacheKey = `document:${type}:${userId}:${url}`;
    const cachedResponse = await redis.get(cacheKey);
    if (cachedResponse && typeof cachedResponse === 'string') {
      return JSON.parse(cachedResponse);
    }

    const chatResponse = await ragChat.chat(prompt, { streaming: false });
    
    if ('output' in chatResponse && typeof chatResponse.output === 'string') {
      console.log('Raw AI output:', chatResponse.output);
      const parsedOutput = parseGeneratedContent(chatResponse.output);
      console.log('Parsed output:', parsedOutput);

      // Record token usage
      const lastMessage = chatResponse.history[chatResponse.history.length - 1];
      if (lastMessage && lastMessage.usage_metadata && typeof lastMessage.usage_metadata.total_tokens === 'number') {
        await tokenTracker.recordUsage(lastMessage.usage_metadata.total_tokens, estimatedTokens);
        console.log(`Token usage recorded for user ${userId}: ${estimatedTokens} tokens used out of ${lastMessage.usage_metadata.total_tokens} available`);
      }

      // Cache the result
      await redis.set(cacheKey, JSON.stringify(parsedOutput), { ex: 3600 });

      return parsedOutput;
    } else {
      console.error("Unexpected response structure:", chatResponse);
      throw new Error('Unexpected response structure from AI');
    }
  } catch (error) {
    console.error("Error generating document:", error);
    return { 
      error: true,
      output: `Error: Unable to generate document. ${error instanceof Error ? error.message : 'Unknown error occurred.'}`
    };
  }
}

function parseGeneratedContent(output: string): GeneratedContent {
  const sections = output.split(/\n(?=Title:|Introduction:|Heading \d+:|Conclusion:|References:)/);
  let title = '';
  let introduction = '';
  let conclusion = '';
  const mainContent: { heading: string; paragraphs: string[] }[] = []; // Changed from let to const
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
      mainContent.push({
        heading: heading.trim(),
        paragraphs: sectionContent.split('\n\n').map(p => p.trim())
      });
    } else if (heading.toLowerCase().includes('references')) {
      references = sectionContent.split('\n').map(ref => ref.trim()).filter(ref => ref !== '');
    }
  });

  console.log('Parsed content:', { title, introduction, mainContent, conclusion, references });

  return {
    title,
    introduction,
    mainContent,
    conclusion,
    references
  };
}