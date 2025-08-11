import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { characterGreetings } from '../utils/data';
import { SIZES } from '../utils/constants';
import { images } from '../assets';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ConversationScreen = () => {
  const { 
    selectedCharacter, 
    selectedEmotion, 
    selectedConcept,
    user,
    currentConversation,
    setCurrentStep,
    addMessage,
    setCurrentConversation
  } = useAppStore();

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

  // 캐릭터 이미지 가져오기 (variant 버전 사용)
  const getCharacterImage = () => {
    if (!selectedCharacter) {
      console.log('selectedCharacter is null');
      return null;
    }
    
    console.log('selectedCharacter:', selectedCharacter);
    console.log('selectedCharacter.id:', selectedCharacter.id);
    
    const characterMap: { [key: string]: any } = {
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
    
    const image = characterMap[selectedCharacter.id] || images.allCharacters.ham.variant;
    console.log('Selected image:', image);
    return image;
  };

  const handleBack = () => {
    setCurrentStep('character');
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // 사용자 메시지 추가
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      content: inputText.trim(),
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setInputText('');

    // AI 응답 시뮬레이션
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'character' as const,
        content: `${selectedCharacter?.name}가 "${inputText.trim()}"에 대해 대답하고 있어요!`,
        timestamp: new Date(),
      };
      addMessage(aiResponse);
      setIsTyping(false);
    }, 2000);
  };

  const handleEndConversation = () => {
    Alert.alert(
      '대화 종료',
      '대화를 종료하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '종료',
          onPress: () => {
            setCurrentStep('diary');
          },
        },
      ]
    );
  };

  useEffect(() => {
    // 초기 대화 설정
    if (currentConversation && currentConversation.messages.length === 0) {
      const initialMessage = {
        id: '1',
        sender: 'character' as const,
        content: (characterGreetings as any)[selectedCharacter?.id || 'ham'] || '안녕하세요! 오늘은 어떤 이야기를 나눠볼까요?',
        timestamp: new Date(),
      };
      addMessage(initialMessage);
    }
  }, [currentConversation, selectedCharacter]);

  if (!currentConversation || !selectedCharacter || !user) {
    return (
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>대화 정보가 없습니다</Text>
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

        {/* 종료 버튼 */}
        <TouchableOpacity style={styles.endButton} onPress={handleEndConversation}>
          <Text style={styles.endButtonText}>종료</Text>
        </TouchableOpacity>

        {/* 캐릭터 이미지 */}
        <Image 
          source={getCharacterImage()} 
          style={styles.characterImage}
        />

        {/* 채팅 창 */}
        <View style={styles.chatContainer}>
          <ScrollView 
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContent}
          >
            {currentConversation.messages.map((message) => (
              <View 
                key={message.id} 
                style={[
                  styles.messageBubble,
                  message.sender === 'user' ? styles.userMessage : styles.characterMessage
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.sender === 'user' ? styles.userMessageText : styles.characterMessageText
                ]}>
                  {message.content}
                </Text>
              </View>
            ))}
            {isTyping && (
              <View style={styles.typingContainer}>
                <Text style={styles.typingText}>AI가 입력 중...</Text>
              </View>
            )}
          </ScrollView>

          {/* 입력창 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="메시지를 입력하세요..."
              placeholderTextColor="#999"
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendButtonText}>전송</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  safeArea: {
    flex: 1,
  },
  characterContainer: {
    position: 'absolute',
    top: screenHeight * 0.05,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 0,
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
    height: screenHeight * 0.65,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1,
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
    marginBottom: SIZES.md,
    maxWidth: '80%',
  },
  messageBubble: {
    marginBottom: SIZES.md,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFB6C1',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 20,
    borderBottomRightRadius: 5,
  },
  characterMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  characterMessageText: {
    color: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    marginRight: SIZES.md,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#F8F8F8',
  },
  sendButton: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  endButton: {
    position: 'absolute',
    top: SIZES.xl * 2,
    right: SIZES.lg,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
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
  endButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
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
  errorText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
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
  errorDebugText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: SIZES.md,
  },
  returnButton: {
    position: 'absolute',
    top: SIZES.xl * 2,
    right: SIZES.lg,
    zIndex: 10,
    backgroundColor: '#FFB6C1',
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
  returnButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  typingContainer: {
    alignSelf: 'center',
    paddingVertical: SIZES.md,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginTop: SIZES.md,
  },
  typingText: {
    fontSize: 14,
    color: '#666',
  },
  sendButtonDisabled: {
    backgroundColor: '#D3D3D3',
    opacity: 0.7,
  },
});

export default ConversationScreen; 