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
    setCurrentConversation,
    addConversation,
    addMessage,
    setCurrentStep 
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
    if (!selectedCharacter) return null;
    
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
    
    return characterMap[selectedCharacter.id] || images.allCharacters.ham.variant;
  };

  useEffect(() => {
    if (selectedCharacter && !currentConversation) {
      // 새로운 대화 시작
      const newConversation = {
        id: Date.now().toString(),
        characterId: selectedCharacter.id,
        emotion: selectedEmotion!,
        messages: [],
        createdAt: new Date(),
      };
      setCurrentConversation(newConversation);
      addConversation(newConversation);

      // 캐릭터 인사말 추가
      setTimeout(() => {
        const greeting = characterGreetings[selectedCharacter.id as keyof typeof characterGreetings] || '안녕하세요!';
        const greetingMessage = {
          id: Date.now().toString(),
          sender: 'character' as const,
          content: greeting,
          timestamp: new Date(),
        };
        addMessage(greetingMessage);
      }, 1000);
    }
  }, [selectedCharacter, selectedEmotion, currentConversation, setCurrentConversation, addConversation, addMessage]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      content: inputText,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInputText('');
    setIsTyping(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const responses = [
        '정말 흥미로운 이야기네요!',
        '그렇군요, 더 자세히 들려주세요.',
        '와, 정말 멋져요!',
        '그런 일이 있었군요.',
        '정말 대단해요!',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'character' as const,
        content: randomResponse,
        timestamp: new Date(),
      };
      
      addMessage(aiMessage);
      setIsTyping(false);
    }, 1500);
  };

  const handleEndConversation = () => {
    Alert.alert(
      '대화 종료',
      '대화를 마치고 그림일기를 만들어볼까요?',
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: () => setCurrentStep('diary') }
      ]
    );
  };

  const handleBack = () => {
    setCurrentStep('character');
  };

  if (!selectedCharacter || !selectedEmotion) {
    console.log('=== ConversationScreen Debug ===');
    console.log('selectedCharacter:', selectedCharacter);
    console.log('selectedEmotion:', selectedEmotion);
    console.log('user:', user);
    console.log('selectedConcept:', selectedConcept);
    console.log('Type of selectedCharacter:', typeof selectedCharacter);
    console.log('Type of selectedEmotion:', typeof selectedEmotion);
    console.log('Type of user:', typeof user);
    console.log('===============================');
    
    let errorMessage = '정보가 누락되었습니다';
    if (!selectedCharacter) errorMessage += '\n- 캐릭터가 선택되지 않았습니다';
    if (!selectedEmotion) errorMessage += '\n- 감정이 선택되지 않았습니다';
    
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
          
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Text style={styles.errorDebugText}>
              Character: {selectedCharacter ? '있음' : '없음'}{'\n'}
              Emotion: {selectedEmotion ? '있음' : '없음'}{'\n'}
              User: {user ? '있음' : '없음'}
            </Text>
            <TouchableOpacity style={styles.errorBackButton} onPress={handleBack}>
              <Text style={styles.errorBackButtonText}>캐릭터 선택으로 돌아가기</Text>
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

        {/* 캐릭터 이미지 */}
        <View style={styles.characterContainer}>
          <Image 
            source={getCharacterImage()}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>

        {/* 채팅창 */}
        <View style={styles.chatContainer}>
          <ScrollView 
            style={styles.messagesContainer} 
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {currentConversation?.messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.sender === 'user' ? styles.userMessage : styles.characterMessage,
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.sender === 'user' ? styles.userMessageText : styles.characterMessageText,
                ]}>
                  {message.content}
                </Text>
              </View>
            ))}
            {isTyping && (
              <View style={[styles.messageContainer, styles.characterMessage]}>
                <Text style={[styles.messageText, styles.characterMessageText]}>...</Text>
              </View>
            )}
          </ScrollView>

          {/* 입력창 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="메시지를 입력하세요..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Text style={styles.sendButtonText}>전송</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 종료 버튼 */}
        <TouchableOpacity style={styles.endButton} onPress={handleEndConversation}>
          <Text style={styles.endButtonText}>종료</Text>
        </TouchableOpacity>
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
    width: screenWidth * 0.96,
    height: screenWidth * 0.96,
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
  endButtonText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: SIZES.lg,
    left: SIZES.lg,
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
    textAlign: 'center',
    color: '#FF6B6B',
    marginTop: SIZES.xl * 3,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
  },
  errorBackButton: {
    marginTop: SIZES.md,
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
});

export default ConversationScreen; 