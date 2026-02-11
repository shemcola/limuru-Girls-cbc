
export interface AnalysisResult {
  documentName: string;
  category: string;
  usage: string;
  howToFill: string;
  tips: string[];
}

export interface DocLog {
  id: string;
  timestamp: string;
  name: string;
  category: string;
}

export interface ChatResponse {
  text: string;
  sources?: { uri: string; title: string }[];
}

export enum Tab {
  HOME = 'home',
  ANALYZER = 'analyzer',
  GUIDE = 'guide',
  ASSISTANT = 'assistant',
  SHOWCASE = 'showcase',
  TEACHER_PORTAL = 'teacher_portal'
}
