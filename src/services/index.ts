import appConfig from '../config/appConfig.json';
import * as real from './api';
import * as mock from './api.mock';

// 타입 재노출 (외부에서 기존 import 경로 유지)
export type { ChatRoom, ChatMessage, DiaryResponse, SocketMessage, ProcessingStatus } from './api';

// 환경변수(APP_USE_MOCKS=true)가 우선, 없으면 설정파일 참조
const envFlag = typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.APP_USE_MOCKS;
const useMocks = envFlag ? String(envFlag).toLowerCase() === 'true' : Boolean((appConfig as any)?.useMocks);

export const apiService = useMocks ? mock.apiService : real.apiService;
export const socketService = useMocks ? (mock.socketService as typeof real.socketService) : real.socketService;

// 전역 로그 억제 옵션 (필요 시 화면의 불필요한 로그 제거)
const suppressLogs = Boolean((appConfig as any).suppressLogs);
if (suppressLogs) {
  const noop = () => {};
  console.log = noop as any;
  console.debug = noop as any;
  console.info = noop as any;
}


