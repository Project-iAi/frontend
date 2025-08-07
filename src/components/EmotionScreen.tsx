import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { emotions } from '../utils/data';
import { SIZES } from '../utils/constants';
import { images } from '../assets';

const EmotionScreen = () => {
  const { selectedCharacter, setSelectedEmotion, setCurrentStep } = useAppStore();

  const handleBack = () => {
    setCurrentStep('character');
  };

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId as any);
    setCurrentStep('conversation');
  };

  if (!selectedCharacter) {
    return (
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.errorText}>캐릭터를 선택해주세요</Text>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={images.backgrounds.main} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: SIZES.xl,
    left: SIZES.lg,
    zIndex: 1,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
    justifyContent: 'center',
    paddingTop: SIZES.xl * 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.sm,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SIZES.xl,
    color: '#666',
  },
  emotionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  emotionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: SIZES.lg,
    borderRadius: 20,
    marginBottom: SIZES.md,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emotionEmoji: {
    fontSize: 40,
    marginBottom: SIZES.sm,
  },
  emotionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
    color: '#333',
  },
  emotionDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginTop: SIZES.xl * 3,
  },
});

export default EmotionScreen; 