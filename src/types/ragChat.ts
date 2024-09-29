export interface RagChatResponse {
  output: string | ReadableStream<string>;
  isStream: boolean;
  metadata: object[];
  context: {
    data: string;
    id: string;
    metadata: unknown;
  }[];
  history: {
    role: "user" | "assistant";
    content: string;
    usage_metadata?: {
      total_tokens: number;
    };
    id: string;
  }[];
}