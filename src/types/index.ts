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
  apiId?: number; // API에서 받은 캐릭터 ID와 매핑
}

export interface Concept {
  id: ConceptType;
  name: string;
  description: string;
  characters: Character[];
}

// 감정 관련 타입 - API와 호환되도록 수정
export type EmotionType = 'happy' | 'sad' | 'angry';

export interface Emotion {
  id: EmotionType;
  name: string; // API에서 사용하는 한글 감정명 (예: "기쁨", "슬픔", "화남")
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
  roomId?: number; // 백엔드 채팅방 ID
}

// 결과 관련 타입
export interface DiaryEntry {
  id: number;
  roomId: number;
  content: string; // 일기 내용
  summary: string; // 대화 요약
  imageUrl?: string; // 생성된 그림 URL
  createdAt: Date; // 생성 시간
}

// 앱 상태 관련 타입
export interface AppState {
  currentStep: 'onboarding' | 'signup' | 'concept' | 'character' | 'emotion' | 'conversation' | 'diary' | 'collection' | 'diaryDetail' | 'chatHistory';
  user: User | null;
  selectedConcept: ConceptType | null;
  selectedCharacter: Character | null;
  selectedEmotion: EmotionType | null;
  currentConversation: Conversation | null;
  conversations: Conversation[];
  diaryEntries: DiaryEntry[];
  currentDiary: DiaryEntry | null; // 현재 보고 있는 일기
} 