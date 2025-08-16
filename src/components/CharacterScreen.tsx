import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';
import { Character } from '../types';
import { EmotionType } from '../types';
import { Conversation } from '../types';
import { characterGreetings, getCharactersWithApiData } from '../utils/data';
import { apiService } from '../services/index';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.4;
const CARD_HEIGHT = CARD_WIDTH * 1.5;
const CARD_SPACING = screenWidth * 0.05;

const CharacterScreen = () => {
  const {
    selectedConcept,
    setSelectedCharacter,
    setSelectedEmotion,
    setCurrentStep,
    selectedEmotion: globalSelectedEmotion,
    setCurrentConversation,
    addConversation,
  } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [selectedCharacterState, setSelectedCharacterState] = useState<any>(null);
  const [apiCharacters, setApiCharacters] = useState<any[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // API에서 캐릭터 데이터 가져오기
  useEffect(() => {
    const loadApiCharacters = async () => {
      try {
        const characters = await apiService.getCharacters();
        setApiCharacters(characters);
        console.log('API 캐릭터 데이터 로드 완료:', characters);
      } catch (error) {
        console.warn('API 캐릭터 데이터 로드 실패:', error);
      }
    };
    
    loadApiCharacters();
  }, []);

  // 선택된 컨셉에 따른 캐릭터 데이터 (API 데이터와 연동)
  const getCharacters = (): Array<{
    id: string;
    name: string;
    image: any;
    description: string;
    apiId?: number;
  }> => {
    // API ID 매핑 (기존 이름과 설명은 유지)
    const apiIdMapping: { [key: string]: number } = {
      'ham_1': 1,    // 햄삐
      'fox_1': 4,    // 여삐  
      'lion_1': 7,   // 사삐
      'chick_1': 5,  // 아리삐
      'dog_1': 8,    // 멍삐
      'cat_1': 2,    // 냥삐
      'rabbit_1': 3, // 래삐
      'rac_1': 6,    // 구리삐
      'bear_1': 9,   // 고미삐
    };

    switch (selectedConcept) {
      case 'space':
        return [
          { 
            id: 'ham_1', 
            name: '햄삐', 
            image: images.allCharacters.ham.normal,
            description: '늘 활짝 웃고 밝은 햄삐는\n토성의 고리를 뛰어다니며\n친구들과 노는 걸 가장 좋아해요',
            apiId: apiIdMapping['ham_1']
          },
          { 
            id: 'fox_1', 
            name: '여삐', 
            image: images.allCharacters.fox.normal,
            description: '새로운 일에 대한 호기심이 강한 여삐는\n나아갈 줄 아는 용기와\n다시 도전하는 끈기가 강한 친구랍니다',
            apiId: apiIdMapping['fox_1']
          },
          { 
            id: 'lion_1', 
            name: '사삐', 
            image: images.allCharacters.lion.normal,
            description: '신뢰와 따뜻함을 주는 사삐는 태양\n친구들의 이야기를 묵묵히 들어준답니다\n모두가 의지하는 든든한 존재에요',
            apiId: apiIdMapping['lion_1']
          },
        ];
        case 'school':
          return [
            { 
              id: 'chick_1', 
              name: '아리삐', 
              image: images.allCharacters.chick.normal,
              description: '"왜?"라는 질문을 끊임없이 던지는 아리삐는\n낙천적인 태도와 호기심으로\n친구들에게 용기를 북돋아줘요',
              apiId: apiIdMapping['chick_1']
            },
            { 
              id: 'dog_1', 
              name: '멍삐', 
              image: images.allCharacters.dog.normal,
              description: '늘 주변을 편안하게 만드는 멍삐는\n감정에 공감하는 능력이 뛰어나\n힘들 떄면 함께 울어주기도 해요',
              apiId: apiIdMapping['dog_1']
            },
            { 
              id: 'cat_1', 
              name: '냥삐', 
              image: images.allCharacters.cat.normal,
              description: '활달하고 외향적인 냥삐는\n 음악이 흐르는 곳이면 어디든 달려가\n춤추고 노래하는 고양이에요',
              apiId: apiIdMapping['cat_1']
            },
          ];
        case 'farm':
          return [
            { 
              id: 'rabbit_1', 
              name: '래삐', 
              image: images.allCharacters.rabbit.normal,
              description: '작은 일에도 크게 웃고 정 많은 래삐는\n땀 흘리며 일하는 걸 즐기고\n친구에게 수확한 당근을 건네요.',
              apiId: apiIdMapping['rabbit_1']
            },
            { 
              id: 'rac_1', 
              name: '구리삐', 
              image: images.allCharacters.rac.normal,
              description: '모든 일에 누구보다 먼저 달려가는 구리삐는\n 밭을 벗어나 산까지 누비며\n친구들을 이끄는 용감한 리더랍니다.',
              apiId: apiIdMapping['rac_1']
            },
            { 
              id: 'bear_1', 
              name: '고미삐', 
              image: images.allCharacters.bear.normal,
              description: '천천히 진심으로 다가가는 고미삐는\n말없이 곁에 있는 것만으로도\n큰 위로가 되는 곰이에요\n모든 친구들의 이야기를 묵묵히 들어줘요.',
              apiId: apiIdMapping['bear_1']
            },
          ];
        default:
          return [];
      }
    };

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

  const getCharacterEmotionImages = (characterId: string) => {
    const characterMap: { [key: string]: { happy: any; sad: any; angry: any } } = {
      'ham_1': {
        happy: images.allCharacters.ham.happy,
        sad: images.allCharacters.ham.sad,
        angry: images.allCharacters.ham.angry,
      },
      'fox_1': {
        happy: images.allCharacters.fox.happy,
        sad: images.allCharacters.fox.sad,
        angry: images.allCharacters.fox.angry,
      },
      'lion_1': {
        happy: images.allCharacters.lion.happy,
        sad: images.allCharacters.lion.sad,
        angry: images.allCharacters.lion.angry,
      },
      'chick_1': {
        happy: images.allCharacters.chick.happy,
        sad: images.allCharacters.chick.sad,
        angry: images.allCharacters.chick.angry,
      },
      'dog_1': {
        happy: images.allCharacters.dog.happy,
        sad: images.allCharacters.dog.sad,
        angry: images.allCharacters.dog.angry,
      },
      'cat_1': {
        happy: images.allCharacters.cat.happy,
        sad: images.allCharacters.cat.sad,
        angry: images.allCharacters.cat.angry,
      },
      'rabbit_1': {
        happy: images.allCharacters.rabbit.happy,
        sad: images.allCharacters.rabbit.sad,
        angry: images.allCharacters.rabbit.angry,
      },
      'rac_1': {
        happy: images.allCharacters.rac.happy,
        sad: images.allCharacters.rac.sad,
        angry: images.allCharacters.rac.angry,
      },
      'bear_1': {
        happy: images.allCharacters.bear.happy,
        sad: images.allCharacters.bear.sad,
        angry: images.allCharacters.bear.angry,
      },
    };
    return characterMap[characterId] || characterMap.ham_1;
  };

  const handleBack = () => {
    setCurrentStep('concept');
  };

  const handleCharacterSelect = (characterId: string) => {
    const character = getCharacters().find(c => c.id === characterId);
    if (character) {
      setSelectedCharacterState(character);
      setShowEmotionModal(true);
    }
  };

  const handleEmotionSelect = (emotion: string) => {
    console.log('=== handleEmotionSelect Debug ===');
    console.log('Selected emotion:', emotion);
    console.log('Emotion type:', typeof emotion);
    console.log('=============================');
    setSelectedEmotion(emotion as EmotionType);
  };

  const handleConfirmEmotion = async () => {
    console.log('=== CharacterScreen Debug ===');
    console.log('selectedCharacterState:', selectedCharacterState);
    console.log('selectedEmotion (local):', globalSelectedEmotion);
    console.log('selectedConcept:', selectedConcept);
    console.log('=============================');
    
    if (selectedCharacterState) {
      try {
        // 1. 채팅방 생성 API 호출 (감정과 캐릭터 ID 포함)
        console.log('채팅방 생성 중...');
        const emotionToSet = globalSelectedEmotion || 'happy';
        
        // 감정을 한글로 변환
        const emotionMap: { [key: string]: string } = {
          'happy': '기쁨',
          'sad': '슬픔',
          'angry': '화남'
        };
        const emotionInKorean = emotionMap[emotionToSet] || '기쁨';
        
        // API ID가 있는 경우 사용, 없으면 기본값 1 사용
        const apiCharacterId = selectedCharacterState.apiId || 1;
        
        const chatRoom = await apiService.createChatRoom(apiCharacterId, emotionInKorean);
        console.log('채팅방 생성 완료:', chatRoom);

        // 2. 채팅방에 캐릭터 선택 API 호출
        try {
          await apiService.selectCharacter(chatRoom.id, apiCharacterId);
          console.log('캐릭터 선택 완료');
        } catch (characterError) {
          console.warn('캐릭터 선택 실패 (계속 진행):', characterError);
        }

        // 3. Character 타입에 맞는 객체 생성
        const character: Character = {
          id: selectedCharacterState.id,
          name: selectedCharacterState.name,
          concept: selectedConcept!,
          description: selectedCharacterState.description,
        };
        console.log('Created character:', character);
        
        // 3. 상태 설정
        setSelectedCharacter(character);
        
        // 4. 로컬 상태의 selectedEmotion을 사용 (상단에서 선언한 emotionToSet 재사용)
        console.log('Setting emotion to:', emotionToSet);
        
        // 5. 전역 상태에 감정 설정
        setSelectedEmotion(emotionToSet as EmotionType);
        
        // 6. 새로운 대화 생성 (roomId 포함)
        const newConversation: Conversation = {
          id: chatRoom.id.toString(), // 채팅방 ID 사용
          characterId: character.id,
          emotion: emotionToSet as EmotionType,
          messages: [
            {
              id: '1',
              sender: 'character' as const,
              content: (characterGreetings as any)[character.id] || '안녕하세요! 오늘은 어떤 이야기를 나눠볼까요?',
              timestamp: new Date(),
            },
          ],
          createdAt: new Date(),
          roomId: chatRoom.id, // 채팅방 ID 추가
        };
        
        // 7. 현재 대화 설정 및 목록에 추가 (roomId로 기록 복원 가능)
        setCurrentConversation(newConversation);
        addConversation(newConversation);
        
        // 8. 모달 닫기
        setShowEmotionModal(false);
        setSelectedCharacterState(null);

        // 9. ConversationScreen으로 이동
        setCurrentStep('conversation');
        
      } catch (error) {
        console.error('채팅방 생성 실패:', error);
        // 사용자에게 에러 알림
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
        // eslint-disable-next-line no-alert
        // React Native에서는 Alert를 사용하므로 대체
        // @ts-ignore
        import('react-native').then(({ Alert }) => {
          Alert.alert('오류', `채팅방 생성 실패: ${errorMessage}`);
        });
      }
    } else {
      console.log('Missing selectedCharacterState');
    }
  };

  const handleCancelEmotion = () => {
    setShowEmotionModal(false);
    setSelectedCharacterState(null);
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + CARD_SPACING));
    setCurrentIndex(index % getCharacters().length);
  };

  const handleScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + CARD_SPACING));
    const actualIndex = index % getCharacters().length;
    setCurrentIndex(actualIndex);
    
    // 무한 스크롤을 위한 위치 조정
    if (scrollViewRef.current) {
      const totalWidth = (CARD_WIDTH + CARD_SPACING) * getCharacters().length;
      const currentPosition = contentOffset;
      
      // 왼쪽 끝에 가까우면 오른쪽으로 이동
      if (currentPosition < totalWidth) {
        scrollViewRef.current.scrollTo({ 
          x: currentPosition + totalWidth, 
          animated: false 
        });
      }
      // 오른쪽 끝에 가까우면 왼쪽으로 이동
      else if (currentPosition > totalWidth * 2) {
        scrollViewRef.current.scrollTo({ 
          x: currentPosition - totalWidth, 
          animated: false 
        });
      }
    }
  };

  const characters = getCharacters();
  const background = getBackground();
  // 충분한 수의 캐릭터를 생성하여 무한 스크롤 효과 구현
  const infiniteCharacters = Array.from({ length: 15 }, (_, i) => {
    const characterIndex = i % characters.length;
    return { ...characters[characterIndex], uniqueId: i };
  });

  useEffect(() => {
    if (scrollViewRef.current) {
      const initialScrollPosition = (CARD_WIDTH + CARD_SPACING) * (characters.length + 1);
      scrollViewRef.current.scrollTo({ x: initialScrollPosition, animated: false });
    }
  }, [characters.length]);

  return (
    <ImageBackground 
      source={background} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* 상단 제목 */}
        <View style={styles.headerContainer}>
          <ImageBackground 
            source={require('../assets/images/icons/cloud1.png')}
            style={styles.titleBackground}
            resizeMode="contain"
          >
            <Text style={styles.headerTitle}>캐릭터 선택</Text>
          </ImageBackground>
        </View>

        {/* 캐릭터 슬라이더 */}
        <View style={styles.cardsContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            decelerationRate="fast"
          >
            {infiniteCharacters.map((character, index) => {
              const actualIndex = index % characters.length;
              const isSelected = actualIndex === currentIndex;
              
              return (
                <View key={`${character.uniqueId}-${index}`} style={[
                  styles.cardWrapper,
                  isSelected && styles.selectedCardWrapper
                ]}>
                  <TouchableOpacity
                    style={[
                      styles.characterCard,
                      isSelected && styles.selectedCard
                    ]}
                    onPress={() => handleCharacterSelect(character.id)}
                  >
                    <Image 
                      source={character.image} 
                      style={styles.cardImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  {isSelected && (
                    <>
                      <View style={styles.cardLabelContainer}>
                        <Text style={styles.selectedCardLabel}>
                          {character.name}
                        </Text>
                      </View>
                      <View style={styles.descriptionBox}>
                        <Text style={styles.characterDescription}>
                          {character.description}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* 감정 선택 모달 */}
        <Modal
          visible={showEmotionModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelEmotion}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.emotionModalContainer}>
              <Text style={styles.emotionModalTitle}>오늘의 감정은?</Text>
              
              <View style={styles.emotionOptionsContainer}>
                {selectedCharacterState && (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.emotionOption,
                        globalSelectedEmotion === 'happy' && styles.selectedEmotionOption
                      ]}
                      onPress={() => handleEmotionSelect('happy')}
                    >
                      <Image 
                        source={getCharacterEmotionImages(selectedCharacterState.id).happy}
                        style={styles.emotionImage}
                        resizeMode="contain"
                      />
                      <Text style={[
                        styles.emotionText,
                        globalSelectedEmotion === 'happy' && styles.selectedEmotionText
                      ]}>
                        기쁨
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.emotionOption,
                        globalSelectedEmotion === 'sad' && styles.selectedEmotionOption
                      ]}
                      onPress={() => handleEmotionSelect('sad')}
                    >
                      <Image 
                        source={getCharacterEmotionImages(selectedCharacterState.id).sad}
                        style={styles.emotionImage}
                        resizeMode="contain"
                      />
                      <Text style={[
                        styles.emotionText,
                        globalSelectedEmotion === 'sad' && styles.selectedEmotionText
                      ]}>
                        슬픔
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.emotionOption,
                        globalSelectedEmotion === 'angry' && styles.selectedEmotionOption
                      ]}
                      onPress={() => handleEmotionSelect('angry')}
                    >
                      <Image 
                        source={getCharacterEmotionImages(selectedCharacterState.id).angry}
                        style={styles.emotionImage}
                        resizeMode="contain"
                      />
                      <Text style={[
                        styles.emotionText,
                        globalSelectedEmotion === 'angry' && styles.selectedEmotionText
                      ]}>
                        화남
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <View style={styles.emotionModalButtons}>
                <TouchableOpacity 
                  style={[styles.emotionModalButton, styles.cancelButton]} 
                  onPress={handleCancelEmotion}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.emotionModalButton, 
                    styles.confirmButton,
                    !globalSelectedEmotion && styles.disabledButton
                  ]} 
                  onPress={() => {
                    console.log('🔘 확인 버튼 클릭됨');
                    console.log('🎭 현재 globalSelectedEmotion:', globalSelectedEmotion);
                    console.log('❓ 버튼 disabled 상태:', !globalSelectedEmotion);
                    console.log('==================');
                    handleConfirmEmotion();
                  }}
                  disabled={!globalSelectedEmotion}
                >
                  <Text style={styles.confirmButtonText}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    top: SIZES.xl * 1.5,
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
  headerContainer: {
    alignItems: 'center',
    paddingTop: SIZES.xl * 4,
    paddingHorizontal: SIZES.lg,
    height: 200,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#654321',
    fontFamily: 'Epilogue',
    textAlign: 'center',
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.lg,
    zIndex: 1,
    marginTop: SIZES.md,
  },
  titleBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 800,
    height: 200,
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -370 }],
    bottom: 0,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -SIZES.xl * 7,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: (screenWidth - CARD_WIDTH) / 2,
  },
  cardWrapper: {
    width: CARD_WIDTH + CARD_SPACING,
    position: 'relative',
  },
  selectedCardWrapper: {
    zIndex: 2,
  },
  characterCard: {
    width: CARD_WIDTH * 1.2,
    height: CARD_HEIGHT * 1.2,
    borderRadius: 20,
    elevation: 0,
    opacity: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  selectedCard: {
    width: CARD_WIDTH * 2.5,
    height: CARD_HEIGHT * 2.5,
    elevation: 0,
    opacity: 1,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  cardLabelContainer: {
    position: 'absolute',
    top: CARD_HEIGHT * 2.5 - SIZES.xl * 3,
    left: '50%',
    transform: [{ translateX: -50 }],
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 182, 193, 0.3)',
  },
  selectedCardLabel: {
    color: '#FFB6C1',
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: 'rgba(255, 182, 193, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Epilogue',
  },
  descriptionBox: {
    position: 'absolute',
    top: CARD_HEIGHT * 2.5 - SIZES.xl * 1.5,
    left: -(screenWidth * 0.85 - (CARD_WIDTH + CARD_SPACING)) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: SIZES.lg,
    elevation: 0,
    borderWidth: 2,
    borderColor: 'rgba(255, 182, 193, 0.3)',
    width: screenWidth * 0.85,
    alignItems: 'center',
  },
  characterDescription: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 24,
    width: '100%',
    fontFamily: 'Epilogue',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: SIZES.xl,
    marginHorizontal: SIZES.xl,
    elevation: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: SIZES.xl,
    fontFamily: 'Epilogue',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.lg,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SIZES.lg,
    borderRadius: 15,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#FFB6C1',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'Epilogue',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Epilogue',
  },
  emotionModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: SIZES.xl,
    marginHorizontal: SIZES.xl,
    elevation: 0,
  },
  emotionModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: SIZES.lg,
    fontFamily: 'Epilogue',
  },
  emotionOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SIZES.lg,
  },
  emotionOption: {
    alignItems: 'center',
    width: '30%',
    paddingVertical: SIZES.md,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedEmotionOption: {
    borderColor: '#FFB6C1',
  },
  emotionImage: {
    width: 60,
    height: 60,
    marginBottom: SIZES.sm,
  },
  emotionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Epilogue',
  },
  selectedEmotionText: {
    color: '#FFB6C1',
  },
  emotionModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.lg,
  },
  emotionModalButton: {
    flex: 1,
    paddingVertical: SIZES.lg,
    borderRadius: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.7,
  },
});

export default CharacterScreen; 