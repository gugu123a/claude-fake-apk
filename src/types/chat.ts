export type MessageRole = 'user' | 'assistant';

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  reasoning?: string;
  timestamp: number;
};

export type StreamCallbacks = {
  onContent: (text: string) => void;
  onReasoning: (text: string) => void;
  onDone: (fullContent: string, fullReasoning: string) => void;
  onError: (error: Error) => void;
};
