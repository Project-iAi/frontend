/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { useAppStore } from './src/store/useAppStore';
import OnboardingScreen from './src/components/OnboardingScreen';
import SignupScreen from './src/components/SignupScreen';
import ConceptScreen from './src/components/ConceptScreen';
import CharacterScreen from './src/components/CharacterScreen';
import EmotionScreen from './src/components/EmotionScreen';
import ConversationScreen from './src/components/ConversationScreen';
import DiaryScreen from './src/components/DiaryScreen';
import CollectionScreen from './src/components/CollectionScreen';

function App() {
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
      case 'emotion':
        return <EmotionScreen />;
      case 'conversation':
        return <ConversationScreen />;
      case 'diary':
        return <DiaryScreen />;
      case 'collection':
        return <CollectionScreen />;
      default:
        return <OnboardingScreen />;
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {renderScreen()}
    </>
  );
}

export default App;
