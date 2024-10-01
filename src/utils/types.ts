export interface Message {
  id: string | number;  // Allow both string and number
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
}

export interface Links {
  label: string;
  href: string;
  icon: React.ReactNode;
  textColor?: string;
}
