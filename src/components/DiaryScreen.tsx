import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';

const { height: screenHeight } = Dimensions.get('window');

const DiaryScreen = () => {
  const {
    currentConversation,
    selectedCharacter,
    selectedEmotion,
    selectedConcept,
    user,
    setCurrentStep,
    addDiaryEntry,
  } = useAppStore();

  const [isGenerating, setIsGenerating] = useState(true);
  const [diaryContent, setDiaryContent] = useState('');

  const handleBack = () => {
    setCurrentStep('collection');
  };

  const handleViewCollection = () => {
    setCurrentStep('collection');
  };

  const handleNewConversation = () => {
    setCurrentStep('concept');
  };

  const formatTextToNotebook = (text: string, charsPerLine: number = 18) => {
    const words = text.split('');
    const lines = [];
    
    for (let i = 0; i < words.length; i += charsPerLine) {
      const line = words.slice(i, i + charsPerLine).join('');
      lines.push(line);
    }
    
    return lines;
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  useEffect(() => {
    // 일기 생성 시뮬레이션
    if (isGenerating && currentConversation && selectedCharacter && user) {
      setTimeout(() => {
        const emotionText = {
          happy: '기쁜',
          sad: '슬픈',
          angry: '화난',
        }[selectedEmotion || 'happy'];

        const generatedContent = `${user.child.name}는 오늘 ${emotionText} 마음으로 ${selectedCharacter.name}와 함께 이야기를 나누었어요. ${currentConversation.messages
          .filter(msg => msg.sender === 'user')
          .map(msg => msg.content)
          .join(' ')}라는 이야기를 나누며 서로의 마음을 이해했답니다. 이런 소중한 대화를 통해 ${user.child.name}는 더욱 성장할 수 있었어요.`;

        setDiaryContent(generatedContent);
        setIsGenerating(false);

        // 일기 항목 추가
        const diaryEntry = {
          id: Date.now().toString(),
          conversationId: currentConversation.id,
          title: `${selectedCharacter.name}와의 대화`,
          content: generatedContent,
          createdAt: new Date(),
          concept: selectedConcept!,
        };
        addDiaryEntry(diaryEntry);
      }, 3000);
    }
  }, [isGenerating, currentConversation, selectedCharacter, selectedEmotion, user, selectedConcept, addDiaryEntry]);

  if (!currentConversation || !selectedCharacter || !user) {
    return (
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>일기 정보가 없습니다</Text>
            <TouchableOpacity style={styles.errorBackButton} onPress={handleBack}>
              <Text style={styles.errorBackButtonText}>뒤로가기</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (isGenerating) {
    return (
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.generatingContainer}>
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>일기를 생성하고 있어요...</Text>
            </View>
          </View>
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
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.diaryCard}>
            {/* 날짜 영역 */}
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{getCurrentDate()}</Text>
            </View>

            {/* 그림 영역 */}
            <View style={styles.illustrationContainer}>
              <View style={styles.illustrationBox}>
                <View style={styles.cloudContainer}>
                  <Text style={styles.cloudEmoji}>☁️</Text>
                </View>
                <View style={styles.characterContainer}>
                  <Text style={styles.characterEmoji}>🐻</Text>
                </View>
              </View>
            </View>

            {/* 일기 내용 영역 */}
            <View style={styles.contentContainer}>
              <View style={styles.notebookLines}>
                {formatTextToNotebook(diaryContent).map((line, index) => (
                  <View key={index} style={styles.lineContainer}>
                    <Text style={styles.diaryContent}>{line}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* 버튼 영역 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.newButton} onPress={handleNewConversation}>
              <Text style={styles.newButtonText}>다시 놀러가기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.collectionButton} onPress={handleViewCollection}>
              <Text style={styles.collectionButtonText}>기록 보러가기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  content: {
    flexGrow: 1,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.xl,
  },
  backButton: {
    position: 'absolute',
    top: SIZES.lg,
    left: SIZES.lg,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
  },
  diaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: SIZES.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: screenHeight * 0.7,
  },
  dateContainer: {
    marginBottom: SIZES.lg,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  illustrationContainer: {
    marginBottom: SIZES.lg,
  },
  illustrationBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    padding: SIZES.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 180,
  },
  cloudContainer: {
    flex: 1,
    alignItems: 'center',
  },
  cloudEmoji: {
    fontSize: 50,
  },
  characterContainer: {
    flex: 1,
    alignItems: 'center',
  },
  characterEmoji: {
    fontSize: 50,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFF5F5',
    borderRadius: 15,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    minHeight: 200,
  },
  notebookLines: {
    flex: 1,
    backgroundColor: '#FFF5F5',
    borderRadius: 15,
  },
  lineContainer: {
    minHeight: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
    marginBottom: 4,
    paddingHorizontal: 8,
    width: '100%',
  },
  diaryContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    textAlign: 'left',
    flexWrap: 'wrap',
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FF6B6B',
    marginBottom: SIZES.lg,
  },
  errorBackButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 25,
  },
  errorBackButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  returnButton: {
    position: 'absolute',
    top: SIZES.xl * 2,
    right: SIZES.lg,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  returnButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  generatingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.lg,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: SIZES.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: screenHeight * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SIZES.lg,
  },
  newButton: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 25,
    flex: 1,
    marginRight: SIZES.sm,
    alignItems: 'center',
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  collectionButton: {
    backgroundColor: '#FFFACD',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 25,
    flex: 1,
    marginLeft: SIZES.sm,
    alignItems: 'center',
  },
  collectionButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DiaryScreen; 