import { ragChat } from "@/lib/rag-chat";

export async function generateDocument(type: string, content: string) {
  const prompt = `Generate a ${type} based on the following content: ${content}`;
  const response = await ragChat.chat(prompt, { streaming: false });
  return { output: response.output }; // Ensure the response is wrapped in an object with an 'output' key
}