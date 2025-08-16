// API 서비스 및 타입 정의
import io, { Socket } from 'socket.io-client';

import { Platform, NativeModules } from 'react-native';

// 백엔드 URL 설정
// - 안드로이드 에뮬레이터: 10.0.2.2 (호스트 컴퓨터의 localhost)
// - iOS 시뮬레이터: localhost
// - 실제 디바이스(안드/IOS): Metro 번들러의 호스트 IP를 추출하여 사용

const resolveDevHost = (): string => {
  try {
    // e.g. "http://192.168.0.5:8081/index.bundle?platform=android&dev=true&minify=false"
    const scriptURL: string | undefined = (NativeModules as any)?.SourceCode?.scriptURL;
    if (scriptURL) {
      const match = scriptURL.match(/^[a-zA-Z]+:\/\/([^/:]+):\d+/);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (_) {}
  return 'localhost';
};

// iOS 실기기에서 host가 localhost로 잡히는 경우를 대비한 핫픽스용 IP (맥의 로컬 IP)
// 필요 시 변경하세요.
const DEV_FALLBACK_HOST = '192.168.45.118';

const getBaseURL = () => {
  // Metro 번들러의 호스트를 최우선으로 사용하고,
  // 'localhost'인 경우에는 각 플랫폼의 권장 루프백 대체를 사용
  const host = resolveDevHost();

  if (Platform.OS === 'android') {
    // Android
    // host가 localhost로 나올 때: 실기기/에뮬레이터 구분 없이 우선 개발 PC IP를 사용하고,
    // 마지막 수단으로 10.0.2.2(에뮬레이터 전용)를 사용
    if (host === 'localhost' || host === '127.0.0.1') {
      return `http://${DEV_FALLBACK_HOST}:3000`;
    }
    // Dev Settings에 IP를 넣어둔 경우 그대로 사용
    return `http://${host}:3000`;
  }

  // iOS: 시뮬레이터는 localhost, 실기는 Metro 호스트 IP 사용
  if (host === 'localhost' || host === '127.0.0.1') {
    // 실기기에서 localhost로 잡히면 맥 IP로 강제 교체
    return `http://${DEV_FALLBACK_HOST}:3000`;
  }
  return `http://${host}:3000`;
};

export const API_BASE_URL = getBaseURL();
export const SOCKET_URL = API_BASE_URL;

// 새로운 타입 정의
export interface ApiCharacter {
  id: number;
  name: string;
  category: string;
  description: string;
  persona: string;
}

export interface CreateChatRoomRequest {
  characterId: number;
  emotion: string;
}

export interface CreateChatRoomResponse {
  id: number;
  createdAt: string;
}

export interface SelectCharacterRequest {
  characterId: number;
}

// 기존 타입 정의
export interface ChatRoom {
  id: number;
  createdAt: Date;
}

export interface ChatMessage {
  id: number;
  roomId: number;
  userType: 'user' | 'ai';
  content: string;
  createdAt: Date;
}

export interface DiaryResponse {
  id: number;
  roomId: number;
  content: string;
  summary: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface SocketMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  type: 'text' | 'voice';
  audioData?: string;
  timestamp: Date;
}

export interface ProcessingStatus {
  stage: 'stt' | 'ai' | 'tts' | 'complete';
  message: string;
}

// REST API 함수들
export const apiService = {
  // 캐릭터 목록 조회
  getCharacters: async (): Promise<ApiCharacter[]> => {
    console.log('🚀 캐릭터 조회 시작:', `${API_BASE_URL}/characters`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/characters`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API 오류 응답:', errorText);
        throw new Error(`캐릭터 조회 실패: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ 캐릭터 조회 성공:', result);
      return result;
      
    } catch (error) {
      console.error('💥 캐릭터 조회 API 오류:', error);
      if (error instanceof Error) {
        if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
          throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
        }
      }
      throw error;
    }
  },

  // 채팅방 생성 (감정과 캐릭터 ID 포함)
  createChatRoom: async (characterId: number, emotion: string): Promise<CreateChatRoomResponse> => {
    console.log('🚀 채팅방 생성 시작:', `${API_BASE_URL}/chat/room`, { characterId, emotion });
    
    try {
      const requestBody: CreateChatRoomRequest = {
        characterId,
        emotion,
      };
      
      const response = await fetch(`${API_BASE_URL}/chat/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('📡 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API 오류 응답:', errorText);
        throw new Error(`채팅방 생성 실패: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ 채팅방 생성 성공:', result);
      return result;
      
    } catch (error) {
      console.error('💥 채팅방 생성 API 오류:', error);
      if (error instanceof Error) {
        if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
          throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
        }
      }
      throw error;
    }
  },

  // 채팅방에 캐릭터 선택
  selectCharacter: async (roomId: number, characterId: number): Promise<void> => {
    console.log('🚀 캐릭터 선택 시작:', `${API_BASE_URL}/chat/room/${roomId}/character`, { characterId });
    
    try {
      const requestBody: SelectCharacterRequest = {
        characterId,
      };
      
      const response = await fetch(`${API_BASE_URL}/chat/room/${roomId}/character`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('📡 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API 오류 응답:', errorText);
        throw new Error(`캐릭터 선택 실패: ${response.status} ${response.statusText}`);
      }
      
      console.log('✅ 캐릭터 선택 성공');
      
    } catch (error) {
      console.error('💥 캐릭터 선택 API 오류:', error);
      if (error instanceof Error) {
        if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
          throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
        }
      }
      throw error;
    }
  },

  // 메시지 목록 조회
  getChatMessages: async (roomId: number): Promise<ChatMessage[]> => {
    const response = await fetch(`${API_BASE_URL}/chat/room/${roomId}/messages`);
    
    if (!response.ok) {
      throw new Error('메시지 조회 실패');
    }
    
    return response.json();
  },

  // 일기 생성
  createDiary: async (roomId: number): Promise<DiaryResponse> => {
    console.log('🚀 일기 생성 시작:', `${API_BASE_URL}/diary/room/${roomId}`);
    try {
      const response = await fetch(`${API_BASE_URL}/diary/room/${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('📡 응답 상태:', response.status, response.statusText);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API 오류 응답:', errorText);
        throw new Error(`일기 생성 실패: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      console.log('✅ 일기 생성 성공:', result);
      return result;
    } catch (error) {
      console.error('💥 일기 생성 API 오류:', error);
      if (error instanceof Error && error.message.includes('Network request failed')) {
        throw new Error('서버에 연결할 수 없습니다.');
      }
      throw error;
    }
  },

  // 특정 방 일기 조회
  getDiary: async (roomId: number): Promise<DiaryResponse> => {
    const response = await fetch(`${API_BASE_URL}/diary/room/${roomId}`);
    
    if (!response.ok) {
      throw new Error('일기 조회 실패');
    }
    
    return response.json();
  },

  // 모든 일기 목록 조회
  getAllDiaries: async (): Promise<DiaryResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/diary`);
    
    if (!response.ok) {
      throw new Error('일기 목록 조회 실패');
    }
    
    return response.json();
  },
};

// Socket.IO 관련 함수들
export const socketService = {
  // 소켓 연결
  connect: (): Socket => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'], // React Native에서 권장
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socket.on('connect_error', (error) => {
      console.error('🔌 소켓 연결 실패:', (error as any)?.message || String(error));
    });
    socket.on('connect', () => {
      console.log('✅ 소켓 연결 성공');
    });
    return socket;
  },

  // 채팅방 입장
  joinRoom: (socket: Socket, roomId: number) => {
    socket.emit('joinRoom', { roomId });
  },

  // 텍스트 메시지 전송
  sendMessage: (socket: Socket, roomId: number, text: string) => {
    socket.emit('sendMessage', { roomId, text });
  },

  // 음성 메시지 전송
  sendVoiceMessage: (socket: Socket, roomId: number, audioData: string) => {
    socket.emit('sendVoiceMessage', { roomId, audioData });
  },

  // 이벤트 리스너 등록
  setupListeners: (
    socket: Socket,
    onMessage: (message: SocketMessage) => void,
    onProcessing: (status: ProcessingStatus) => void,
    onSessionTimeout: (data: any) => void,
    onError: (error: any) => void,
    onJoinedRoom: (data: any) => void
  ) => {
    socket.on('message', onMessage);
    socket.on('processing', onProcessing);
    socket.on('sessionTimeout', onSessionTimeout);
    socket.on('error', onError);
    socket.on('joinedRoom', onJoinedRoom);
  },

  // 연결 해제
  disconnect: (socket: Socket) => {
    socket.disconnect();
  },
};