/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { LogBox } from 'react-native';
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

  return renderScreen();
};

export default App;
