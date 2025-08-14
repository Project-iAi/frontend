import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { characterGreetings } from '../utils/data';
import { SIZES } from '../utils/constants';
import { images } from '../assets';
import { apiService, socketService, SocketMessage, ProcessingStatus } from '../services/api';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import AudioRecord from 'react-native-audio-record';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ConversationScreen = () => {
  const { 
    selectedCharacter, 
    selectedConcept,
    user,
    currentConversation,
    setCurrentStep,
    addMessage,
    setCurrentDiary,
    addDiaryEntry
  } = useAppStore();

  const [inputText, setInputText] = useState('');
  const [_isTyping, _setIsTyping] = useState(false);
  // API 관련 state
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);
  // 녹음 상태
  const [isRecording, setIsRecording] = useState(false);
  const [recordingHint, setRecordingHint] = useState<string | null>(null);
  const audioRecordRef = useRef<any>(null);
  
  const socketRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const roomId = currentConversation?.roomId;

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

  // Sound 라이브러리 초기화
  React.useEffect(() => {
    Sound.setCategory('Playback');
    if (Platform.OS === 'android') {
      Sound.setActive(true);
    }
    return () => {
      if (currentSound) {
        currentSound.release();
      }
    };
  }, [currentSound]);

  // 오디오 레코더 초기화 (iOS/Android)
  useEffect(() => {
    const initRecorder = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('마이크 권한 거부됨');
            return;
          }
        } else {
          const res = await request(PERMISSIONS.IOS.MICROPHONE);
          if (res !== RESULTS.GRANTED) {
            console.warn('iOS 마이크 권한 거부됨:', res);
            return;
          }
        }
        AudioRecord.init({
          sampleRate: 16000,
          channels: 1,
          bitsPerSample: 16,
          wavFile: `voice_${Date.now()}.wav`,
        });
        audioRecordRef.current = AudioRecord;
        console.log('🎛️ AudioRecord 초기화 완료');
      } catch (e) {
        console.error('AudioRecord 초기화 실패:', e);
      }
    };
    initRecorder();
  }, []);

  const requestMicPermissionAndroid = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (e) {
      console.error('마이크 권한 요청 실패:', e);
      return false;
    }
  };

  const startRecording = async () => {
    if (isRecording) return;
    if (!roomId) {
      Alert.alert('오류', '채팅방 정보가 없습니다.');
      return;
    }
    try {
      console.log('🎙️ 녹음 시작');
      setIsRecording(true);
      setRecordingHint('녹음 중...');
      if (audioRecordRef.current) audioRecordRef.current.start();
    } catch (e) {
      console.error('녹음 시작 실패:', e);
      setIsRecording(false);
      setRecordingHint(null);
      Alert.alert('오류', '녹음을 시작할 수 없습니다.');
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    try {
      console.log('🛑 녹음 중지');
      const filePath: string | null = audioRecordRef.current ? await audioRecordRef.current.stop() : null;
      setIsRecording(false);
      setRecordingHint(null);
      console.log('📁 파일 경로:', filePath);
      if (!filePath || !socketRef.current || !roomId) return;
      const base64Audio = await RNFS.readFile(filePath, 'base64');
      console.log('📦 전송 길이:', base64Audio.length);
      socketService.sendVoiceMessage(socketRef.current, roomId, base64Audio);
    } catch (e) {
      console.error('녹음 중지 실패:', e);
    }
  };

  // 오디오 재생 함수
  const playAudioFromBase64 = useCallback(async (base64Data: string) => {
    try {
      console.log('🎵 오디오 재생 시작');
      console.log('📊 Base64 데이터 길이:', base64Data.length);

      if (currentSound) {
        console.log('🧹 이전 사운드 정리');
        currentSound.stop();
        currentSound.release();
        setCurrentSound(null);
      }

      const tempFilePath = `${RNFS.DocumentDirectoryPath}/temp_audio_${Date.now()}.wav`;
      console.log('📁 임시 파일 경로:', tempFilePath);

      await RNFS.writeFile(tempFilePath, base64Data, 'base64');
      console.log('💾 오디오 파일 저장 완료');

      const exists = await RNFS.exists(tempFilePath);
      console.log('📂 파일 존재 확인:', exists);
      if (!exists) {
        throw new Error('파일이 생성되지 않았습니다');
      }

      const sound = new Sound(tempFilePath, '', (error) => {
        if (error) {
          console.error('❌ 사운드 로드 실패:', error);
          Alert.alert('오류', `사운드 로드 실패: ${error.message}`);
          return;
        }

        console.log('✅ 사운드 로드 성공, 재생 시작');
        sound.setVolume(1.0);

        sound.play((success) => {
          if (success) {
            console.log('🎉 오디오 재생 완료');
          } else {
            console.error('❌ 오디오 재생 실패');
          }
          sound.release();
          RNFS.unlink(tempFilePath).catch(err => console.warn('⚠️ 임시 파일 삭제 실패:', err));
          setCurrentSound(null);
        });
      });
      
      setCurrentSound(sound);
      
    } catch (error) {
      console.error('💥 오디오 재생 오류:', error);
      Alert.alert('오류', `음성을 재생할 수 없습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }, [currentSound]);

  // WebSocket 연결 설정 (실시간 채팅 전용)
  useEffect(() => {
    if (currentConversation?.roomId) {
      console.log('실시간 채팅 - WebSocket 연결 시작, roomId:', currentConversation.roomId);
      
      const socket = socketService.connect();
      socketRef.current = socket;

      // 연결 성공
      socket.on('connect', () => {
        console.log('WebSocket 연결됨');
        setIsConnected(true);
        if (currentConversation.roomId) {
          socketService.joinRoom(socket, currentConversation.roomId);
        }
      });

      // 연결 해제
      socket.on('disconnect', () => {
        console.log('WebSocket 연결 해제됨');
        setIsConnected(false);
      });

      // 메시지 수신
      socket.on('message', (message: SocketMessage) => {
        console.log('새 메시지 수신:', message);
        
        setMessages(prev => {
          if (message.sender === 'ai') {
            const existingMessage = prev.find(msg =>
              msg.sender === 'ai' &&
              msg.text === message.text &&
              Math.abs(new Date(msg.timestamp).getTime() - new Date(message.timestamp).getTime()) < 5000
            );

            if (existingMessage) {
              if (message.type === 'voice' && message.audioData) {
                console.log('기존 텍스트 메시지를 음성 메시지로 업데이트');
                const updatedMessages = prev.map(msg =>
                  msg === existingMessage
                    ? { ...msg, type: 'voice' as const, audioData: message.audioData }
                    : msg
                );
                console.log('AI 음성 메시지 수신, 자동 재생 시작');
                playAudioFromBase64(message.audioData);
                return updatedMessages;
              } else {
                console.log('중복 텍스트 메시지 무시');
                return prev;
              }
            }
          }
          
          const newMessages = [...prev, message];
          if (message.sender === 'ai' && message.type === 'voice' && message.audioData) {
            console.log('AI 음성 메시지 수신, 자동 재생 시작');
            playAudioFromBase64(message.audioData);
          }
          return newMessages;
        });
        
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });

      // 처리 상태 업데이트
      socket.on('processing', (status: ProcessingStatus) => {
        console.log('처리 상태 업데이트:', status);
        setProcessingStatus(status);
        setIsProcessing(status.stage !== 'complete');
      });

      // 세션 타임아웃
      socket.on('sessionTimeout', (data: any) => {
        console.log('세션 타임아웃:', data);
        Alert.alert('세션 만료', '20초 동안 대화가 없어 자동으로 일기를 생성합니다.', [
          { text: '확인', onPress: () => createDiary() }
        ]);
      });

      // 오류 처리
      socket.on('error', (error: any) => {
        console.error('Socket 오류:', error);
        Alert.alert('오류', '서버 연결에 문제가 발생했습니다.');
      });

      return () => {
        socketService.disconnect(socket);
      };
    }
  }, [currentConversation?.roomId, playAudioFromBase64, createDiary]);

  // 텍스트 메시지 전송
  const sendMessage = async () => {
    if (!inputText.trim() || !socketRef.current || !roomId || isSending) {
      return;
    }

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      console.log('메시지 전송:', messageText);
      socketService.sendMessage(socketRef.current, roomId, messageText);
      
      // 사용자 메시지를 즉시 UI에 추가
      const userMessage: SocketMessage = {
        id: Date.now(),
        sender: 'user',
        text: messageText,
        type: 'text',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      Alert.alert('오류', '메시지 전송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  // 일기 생성
  const createDiary = useCallback(async () => {
    if (!roomId) {
      Alert.alert('오류', '채팅방 정보가 없습니다.');
      return;
    }

    try {
      console.log('일기 생성 중...');
      const diary = await apiService.createDiary(roomId);
      console.log('일기 생성 완료:', diary);
      
      // 스토어에 일기 데이터 저장 (createdAt을 string으로 변환)
      const diaryEntry = {
        ...diary,
        createdAt: diary.createdAt instanceof Date ? diary.createdAt.toISOString() : diary.createdAt
      };
      setCurrentDiary(diaryEntry);
      addDiaryEntry(diaryEntry);
      
      // DiaryScreen으로 이동
      setCurrentStep('diary');
      
    } catch (error) {
      console.error('일기 생성 실패:', error);
      Alert.alert('오류', '일기 생성에 실패했습니다.');
    }
  }, [roomId, setCurrentDiary, addDiaryEntry, setCurrentStep]);

  const handleBack = () => {
    setCurrentStep('character');
  };

  const handleEndConversation = () => {
    Alert.alert(
      '대화 종료',
      '대화를 종료하고 일기를 생성하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '일기 생성',
          onPress: () => createDiary(),
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
  }, [currentConversation, selectedCharacter, addMessage]);

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
          {/* 연결 상태 표시 - 채팅창 상단 */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {isConnected ? '🟢 연결됨' : '🔴 연결 안됨'}
            </Text>
          </View>
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((message) => (
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
                  {message.text}
                </Text>
                {/* 다시 듣기 버튼 (AI 음성 메시지만) */}
                {message.sender === 'ai' && message.type === 'voice' && message.audioData && (
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => playAudioFromBase64(message.audioData!)}
                  >
                    <Text style={styles.playButtonText}>🔊 다시 듣기</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {/* 처리 상태 표시 */}
            {isProcessing && processingStatus && (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="small" color="#FFB6C1" />
                <Text style={styles.processingText}>{processingStatus.message}</Text>
              </View>
            )}
          </ScrollView>

          {/* 입력창 */}
          <View style={styles.inputContainer}>
            {/* 마이크 버튼 */}
            <TouchableOpacity
              style={[styles.micButton, isRecording && styles.micButtonRecording]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Text style={styles.micButtonText}>{isRecording ? '⏹️' : '🎤'}</Text>
            </TouchableOpacity>
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
              style={[styles.sendButton, (!inputText.trim() || !isConnected || isSending) && styles.sendButtonDisabled]} 
              onPress={sendMessage}
              disabled={!inputText.trim() || !isConnected || isSending}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.sendButtonText}>전송</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        {/* 녹음 상태 표시 */}
        {recordingHint && (
          <View style={styles.recordingContainer}>
            <ActivityIndicator size="small" color="#FF3B30" />
            <Text style={styles.recordingText}>{recordingHint}</Text>
          </View>
        )}
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
    backgroundColor: '#E1F5FE', // 연한 하늘색
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 20,
    borderBottomRightRadius: 5,
  },
  characterMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FCE4EC', // 연한 핑크색
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
    color: '#5D4037', // 진갈색
  },
  characterMessageText: {
    color: '#5D4037', // 진한 핑크색
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
  statusContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  playButton: {
    marginTop: SIZES.xs,
    padding: SIZES.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    fontSize: 12,
    color: '#666',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    backgroundColor: 'rgba(255, 182, 193, 0.2)',
    borderRadius: 10,
    marginTop: SIZES.md,
  },
  processingText: {
    marginLeft: SIZES.sm,
    fontSize: 14,
    color: '#FFB6C1',
    fontWeight: '500',
  },
  // STT 마이크 버튼/상태
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFB6C1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  micButtonRecording: {
    backgroundColor: '#FF3B30',
  },
  micButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
  },
  recordingText: {
    marginLeft: SIZES.sm,
    color: '#FF3B30',
  },
});

export default ConversationScreen;