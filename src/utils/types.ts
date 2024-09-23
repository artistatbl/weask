export interface Message {
  id: string | number;  // Allow both string and number
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
}