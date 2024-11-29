export interface Assistant {
  id: string;
  object: string;
  created_at: number;
  name: string;
  description: string | null;
  model: string;
  instructions: string | null;
  tools: any[];
  metadata: Record<string, any>;
}

export interface Thread {
  id: string;
  object: string;
  created_at: number;
  metadata: Record<string, any>;
}

export interface Message {
  id: string;
  object: string;
  created_at: number;
  thread_id: string;
  role: 'user' | 'assistant';
  content: Array<{
    type: string;
    text: {
      value: string;
      annotations: any[];
    };
  }>;
  file_ids: string[];
  assistant_id: string | null;
  run_id: string | null;
  metadata: Record<string, any>;
}

