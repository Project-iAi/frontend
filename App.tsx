/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { LogBox, Platform, useWindowDimensions, View } from 'react-native';
import { useAppStore } from './src/store/useAppStore';
import OnboardingScreen from './src/components/OnboardingScreen';
import SignupScreen from './src/components/SignupScreen';
import ConceptScreen from './src/components/ConceptScreen';
import CharacterScreen from './src/components/CharacterScreen';
import ConversationScreen from './src/components/ConversationScreen';
import DiaryScreen from './src/components/DiaryScreen';
import CollectionScreen from './src/components/CollectionScreen';
import DiaryDetailScreen from './src/components/DiaryDetailScreen';
import ChatHistoryScreen from './src/components/ChatHistoryScreen';

// 경고 메시지 숨기기
LogBox.ignoreLogs([
  'Warning:',
  'Require cycle:',
  'ViewPropTypes will be removed',
  'AsyncStorage has been extracted',
]);

const DESIGN_WIDTH = 430;   // iPhone 논리 폭(조절 가능)
const DESIGN_HEIGHT = 800; // 세로 길이(조절 가능)
const SCREEN_SCALE = 1;   // iPad 화면 대비 프레임 가로/세로 90% 사용 (조절 가능)

const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useWindowDimensions();
  // 가로/세로 모두 화면에 맞도록 스케일. 필요 시 SCREEN_SCALE로 여백 확보
  const scale = Math.min(
    (width * SCREEN_SCALE) / DESIGN_WIDTH,
    (height * SCREEN_SCALE) / DESIGN_HEIGHT,
  );
  return (
    <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: [{ scale }],
          overflow: 'hidden',
          borderRadius: 20,
          backgroundColor: '#fff',
        }}
      >
        {children}
      </View>
    </View>
  );
};

const App = () => {
  const { currentStep } = useAppStore();

  const renderScreen = () => {
    switch (currentStep) {
      case 'onboarding':
        return <OnboardingScreen />;
      case 'signup':
        return <SignupScreen />;
      case 'concept':
        return <ConceptScreen />;
      case 'character':
        return <CharacterScreen />;
      case 'conversation':
        return <ConversationScreen />;
      case 'diary':
        return <DiaryScreen />;
      case 'collection':
        return <CollectionScreen />;
      case 'diaryDetail':
        return <DiaryDetailScreen />;
      case 'chatHistory':
        return <ChatHistoryScreen />;
      default:
        return <OnboardingScreen />;
    }
  };

  const content = renderScreen();
  // iPad에서만 아이폰 프레임 적용
  // iPad 호환 모드(아이폰 전용 빌드)에서는 Platform.isPad가 false가 되어 프레임이 적용되지 않습니다.
  // iOS 전체에서 프레임을 적용하도록 변경합니다.
  if (Platform.OS === 'ios') {
    return <PhoneFrame>{content}</PhoneFrame>;
  }
  return content;
};

export default App;
