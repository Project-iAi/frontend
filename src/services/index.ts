import * as real from './api';

// 타입 재노출 (외부에서 기존 import 경로 유지)
export type { ChatRoom, ChatMessage, DiaryResponse, SocketMessage, ProcessingStatus, ParentReport } from './api';

// 항상 실제 API로 연동
export const apiService = real.apiService;
export const socketService = real.socketService;

