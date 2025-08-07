// 사용자 관련 타입
export interface Child {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'none';
  age: number;
  interests: string[];
}

export interface Parent {
  id: string;
  name: string;
  relationship: string; // '엄마', '아빠' 등
}

export interface User {
  child: Child;
  parent: Parent;
}

// 컨셉 및 캐릭터 관련 타입
export type ConceptType = 'space' | 'farm' | 'school';

export interface Character {
  id: string;
  name: string;
  concept: ConceptType;
  description: string;
  imageUrl?: string;
}

export interface Concept {
  id: ConceptType;
  name: string;
  description: string;
  characters: Character[];
}

// 감정 관련 타입
export type EmotionType = 'happy' | 'sad' | 'angry';

export interface Emotion {
  id: EmotionType;
  name: string;
  emoji: string;
  description: string;
}

// 대화 관련 타입
export interface Message {
  id: string;
  sender: 'user' | 'character';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  characterId: string;
  emotion: EmotionType;
  messages: Message[];
  createdAt: Date;
}

// 결과 관련 타입
export interface DiaryEntry {
  id: string;
  conversationId: string;
  title: string;
  content: string;
  createdAt: Date;
  concept: ConceptType;
  time?: string; // 시간 정보 (선택적)
}

// 앱 상태 관련 타입
export interface AppState {
  currentStep: 'onboarding' | 'signup' | 'concept' | 'character' | 'emotion' | 'conversation' | 'diary' | 'collection';
  user: User | null;
  selectedConcept: ConceptType | null;
  selectedCharacter: Character | null;
  selectedEmotion: EmotionType | null;
  currentConversation: Conversation | null;
  conversations: Conversation[];
  diaryEntries: DiaryEntry[];
} 