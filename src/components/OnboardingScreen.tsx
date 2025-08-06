import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { COLORS, SIZES } from '../utils/constants';

const OnboardingScreen = () => {
  const { setCurrentStep } = useAppStore();

  const handleStart = () => {
    setCurrentStep('signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>AI 친구와 대화해요!</Text>
        <Text style={styles.subtitle}>
          아이와 AI 캐릭터가 함께 대화하며 그림일기를 만들어요
        </Text>
        
        <View style={styles.features}>
          <Text style={styles.feature}>🌟 우주, 밭, 학교 세 가지 컨셉</Text>
          <Text style={styles.feature}>🎨 감정에 따른 맞춤 대화</Text>
          <Text style={styles.feature}>📖 대화를 바탕으로 한 그림일기</Text>
          <Text style={styles.feature}>📚 나만의 이야기 모음</Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>시작하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.md,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SIZES.xl,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  features: {
    marginBottom: SIZES.xl,
  },
  feature: {
    fontSize: 16,
    marginBottom: SIZES.sm,
    color: COLORS.text,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.sm,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingScreen; 