import { create } from 'zustand';
import { AppState, User, ConceptType, Character, EmotionType, Conversation, DiaryEntry } from '../types';

interface AppStore extends AppState {
  // 단계 관리
  setCurrentStep: (step: AppState['currentStep']) => void;
  
  // 사용자 관리
  setUser: (user: User) => void;
  
  // 인증 관리
  setJwtToken: (token: string | null) => void;
  setProfileCompleted: (completed: boolean) => void;
  
  // 컨셉 및 캐릭터 관리
  setSelectedConcept: (concept: ConceptType) => void;
  setSelectedCharacter: (character: Character) => void;
  
  // 감정 관리
  setSelectedEmotion: (emotion: EmotionType) => void;
  
  // 대화 관리
  setCurrentConversation: (conversation: Conversation | null) => void;
  addConversation: (conversation: Conversation) => void;
  addMessage: (message: Conversation['messages'][0]) => void;
  
  // 일기 관리
  addDiaryEntry: (entry: DiaryEntry) => void;
  setCurrentDiary: (diary: DiaryEntry | null) => void;
  
  // 리포트 관리
  setSelectedReportDate: (date: Date | null) => void;
  
  // 리셋
  resetApp: () => void;
}

const initialState: AppState = {
  currentStep: 'onboarding',
  user: null,
  jwtToken: null,
  profileCompleted: false,
  selectedConcept: null,
  selectedCharacter: null,
  selectedEmotion: null,
  currentConversation: null,
  conversations: [],
  diaryEntries: [],
  currentDiary: null,
  selectedReportDate: null,
};

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  setUser: (user) => {
    set({ user });
  },

  setJwtToken: (token) => {
    set({ jwtToken: token });
  },

  setProfileCompleted: (completed) => {
    set({ profileCompleted: completed });
  },

  setSelectedConcept: (concept) => {
    set({ selectedConcept: concept });
  },

  setSelectedCharacter: (character) => {
    console.log('setSelectedCharacter called with:', character);
    set({ selectedCharacter: character });
  },

  setSelectedEmotion: (emotion) => {
    console.log('setSelectedEmotion called with:', emotion);
    set({ selectedEmotion: emotion });
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
  },

  addConversation: (conversation) => {
    set((state) => ({
      conversations: [...state.conversations, conversation],
    }));
  },

  addMessage: (message) => {
    set((state) => {
      if (!state.currentConversation) return state;
      
      const updatedConversation = {
        ...state.currentConversation,
        messages: [...state.currentConversation.messages, message],
      };
      
      return {
        currentConversation: updatedConversation,
        conversations: state.conversations.map(conv => 
          conv.id === updatedConversation.id ? updatedConversation : conv
        ),
      };
    });
  },

  addDiaryEntry: (entry) => {
    set((state) => ({
      diaryEntries: [...state.diaryEntries, entry],
    }));
  },

  setCurrentDiary: (diary) => {
    set({ currentDiary: diary });
  },

  setSelectedReportDate: (date) => {
    set({ selectedReportDate: date });
  },

  resetApp: () => {
    set(initialState);
  },
})); 