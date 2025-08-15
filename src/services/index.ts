import appConfig from '../config/appConfig.json';
import * as real from './api';
import * as mock from './api.mock';
import { Platform } from 'react-native';

// 타입 재노출 (외부에서 기존 import 경로 유지)
export type { ChatRoom, ChatMessage, DiaryResponse, SocketMessage, ProcessingStatus } from './api';

// 환경변수(APP_USE_MOCKS=true)가 우선, 없으면 설정파일 참조
// 개발 환경에서만 모킹 플래그 적용(배포/테스트 안정성)
const useMocks = __DEV__ ? Boolean((appConfig as any)?.useMocks) : false;

export const apiService = useMocks ? mock.apiService : real.apiService;
export const socketService = useMocks ? (mock.socketService as typeof real.socketService) : real.socketService;

// 전역 로그 억제 옵션 (필요 시 화면의 불필요한 로그 제거)
const originalLog = console.log;
const originalDebug = console.debug;
const originalInfo = console.info;
const suppressLogs = Boolean((appConfig as any).suppressLogs);
if (suppressLogs && !__DEV__) {
  console.log = (...args: any[]) => {
    originalLog(...args);
  };
  console.debug = () => {};
  console.info = () => {};
}


