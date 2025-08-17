import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';
import { apiService } from '../services';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ChatHistoryScreen = () => {
  const { 
    selectedCharacter, 
    selectedConcept,
    currentConversation,
    setCurrentStep,
  } = useAppStore();

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

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

  // 캐릭터 이미지 가져오기
  const getCharacterImage = () => {
    if (!selectedCharacter) {
      return images.allCharacters.ham.variant;
    }
    const map: { [key: string]: any } = {
      'ham_1': images.allCharacters.ham.variant,
      'fox_1': images.allCharacters.fox.variant,
      'lion_1': images.allCharacters.lion.variant,
      'chick_1': images.allCharacters.chick.variant,
      'dog_1': images.allCharacters.dog.variant,
      'cat_1': images.allCharacters.cat.variant,
      'rabbit_1': images.allCharacters.rabbit.variant,
      'rac_1': images.allCharacters.rac.variant,
      'bear_1': images.allCharacters.bear.variant,
    };
    return map[selectedCharacter.id] || images.allCharacters.ham.variant;
  };

  // 저장된 채팅 메시지 불러오기
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!currentConversation?.roomId) {
        console.error('❌ roomId가 없습니다');
        setIsLoading(false);
        return;
      }

      try {
        console.log('📚 채팅 기록 불러오기 시작, roomId:', currentConversation.roomId);
        const messages = await apiService.getChatMessages(currentConversation.roomId);
        console.log('✅ 채팅 기록 불러오기 완료:', messages.length, '개');
        
        setChatMessages(messages);
        
        // 스크롤을 아래로
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } catch (error) {
        console.error('❌ 채팅 기록 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [currentConversation?.roomId]);

  const handleBack = () => {
    setCurrentStep('collection');
  };

  // 메시지 렌더링
  const renderMessage = (message: any, index: number) => {
    // 백엔드 API의 userType 필드 사용
    const isUser = message.userType === 'user';
    const messageTime = new Date(message.createdAt).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    console.log(`💬 메시지 ${index}: userType=${message.userType}, isUser=${isUser}, content="${message.content.slice(0, 20)}..."`);

    return (
      <View key={index} style={styles.messageContainer}>
        {/* 메시지 말풍선 */}
        <View 
          style={[
            styles.messageBubble,
            isUser ? styles.userMessage : styles.aiMessage
          ]}
        >
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.aiMessageText
          ]}>
            {message.content}
          </Text>
          <Text style={styles.messageTime}>{messageTime}</Text>
        </View>
      </View>
    );
  };

  if (!currentConversation) {
    return (
      <ImageBackground 
        source={getBackground()} 
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>채팅 기록이 없습니다</Text>
            <TouchableOpacity style={styles.errorBackButton} onPress={handleBack}>
              <Text style={styles.errorBackButtonText}>뒤로가기</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={getBackground()} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* 날짜/시간만 표시 */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            {new Date(currentConversation.createdAt).toLocaleString('ko-KR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })}
          </Text>
        </View>

        {/* 캐릭터 이미지 (대화 화면과 동일 크기/위치) */}
        <Image 
          source={getCharacterImage()} 
          style={styles.characterImage}
        />

        {/* 채팅 기록 */}
        <View style={styles.chatContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>채팅 기록을 불러오는 중...</Text>
            </View>
          ) : (
            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {chatMessages.map(renderMessage)}
              
              {/* 기록 끝 표시 */}
              <View style={styles.endIndicator}>
                <Text style={styles.endText}>━━━ 대화 끝 ━━━</Text>
              </View>
            </ScrollView>
          )}
          
          {/* 읽기 전용 안내 제거 */}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Platform.OS === 'ios' ? screenWidth * 1.1 : screenWidth, // iOS에서 가로 10% 확장
    height: screenHeight,
    // 전체 화면 활용 (공백 없음)
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: SIZES.xl * 2,
    left: SIZES.lg,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  backButtonText: {
    color: '#333333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleContainer: {
    position: 'absolute',
    top: SIZES.xl * 2,
    right: SIZES.lg,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    borderRadius: 15,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitleText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  characterImage: {
    width: 280,
    height: 280,
    position: 'absolute',
    top: screenHeight * 0.1,
    left: '50%',
    transform: [{ translateX: -140 }],
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  chatContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.8, // 0.7 → 0.8로 세로 길이 더 증가
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 0,
    zIndex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.lg,
  },
  messagesContent: {
    paddingBottom: SIZES.lg,
  },
  messageContainer: {
    marginBottom: SIZES.lg,
    maxWidth: '85%',
    alignSelf: 'stretch',
  },
  senderLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  userSenderLabel: {
    alignSelf: 'flex-end',
    color: '#0277BD',
  },
  aiSenderLabel: {
    alignSelf: 'flex-start',
    color: '#AD1457',
  },
  messageBubble: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E1F5FE', // 연한 하늘색
    borderBottomRightRadius: 5,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FCE4EC', // 연한 핑크색
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#5D4037', // 진갈색
  },
  aiMessageText: {
    color: '#5D4037', // 진갈색
  },
  messageTime: {
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
    textAlign: 'right',
  },
  endIndicator: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
  },
  endText: {
    fontSize: 14,
    color: '#CCCCCC',
    fontStyle: 'italic',
  },
  readOnlyInfo: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: 'rgba(255, 182, 193, 0.1)',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  readOnlyText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
  },
  errorText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  errorBackButton: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 20,
  },
  errorBackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatHistoryScreen;