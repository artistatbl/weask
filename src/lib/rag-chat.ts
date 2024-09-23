import { RAGChat } from "@upstash/rag-chat";
import { ragConfig } from "./rag-config";

export const ragChat = new RAGChat(ragConfig as any);
