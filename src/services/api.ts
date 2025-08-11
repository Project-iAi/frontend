// API 서비스 및 타입 정의
import io, { Socket } from 'socket.io-client';

import { Platform } from 'react-native';

// 백엔드 URL 설정
// 안드로이드 에뮬레이터: 10.0.2.2 (호스트 컴퓨터의 localhost)
// iOS 시뮬레이터: localhost
// 실제 디바이스: 컴퓨터의 실제 IP 주소 (예: 192.168.1.100)

const getBaseURL = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000'; // 안드로이드 에뮬레이터용
  } else {
    return 'http://localhost:3000'; // iOS 시뮬레이터용
  }
};

const API_BASE_URL = getBaseURL();
const SOCKET_URL = getBaseURL();

// 타입 정의
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
  // 채팅방 생성
  createChatRoom: async (): Promise<ChatRoom> => {
    console.log('🚀 API 호출 시작:', `${API_BASE_URL}/chat/room`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    const response = await fetch(`${API_BASE_URL}/diary/room/${roomId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('일기 생성 실패');
    }
    
    return response.json();
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