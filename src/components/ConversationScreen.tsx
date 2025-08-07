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
    setCurrentStep 
  } = useAppStore();

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
      'ham': images.allCharacters.ham.variant,
      'fox': images.allCharacters.fox.variant,
      'lion': images.allCharacters.lion.variant,
      'chick': images.allCharacters.chick.variant,
      'dog': images.allCharacters.dog.variant,
      'cat': images.allCharacters.cat.variant,
      'rabbit': images.allCharacters.rabbit.variant,
      'rac': images.allCharacters.rac.variant,
      'bear': images.allCharacters.bear.variant,
    };
    
    return characterMap[selectedCharacter.id] || images.allCharacters.ham.variant;
  };

  const handleBack = () => {
    setCurrentStep('collection');
  };

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
        {/* 우측 상단 돌아가기 버튼 */}
        <TouchableOpacity style={styles.returnButton} onPress={handleBack}>
          <Text style={styles.returnButtonText}>돌아가기</Text>
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
          </ScrollView>
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
    width: 300,
    height: 300,
    position: 'absolute',
    bottom: -60,
    right: -50,
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
});

export default ConversationScreen; 