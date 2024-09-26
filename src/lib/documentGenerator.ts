import { ragChat } from "@/lib/rag-chat";

export async function generateDocument(type: string, chatHistory: string) {
  try {
    if (!chatHistory || chatHistory.length < 1) {
      throw new Error('Insufficient chat history to generate a document');
    }

    const prompt = `Generate a ${type} based on the following chat history:\n\n${chatHistory.substring(0, 5000)}`; // Limit content to 5000 characters
    const chatResponse = await ragChat.chat(prompt, { streaming: false });
    
    if ('output' in chatResponse && typeof chatResponse.output === 'string') {
      return { output: chatResponse.output };
    } else {
      console.error("Unexpected response structure:", chatResponse);
      throw new Error('Unexpected response structure from AI');
    }
  } catch (error) {
    console.error("Error generating document:", error);
    return { 
      output: `Error: Unable to generate document. ${error instanceof Error ? error.message : 'Unknown error occurred.'}`,
      error: true
    };
  }
}