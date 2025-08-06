import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { COLORS, SIZES } from '../utils/constants';

const DiaryScreen = () => {
  const { 
    currentConversation, 
    selectedCharacter, 
    selectedEmotion,
    user,
    addDiaryEntry,
    setCurrentStep 
  } = useAppStore();

  const [isGenerating, setIsGenerating] = useState(true);
  const [diaryContent, setDiaryContent] = useState('');

  useEffect(() => {
    // 그림일기 생성 시뮬레이션
    setTimeout(() => {
      if (currentConversation && selectedCharacter && selectedEmotion && user) {
        const emotionText = {
          happy: '기쁜',
          sad: '슬픈',
          angry: '화난',
        }[selectedEmotion];

        const content = `${user.child.name}는 오늘 ${emotionText} 마음으로 ${selectedCharacter.name}와 함께 이야기를 나누었어요. 
        
${currentConversation.messages
  .filter(msg => msg.sender === 'user')
  .map(msg => msg.content)
  .join(' ')}라는 이야기를 나누며 서로의 마음을 이해했답니다.

이런 소중한 대화를 통해 ${user.child.name}는 더욱 성장할 수 있었어요.`;

        setDiaryContent(content);
        setIsGenerating(false);

        // 일기 항목 저장
        const diaryEntry = {
          id: Date.now().toString(),
          conversationId: currentConversation.id,
          title: `${selectedCharacter.name}와의 대화`,
          content,
          createdAt: new Date(),
        };
        addDiaryEntry(diaryEntry);
      }
    }, 3000);
  }, [currentConversation, selectedCharacter, selectedEmotion, user, addDiaryEntry]);

  const handleViewCollection = () => {
    setCurrentStep('collection');
  };

  const handleNewConversation = () => {
    setCurrentStep('concept');
  };

  if (!currentConversation || !selectedCharacter || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>대화 정보가 없습니다</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>그림일기가 완성되었어요! 🎨</Text>
        
        {isGenerating ? (
          <View style={styles.generatingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.generatingText}>그림일기를 만들고 있어요...</Text>
          </View>
        ) : (
          <View style={styles.diaryContainer}>
            <Text style={styles.diaryTitle}>{selectedCharacter.name}와의 대화</Text>
            <Text style={styles.diaryContent}>{diaryContent}</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.collectionButton} onPress={handleViewCollection}>
                <Text style={styles.buttonText}>모음 보기</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.newButton} onPress={handleNewConversation}>
                <Text style={styles.buttonText}>새로운 대화</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.lg,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.xl,
    color: COLORS.text,
  },
  generatingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generatingText: {
    fontSize: 18,
    marginTop: SIZES.md,
    color: COLORS.textSecondary,
  },
  diaryContainer: {
    flex: 1,
  },
  diaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SIZES.md,
    color: COLORS.text,
  },
  diaryContent: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    marginBottom: SIZES.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SIZES.xl,
  },
  collectionButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.sm,
  },
  newButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.sm,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.error,
    marginTop: SIZES.xl,
  },
});

export default DiaryScreen; 