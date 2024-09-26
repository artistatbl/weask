export interface RagChatResponse {
  output: ReadableStream<string>;
  isStream: true;
  metadata: object[];
  context: {
    data: string;
    id: string;
    metadata: unknown;
  }[];
  history: {
    role: "user" | "assistant";
    content: string;
   // metadata?: UpstashDict;
    usage_metadata?: {
      total_tokens: number;
    };
    id: string;
  }[];
  usage?: {
    total_tokens: number;
  };
}