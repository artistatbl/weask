import { ragChat } from "@/lib/rag-chat";

// Add this interface definition
interface GeneratedContent {
  title: string;
  introduction: string;
  mainContent: { heading: string; paragraphs: string[] }[];
  conclusion: string;
}

export async function generateDocument(type: string, chatHistory: string) {
  try {
    if (!chatHistory || chatHistory.length < 1) {
      throw new Error('Insufficient chat history to generate a document');
    }

    const prompt = `
      Generate a structured ${type} based on the following chat history. 
      The ${type} should have the following format, without any asterisks or "Note:" prefixes:

      Title: A concise title for the ${type}

      Introduction: A brief introduction to the topic

      Main Content:
      Heading 1
      Paragraph 1
      Paragraph 2
      Paragraph 3

      ... (2-3 main content sections)

      Conclusion: A brief conclusion summarizing the main points

      Chat History:
      ${chatHistory.substring(0, 5000)}
    `;

    const chatResponse = await ragChat.chat(prompt, { streaming: false });
    
    if ('output' in chatResponse && typeof chatResponse.output === 'string') {
      const parsedOutput = parseGeneratedContent(chatResponse.output);
      console.log('Parsed output:', parsedOutput);
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
  // Remove all asterisks and "Note:" prefixes
  output = output.replace(/\*+/g, '').replace(/^Note:\s*/gm, '');

  const sections = output.split('\n\n');
  const title = sections[0].replace(/^Title:\s*/i, '').trim();
  const introduction = sections[1].replace(/^Introduction:\s*/i, '').trim();
  const conclusion = sections[sections.length - 1].replace(/^Conclusion:\s*/i, '').trim();

  const mainContentSections = sections.slice(2, -1);
  const mainContent = [];

  for (let i = 0; i < mainContentSections.length; i++) {
    const section = mainContentSections[i];
    if (section.match(/^\[?Heading\s*\d*:?/i)) {
      const heading = section.replace(/^\[?Heading\s*\d*:?/i, '').trim();
      const paragraphs = (mainContentSections[i + 1] || '')
        .split('\n')
        .filter(p => p.trim() !== '')
        .map(p => p.replace(/^-\s*/, '').trim());
      mainContent.push({ heading, paragraphs });
      i++; // Skip the next section as we've already processed it
    }
  }

  return {
    title,
    introduction,
    mainContent,
    conclusion
  };
}