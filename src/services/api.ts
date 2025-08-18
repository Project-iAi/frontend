// API 서비스 및 타입 정의
import io, { Socket } from 'socket.io-client';

// 백엔드 URL 설정
const PRODUCTION_URL = 'https://www.iailog.store';
const DEV_URL = 'http://localhost:3000';

// 배포 환경으로 강제 설정 (테스트용)
export const API_BASE_URL = PRODUCTION_URL;
export const SOCKET_URL = PRODUCTION_URL;

// 새로운 타입 정의
export interface ApiCharacter {
  id: number;
  name: string;
  category: string;
  description: string;
  persona: string;
}

// 카카오 로그인 및 회원가입 관련 타입
export interface KakaoLoginRequest {
  accessToken: string;
}

export interface KakaoLoginResponse {
  accessToken: string;
  profileCompleted: boolean;
}

export interface SignupRequest {
  childName: string;
  childGender: string;
  childAge: number;
  motherName: string;
  childInterests: string[];
}

export interface SignupResponse {
  success: boolean;
  message?: string;
}

export interface MeResponse {
  // JWT payload 내용에 따라 정의
  [key: string]: any;
}

// 부모 리포트 관련 타입
export interface ParentReport {
  emotionalState: string;
  interests: string[];
  languageDevelopment: string;
  socialSkills: string;
  highlights: string[];
  suggestions: string[];
  overallAssessment: string;
  developmentScores: {
    language: number;
    social: number;
    emotional: number;
    creativity: number;
    curiosity: number;
  };
  overallScore: number;
  createdAt: string;
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
  id: string;
  roomId: number;
  userType: 'user' | 'ai';
  content: string;
  createdAt: Date;
}

export interface DiaryResponse {
  id: string;
  roomId: number;
  content: string;
  summary: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface SocketMessage {
  id: string;
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

  // 카카오 네이티브 로그인
  kakaoLogin: async (accessToken: string): Promise<KakaoLoginResponse> => {
    try {
      console.log('🔐 카카오 로그인 요청:', accessToken);
      const response = await fetch(`${API_BASE_URL}/auth/kakao/native`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 카카오 로그인 API 오류:', errorText);
        throw new Error(`카카오 로그인 실패: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ 카카오 로그인 성공:', result);
      return result;
    } catch (error) {
      console.error('💥 카카오 로그인 API 오류:', error);
      throw error;
    }
  },

  // 회원가입
  signup: async (signupData: SignupRequest, jwtToken: string): Promise<SignupResponse> => {
    try {
      console.log('📝 회원가입 요청:', signupData);
      const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 회원가입 API 오류:', errorText);
        throw new Error(`회원가입 실패: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ 회원가입 성공:', result);
      return result;
    } catch (error) {
      console.error('💥 회원가입 API 오류:', error);
      throw error;
    }
  },

  // 내 정보 조회
  getMe: async (jwtToken: string): Promise<MeResponse> => {
    try {
      console.log('👤 내 정보 조회 요청');
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 내 정보 조회 API 오류:', errorText);
        throw new Error(`내 정보 조회 실패: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ 내 정보 조회 성공:', result);
      return result;
    } catch (error) {
      console.error('💥 내 정보 조회 API 오류:', error);
      throw error;
    }
  },

  // 부모 리포트 조회
  getParentReport: async (roomId: number, jwtToken: string): Promise<ParentReport> => {
    try {
      console.log('📊 부모 리포트 조회 요청:', roomId);
      const response = await fetch(`${API_BASE_URL}/diary/room/${roomId}/parent-report`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 부모 리포트 조회 API 오류:', errorText);
        throw new Error(`부모 리포트 조회 실패: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ 부모 리포트 조회 성공:', result);
      return result;
    } catch (error) {
      console.error('💥 부모 리포트 조회 API 오류:', error);
      throw error;
    }
  },
};

// Socket.IO 관련 함수들
export const socketService = {
  // 소켓 연결
  connect: (): Socket => {
    console.log('🔌 소켓 연결 시도:', SOCKET_URL);
    
    const socket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'], // polling을 우선으로 시도
      timeout: 15000,
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
    
    socket.on('disconnect', (reason) => {
      console.log('🔌 소켓 연결 해제:', reason);
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