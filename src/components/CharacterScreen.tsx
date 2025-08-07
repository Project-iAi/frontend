import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';
import { Character } from '../types';
import { EmotionType } from '../types';

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
  } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [selectedCharacterState, setSelectedCharacterState] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // 선택된 컨셉에 따른 캐릭터 데이터
  const getCharacters = (): Array<{
    id: string;
    name: string;
    image: any;
    description: string;
  }> => {
    switch (selectedConcept) {
      case 'space':
        return [
          { 
            id: 'ham_1', 
            name: '햄삐', 
            image: images.allCharacters.ham.normal,
            description: '늘 활짝 웃고 작은 일에도 감탄할 줄 아는\n밝고 정 많은 친구 같은 성격을 가진 햄삐는 토성의 고리를 뛰어다니며\n친구들과 노는 걸 가장 좋아해요. 친구의 작은 변화도 먼저 눈치채고 다가가\n"괜찮아?"라고 묻는 다정함이 큰 장점이에요.'
          },
          { 
            id: 'fox_1', 
            name: '여삐', 
            image: images.allCharacters.fox.normal,
            description: '새로운 것을 보면 반드시 확인해야하는\n호기심과 용기를 가진 여삐는 달의 뒷면처럼 아무도 가지 않은 길을 찾아 모험하는 걸 즐겨요. 위험한 순간에도 눈을 반짝이며 나아갈 줄 아는 용기와\n실패해도 다시 도전하는 끈기가 강한 친구랍니다'
          },
          { 
            id: 'lion_1', 
            name: '사삐', 
            image: images.allCharacters.lion.normal,
            description: '느리지만 깊이 있게 말하는\n신뢰와 따뜻함을 주는 사삐는 태양 한가운데에서도 당당히 자리 잡고\n친구들의 이야기를 묵묵히 들어주는 존재예요. 무서운 상황에서도 침착하게 대처하는\n말투에 모두가 의지하죠.'
          },
        ];
      case 'school':
        return [
          { 
            id: 'chick_1', 
            name: '아리삐', 
            image: images.allCharacters.chick.normal,
            description: '"왜?"라는 질문을 끊임없이 던지고\n궁금한 건 꼭 직접 해봐야 직성이 풀리는 아리삐는 모든 수업 시간에 손을 제일 먼저 드는 병아리예요. 책상 위엔 항상 실험 도구가 잔뜩 놓여 있고\n실패해도 웃으면서 다시 시도해요.\n낙천적인 태도와 넘치는 호기심으로\n친구들에게 용기를 북돋아줘요.'
          },
          { 
            id: 'dog_1', 
            name: '멍삐', 
            image: images.allCharacters.dog.normal,
            description: '차분한 눈빛과 따뜻한 말투로 늘 주변을 편안하게 만드는\n깊이 있고 섬세한 멍삐는 감정에 공감하는 능력이 뛰어나\n친구들의 속마음을 단어 하나로 알아채요 고민을 글로 표현하게 도와주고\n조용히 어깨를 토닥이며 함께 울어주는 사람이기도 해요.'
          },
          { 
            id: 'cat_1', 
            name: '냥삐', 
            image: images.allCharacters.cat.normal,
            description: '감정이 표정과 목소리에 그대로 드러나고\n혼자 있어도 노래 부를 정도로 활달하고 외향적인 냥삐는 음악이 흐르는 곳이면 어디든 달려가\n춤추고 노래하는 고양이에요. 친구가 슬퍼 보이면 가볍게 기타를 치며 노래로 위로하고\n웃는 걸 보면 더 신나는 멜로디를 만들어요.'
          },
        ];
      case 'farm':
        return [
          { 
            id: 'rabbit_1', 
            name: '래삐', 
            image: images.allCharacters.rabbit.normal,
            description: '작은 일에도 크게 웃고\n주변 모두를 가족처럼 챙기는 정 많은 래삐는 땀 흘리며 일하는 걸 즐기고\n친구에게 직접 수확한 당근을 건네는 걸 가장 좋아하죠.\n친구가 힘들 땐 말없이 옆에 앉아\n함께 흙을 파는 다정한 토끼예요.'
          },
          { 
            id: 'rac_1', 
            name: '구리삐', 
            image: images.allCharacters.rac.normal,
            description: '새로운 냄새, 새로운 길, 새로운 사과가 보이면\n누구보다 먼저 달려가는 구리삐는 밭을 벗어나 산까지 누비며\n다양한 사과 품종을 수집하는 너구리예요. 늘 가방엔 나침반과 돋보기를 들고 다니고\n길을 잃어도 절대 당황하지 않아요.\n친구들도 함께 모험에 이끄는 용감한 리더랍니다.'
          },
          { 
            id: 'bear_1', 
            name: '고미삐', 
            image: images.allCharacters.bear.normal,
            description: '곰두르지 않고 천천히\n누구보다 진심으로 다가가는 고미삐는 말없이 친구 곁에 앉아주는 것만으로도\n큰 위로가 되는 곰이에요. 밭에서 자란 호박을 정성껏 손질하며\n그 사이사이 친구들의 이야기를 묵묵히 들어줘요.'
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

  const handleConfirmEmotion = () => {
    console.log('=== CharacterScreen Debug ===');
    console.log('selectedCharacterState:', selectedCharacterState);
    console.log('selectedEmotion (local):', globalSelectedEmotion);
    console.log('selectedConcept:', selectedConcept);
    console.log('=============================');
    
    if (selectedCharacterState) {
      // Character 타입에 맞는 객체 생성
      const character: Character = {
        id: selectedCharacterState.id,
        name: selectedCharacterState.name,
        concept: selectedConcept!,
        description: selectedCharacterState.description,
      };
      console.log('Created character:', character);
      
      // 상태 설정
      setSelectedCharacter(character);
      
      // 로컬 상태의 selectedEmotion을 사용
      const emotionToSet = globalSelectedEmotion || 'happy';
      console.log('Setting emotion to:', emotionToSet);
      
      // 전역 상태에 감정 설정
      setSelectedEmotion(emotionToSet as EmotionType);
      
      // 모달 닫기
      setShowEmotionModal(false);
      setSelectedCharacterState(null);
      
      // 다음 단계로 이동
      setCurrentStep('conversation');
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
  };

  const characters = getCharacters();
  const background = getBackground();
  const infiniteCharacters = [...characters, ...characters, ...characters];

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
          <Text style={styles.headerTitle}>캐릭터 선택</Text>
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
                <View key={`${character.id}-${index}`} style={[
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
                  onPress={handleConfirmEmotion}
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
    top: SIZES.xl,
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
    paddingTop: SIZES.xl * 2,
    paddingHorizontal: SIZES.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -SIZES.xl * 6,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    opacity: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  selectedCard: {
    width: CARD_WIDTH * 2.5,
    height: CARD_HEIGHT * 2.5,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
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
  },
  descriptionBox: {
    position: 'absolute',
    top: CARD_HEIGHT * 2.5 - SIZES.xl * 1.5,
    left: -(screenWidth * 0.95 - (CARD_WIDTH + CARD_SPACING)) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'rgba(255, 182, 193, 0.3)',
    width: screenWidth * 0.95,
    alignItems: 'center',
  },
  characterDescription: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 24,
    width: '100%',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: SIZES.xl,
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
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emotionModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: SIZES.xl,
    marginHorizontal: SIZES.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  emotionModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: SIZES.lg,
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