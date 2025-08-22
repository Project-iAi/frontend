# FrontendRNiOS - AI 친구와 대화하는 그림일기 앱

아이와 AI 캐릭터가 대화하며 그림일기를 만들어주는 React Native 앱입니다.

## 🎯 주요 기능

- **온보딩**: 서비스 소개 및 시작
- **회원가입**: 아이와 보호자 정보 입력
- **컨셉 선택**: 우주, 밭, 학교 중 선택
- **캐릭터 선택**: 각 컨셉별 3개 캐릭터 중 선택
- **감정 선택**: 기쁨, 슬픔, 화남 중 선택
- **대화**: AI 캐릭터와 실시간 대화
- **그림일기**: 대화를 바탕으로 한 그림일기 생성
- **결과 모음**: 모든 그림일기 모음

## 🛠 기술 스택

- **React Native** 0.80.2
- **TypeScript**
- **Zustand** (상태관리)
- **iOS Simulator** / **Android Emulator**

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- React Native CLI
- Xcode (iOS 개발용)
- Android Studio (Android 개발용)

### 설치 및 실행

1. **의존성 설치**
```bash
npm install
```

2. **iOS 의존성 설치**
```bash
cd ios && bundle install && bundle exec pod install && cd ..
```

3. **Metro 서버 시작**
```bash
npm start
```

4. **앱 실행**

**iOS:**
```bash
npx react-native run-ios
```

**Android:**
```bash
npx react-native run-android
```

## 📁 프로젝트 구조

```
src/
├── components/          # 화면 컴포넌트들
│   ├── OnboardingScreen.tsx
│   ├── SignupScreen.tsx
│   ├── ConceptScreen.tsx
│   ├── CharacterScreen.tsx
│   ├── EmotionScreen.tsx
│   ├── ConversationScreen.tsx
│   ├── DiaryScreen.tsx
│   └── CollectionScreen.tsx
├── store/              # Zustand 상태관리
│   └── useAppStore.ts
├── types/              # TypeScript 타입 정의
│   └── index.ts
├── utils/              # 유틸리티 및 데이터
│   ├── constants.ts
│   └── data.ts
└── assets/             # 이미지 및 리소스
    ├── images/
    └── index.ts
```

## 📱 화면 플로우

1. **온보딩** → 2. **회원가입** → 3. **컨셉 선택** → 4. **캐릭터 선택** → 5. **감정 선택** → 6. **대화** → 7. **그림일기** → 8. **결과 모음**


## 👥 팀

- **Project iAi** - 
