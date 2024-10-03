import { RAGChat } from "@upstash/rag-chat";
import { ragConfig, RagConfigType } from "./rag-config";

// Example query and indexedUrl, replace with actual values or parameters as needed
const query = "example query";
const indexedUrl = "http://example.com";




export const ragChat = new RAGChat(ragConfig(query, indexedUrl) as RagConfigType);
