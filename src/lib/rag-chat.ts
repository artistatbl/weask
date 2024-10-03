import { RAGChat } from "@upstash/rag-chat";
import { ragConfig, RagConfigType } from "./rag-config";
import { Tiktoken } from 'tiktoken';

// Example query and indexedUrl, replace with actual values or parameters as needed
const query = "example query";
const indexedUrl = "http://example.com";

// Example usage of Tiktoken
const tokenizer = new Tiktoken();

export const ragChat = new RAGChat(ragConfig(query, indexedUrl) as RagConfigType);
