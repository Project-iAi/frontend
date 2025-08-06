import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { emotions } from '../utils/data';
import { COLORS, SIZES } from '../utils/constants';

const EmotionScreen = () => {
  const { selectedCharacter, setSelectedEmotion, setCurrentStep } = useAppStore();

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId as any);
    setCurrentStep('conversation');
  };

  if (!selectedCharacter) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>캐릭터를 선택해주세요</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>오늘 기분이 어때요?</Text>
        <Text style={styles.subtitle}>
          {selectedCharacter.name}에게 오늘 기분을 알려주세요
        </Text>

        <View style={styles.emotionContainer}>
          {emotions.map((emotion) => (
            <TouchableOpacity
              key={emotion.id}
              style={styles.emotionCard}
              onPress={() => handleEmotionSelect(emotion.id)}
            >
              <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
              <Text style={styles.emotionName}>{emotion.name}</Text>
              <Text style={styles.emotionDescription}>
                {emotion.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.sm,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SIZES.xl,
    color: COLORS.textSecondary,
  },
  emotionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  emotionCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.lg,
    borderRadius: SIZES.md,
    marginBottom: SIZES.md,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  emotionEmoji: {
    fontSize: 40,
    marginBottom: SIZES.sm,
  },
  emotionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
    color: COLORS.text,
  },
  emotionDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.error,
    marginTop: SIZES.xl,
  },
});

export default EmotionScreen; 