import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';
import { apiService } from '../services/api';
import { DiaryEntry } from '../types';

// const { width: _screenWidth, height: _screenHeight } = Dimensions.get('window');

// 상세 화면 표시 타입
type ViewType = 'overview' | 'chat' | 'diary';

const DiaryDetailScreen = () => {
  const { 
    selectedCharacter, 
    selectedConcept,
    setCurrentStep,
    currentConversation,
    setCurrentDiary
  } = useAppStore();

  const [viewType, setViewType] = useState<ViewType>('overview');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [diaryData, setDiaryData] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 배경 이미지 가져오기
  const getBackground = () => {
    switch (selectedConcept) {
      case 'space':
        return images.backgrounds.space;
      case 'school':
        return images.backgrounds.school;
      case 'farm':
        return images.backgrounds.farm;
      default:
        return images.backgrounds.main;
    }
  };

  // 캐릭터 이미지 가져오기 (해피 상태로 고정)
  const getCharacterImage = () => {
    if (!selectedCharacter) return null;
    const imageKey = `${selectedCharacter.id}_happy`;
    return (images.emotions as any)[imageKey] || null;
  };

  // 채팅 기록 불러오기
  const loadChatHistory = async () => {
    if (!currentConversation?.roomId) return;

    setIsLoading(true);
    setError(null);

    try {
      const messages = await apiService.getChatMessages(currentConversation.roomId);
      console.log('채팅 기록 로드:', messages);
      setChatMessages(messages);
    } catch (loadError) {
      console.error('채팅 기록 로드 실패:', loadError);
      setError('채팅 기록을 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 일기 데이터 불러오기
  const loadDiaryData = async () => {
    if (!currentConversation?.roomId) return;

    setIsLoading(true);
    setError(null);

    try {
      const diary = await apiService.getDiary(currentConversation.roomId);
      console.log('일기 데이터 로드:', diary);
      setDiaryData(diary);
      setCurrentDiary(diary);
    } catch (diaryError) {
      console.error('일기 데이터 로드 실패:', diaryError);
      setError('일기를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 뒤로가기
  const handleBack = () => {
    setCurrentStep('collection');
  };

  // 기록 보기 (채팅 기록)
  const handleViewChat = () => {
    setViewType('chat');
    loadChatHistory();
  };

  // 일기 보기
  const handleViewDiary = () => {
    setViewType('diary');
    loadDiaryData();
  };

  // 개요로 돌아가기
  const handleBackToOverview = () => {
    setViewType('overview');
    setError(null);
  };

  // 개요 화면 렌더링
  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {/* 캐릭터 영역 */}
      <View style={styles.characterContainer}>
        {getCharacterImage() && (
          <Image source={getCharacterImage()} style={styles.characterImage} />
        )}
        <Text style={styles.characterName}>
          {selectedCharacter?.name || '캐릭터'}와의 대화
        </Text>
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleViewChat}>
          <Text style={styles.actionButtonText}>📝 기록</Text>
          <Text style={styles.actionButtonSubtext}>대화 내용 보기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleViewDiary}>
          <Text style={styles.actionButtonText}>📖 일기</Text>
          <Text style={styles.actionButtonSubtext}>그림일기 보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 채팅 기록 메시지 렌더링
  const renderChatMessage = (message: any, index: number) => {
    const isUser = message.userType === 'user';
    
    return (
      <View key={index} style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
        <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
          {message.content}
        </Text>
        <Text style={styles.messageTime}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  // 채팅 기록 화면 렌더링
  const renderChatHistory = () => (
    <View style={styles.chatContainer}>
      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToOverview}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>대화 기록</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>채팅 기록을 불러오고 있어요...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadChatHistory}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {chatMessages.map(renderChatMessage)}
        </ScrollView>
      )}
    </View>
  );

  // 일기 화면 렌더링
  const renderDiary = () => (
    <View style={styles.diaryContainer}>
      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToOverview}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>그림일기</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>일기를 불러오고 있어요...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDiaryData}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : diaryData ? (
        <ScrollView style={styles.diaryContent} showsVerticalScrollIndicator={false}>
          {/* 그림 영역 */}
          <View style={styles.diaryImageContainer}>
            {diaryData.imageUrl ? (
              <Image 
                source={{ uri: diaryData.imageUrl }}
                style={styles.diaryImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.noImageText}>그림이 없습니다</Text>
              </View>
            )}
          </View>

          {/* 일기 내용 */}
          <View style={styles.diaryTextContainer}>
            <Text style={styles.diaryText}>{diaryData.content}</Text>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>일기 데이터가 없습니다</Text>
        </View>
      )}
    </View>
  );

  if (!selectedCharacter) {
    return (
      <ImageBackground source={getBackground()} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>캐릭터 정보가 없습니다</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleBack}>
              <Text style={styles.retryButtonText}>뒤로가기</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={getBackground()} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* 메인 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackButton} onPress={handleBack}>
            <Text style={styles.headerBackButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>추억 보기</Text>
        </View>

        {/* 콘텐츠 영역 */}
        {viewType === 'overview' && renderOverview()}
        {viewType === 'chat' && renderChatHistory()}
        {viewType === 'diary' && renderDiary()}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: SIZES.lg,
    marginTop: SIZES.sm,
    borderRadius: 15,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  headerBackButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  overviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xl * 2,
  },
  characterImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: SIZES.lg,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: SIZES.lg,
    paddingHorizontal: SIZES.xl,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: SIZES.xs,
  },
  actionButtonSubtext: {
    fontSize: 14,
    color: '#666',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: SIZES.lg,
    marginTop: SIZES.sm,
    marginBottom: SIZES.lg,
    borderRadius: 15,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
  },
  messageContainer: {
    marginVertical: SIZES.xs,
    maxWidth: '80%',
    padding: SIZES.sm,
    borderRadius: 15,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    marginTop: SIZES.xs,
    opacity: 0.6,
  },
  diaryContainer: {
    flex: 1,
  },
  diaryContent: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
  },
  diaryImageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    minHeight: 200,
  },
  diaryImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    minHeight: 200,
  },
  noImageText: {
    fontSize: 16,
    color: '#666',
  },
  diaryTextContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  diaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.lg,
    borderRadius: 25,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default DiaryDetailScreen;