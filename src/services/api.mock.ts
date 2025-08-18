import { Socket } from 'socket.io-client';
import type { ChatRoom, ChatMessage, DiaryResponse, SocketMessage, ProcessingStatus } from './api';

// 간단한 인메모리 스토리지
let roomAutoId = 1000;
const roomIdToMessages: Record<number, ChatMessage[]> = {};
const diaries: DiaryResponse[] = [] as any;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const apiService = {
  createChatRoom: async (): Promise<ChatRoom> => {
    await wait(300);
    const id = ++roomAutoId;
    roomIdToMessages[id] = [
      {
        id: Date.now().toString(),
        roomId: id,
        userType: 'ai',
        content: '안녕하세요! 무엇을 이야기해볼까요?',
        createdAt: new Date(),
      },
    ];
    return { id, createdAt: new Date() } as ChatRoom;
  },

  getChatMessages: async (roomId: number): Promise<ChatMessage[]> => {
    await wait(200);
    return roomIdToMessages[roomId] ?? [];
  },

  createDiary: async (roomId: number): Promise<DiaryResponse> => {
    await wait(800);
    const content = '오늘의 대화를 바탕으로 일기를 생성했어요. 모킹 데이터입니다.';
    const summary = '모킹 요약: 즐거운 대화';
    const diary: DiaryResponse = {
      id: Date.now().toString(),
      roomId,
      content,
      summary,
      imageUrl: undefined,
      createdAt: new Date(),
    } as DiaryResponse;
    diaries.push(diary);
    return diary;
  },

  getDiary: async (roomId: number): Promise<DiaryResponse> => {
    await wait(200);
    const found = diaries.find((d) => d.roomId === roomId);
    if (!found) {
      // 없으면 즉석에서 생성
      return apiService.createDiary(roomId);
    }
    return found;
  },

  getAllDiaries: async (): Promise<DiaryResponse[]> => {
    await wait(200);
    return diaries;
  },
};

// 최소 동작 모킹 소켓: 실제 네트워크 대신 콜백만 수행
class MockSocket {
  private handlers: Record<string, Function[]> = {};
  connect() {}
  disconnect() {}
  on(event: string, cb: Function) {
    this.handlers[event] = this.handlers[event] || [];
    this.handlers[event].push(cb);
  }
  emit(event: string, payload?: any) {
    if (event === 'sendMessage') {
      const { roomId, text } = payload;
      const now = new Date();
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        roomId,
        userType: 'user',
        content: text,
        createdAt: now,
      } as any;
      const aiMsg: SocketMessage = {
        id: Date.now().toString(),
        text: `AI 응답(모킹): ${text}`,
        sender: 'ai',
        type: 'text',
        timestamp: now,
      };
      roomIdToMessages[roomId] = (roomIdToMessages[roomId] || []).concat(userMsg);
      this.trigger('message', aiMsg);

      // 처리 상태 흉내
      this.trigger('processing', { stage: 'ai', message: 'AI가 생각 중...' } as ProcessingStatus);
      setTimeout(() => this.trigger('processing', { stage: 'complete', message: '완료' }), 300);
    }
    if (event === 'sendVoiceMessage') {
      const { roomId } = payload;
      const now = new Date();
      const aiMsg: SocketMessage = {
        id: Date.now().toString(),
        text: '음성 인식 결과(모킹): 안녕하세요',
        sender: 'ai',
        type: 'text',
        timestamp: now,
      };
      setTimeout(() => this.trigger('message', aiMsg), 300);
      this.trigger('processing', { stage: 'stt', message: '음성 인식 중(모킹)...' } as ProcessingStatus);
      setTimeout(() => this.trigger('processing', { stage: 'complete', message: '완료' }), 600);
    }
  }
  private trigger(event: string, payload?: any) {
    (this.handlers[event] || []).forEach((cb) => cb(payload));
  }
}

export const socketService = {
  connect: () => new MockSocket() as unknown as Socket,
  joinRoom: (_socket: Socket, _roomId: number) => {},
  sendMessage: (socket: Socket, roomId: number, text: string) => {
    (socket as any).emit('sendMessage', { roomId, text });
  },
  sendVoiceMessage: (socket: Socket, roomId: number, audioData: string) => {
    (socket as any).emit('sendVoiceMessage', { roomId, audioData });
  },
  setupListeners: () => {},
  disconnect: (_socket: Socket) => {},
};


