import Constants from 'expo-constants';
import type { Message } from '../types/chat';

const API_KEY = Constants.expoConfig?.extra?.deepseekApiKey as string;
const BASE_URL = 'https://api.deepseek.com/v1/chat/completions';

if (!API_KEY) {
  console.warn('[DeepSeek] No API key configured in app.json extra');
}

export type DeepSeekMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

function toApiMessages(messages: Message[]): DeepSeekMessage[] {
  // Optionally prepend a system prompt
  const result: DeepSeekMessage[] = [];
  for (const m of messages) {
    result.push({ role: m.role, content: m.content });
  }
  return result;
}

export function streamChat(
  history: Message[],
  callbacks: {
    onContent: (chunk: string) => void;
    onReasoning: (chunk: string) => void;
    onDone: (content: string, reasoning: string) => void;
    onError: (err: Error) => void;
  }
): () => void {
  const messages = toApiMessages(history);
  const body = JSON.stringify({
    model: 'deepseek-v4-flash',
    messages,
    stream: true,
    max_tokens: 8192,
  });

  const xhr = new XMLHttpRequest();
  xhr.open('POST', BASE_URL);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Authorization', `Bearer ${API_KEY}`);

  let lastIndex = 0;
  let fullContent = '';
  let fullReasoning = '';

  xhr.onprogress = () => {
    const newChunk = xhr.responseText.substring(lastIndex);
    lastIndex = xhr.responseText.length;

    const lines = newChunk.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;

      const payload = trimmed.slice(6);
      if (payload === '[DONE]') {
        callbacks.onDone(fullContent, fullReasoning);
        return;
      }

      try {
        const parsed = JSON.parse(payload);
        const delta = parsed.choices?.[0]?.delta;
        if (!delta) continue;

        if (delta.reasoning_content) {
          fullReasoning += delta.reasoning_content;
          callbacks.onReasoning(delta.reasoning_content);
        }
        if (delta.content) {
          fullContent += delta.content;
          callbacks.onContent(delta.content);
        }
      } catch {
        // skip malformed JSON lines
      }
    }
  };

  xhr.onerror = () => {
    callbacks.onError(new Error('Network request failed'));
  };

  xhr.onloadend = () => {
    if (xhr.status !== 0 && xhr.status !== 200) {
      let msg = `HTTP ${xhr.status}`;
      try {
        const err = JSON.parse(xhr.responseText);
        msg = err.error?.message || msg;
      } catch {}
      callbacks.onError(new Error(msg));
    }
  };

  xhr.send(body);

  return () => xhr.abort();
}
