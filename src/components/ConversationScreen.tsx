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
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { characterGreetings } from '../utils/data';
import { COLORS, SIZES } from '../utils/constants';

const ConversationScreen = () => {
  const { 
    selectedCharacter, 
    selectedEmotion, 
    user,
    currentConversation,
    setCurrentConversation,
    addConversation,
    addMessage,
    setCurrentStep 
  } = useAppStore();

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

  if (!selectedCharacter || !selectedEmotion || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>정보가 누락되었습니다</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{selectedCharacter.name}</Text>
        <TouchableOpacity style={styles.endButton} onPress={handleEndConversation}>
          <Text style={styles.endButtonText}>대화 종료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {currentConversation?.messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessage : styles.characterMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.content}</Text>
          </View>
        ))}
        {isTyping && (
          <View style={[styles.messageContainer, styles.characterMessage]}>
            <Text style={styles.messageText}>...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>전송</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textSecondary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  endButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.sm,
  },
  endButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SIZES.md,
  },
  messageContainer: {
    marginBottom: SIZES.md,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    padding: SIZES.md,
    borderRadius: SIZES.md,
  },
  characterMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    padding: SIZES.md,
    borderRadius: SIZES.md,
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.textSecondary,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: SIZES.sm,
    padding: SIZES.md,
    marginRight: SIZES.sm,
    fontSize: 16,
    color: COLORS.text,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.sm,
    justifyContent: 'center',
  },
  sendButtonText: {
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

export default ConversationScreen; 