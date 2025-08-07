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

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.4; // 카드 기본 크기
const CARD_HEIGHT = CARD_WIDTH * 1.5; // 높이 증가
const CARD_SPACING = screenWidth * 0.05; // 카드 간격 최소화

const concepts = [
  { id: 'space', name: '우주', image: images.concepts.space },
  { id: 'school', name: '학교', image: images.concepts.school },
  { id: 'farm', name: '밭', image: images.concepts.farm },
];

const ConceptScreen = () => {
  const { setCurrentStep, setSelectedConcept } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(1); // 학교가 기본 선택
  const [showModal, setShowModal] = useState(false);
  const [selectedConcept, setSelectedConceptState] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleBack = () => {
    setCurrentStep('signup');
  };

  const handleConceptSelect = (conceptId: string) => {
    const concept = concepts.find(c => c.id === conceptId);
    setSelectedConceptState(concept);
    setShowModal(true);
  };

  const handleConfirmSelection = () => {
    if (selectedConcept) {
      setSelectedConcept(selectedConcept.id as any);
      setCurrentStep('character');
    }
    setShowModal(false);
  };

  const handleCancelSelection = () => {
    setShowModal(false);
    setSelectedConceptState(null);
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + CARD_SPACING));
    const normalizedIndex = index % concepts.length;
    setCurrentIndex(normalizedIndex);
  };

  // 무한 스크롤을 위한 데이터 준비
  const infiniteConcepts = [...concepts, ...concepts, ...concepts, ...concepts, ...concepts];

  // 초기 위치 설정 (중간 세트의 학교 카드부터 시작)
  useEffect(() => {
    const initialIndex = concepts.length * 2 + 1; // 중간 세트의 학교 카드
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: initialIndex * (CARD_WIDTH + CARD_SPACING),
        animated: false,
      });
    }, 100);
  }, []);

  // 스크롤이 끝에 도달했을 때 무한 스크롤 처리
  const handleScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const maxOffset = (infiniteConcepts.length - concepts.length) * (CARD_WIDTH + CARD_SPACING);
    
    if (contentOffset >= maxOffset) {
      // 끝에 도달하면 중간으로 이동
      const middleIndex = concepts.length * 2 + 1;
      scrollViewRef.current?.scrollTo({
        x: middleIndex * (CARD_WIDTH + CARD_SPACING),
        animated: false,
      });
    } else if (contentOffset <= concepts.length * (CARD_WIDTH + CARD_SPACING)) {
      // 시작에 도달하면 중간으로 이동
      const middleIndex = concepts.length * 2 + 1;
      scrollViewRef.current?.scrollTo({
        x: middleIndex * (CARD_WIDTH + CARD_SPACING),
        animated: false,
      });
    }
  };

  return (
    <ImageBackground 
      source={images.backgrounds.main} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* 상단 텍스트 */}
        <View style={styles.headerContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.headerTitle}>오늘은 동물 나라에 가는 날 !</Text>
            <Text style={styles.headerSubtitle}>어디로 놀러갈까요?</Text>
          </View>
        </View>

        {/* 카드 슬라이더 */}
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
            {infiniteConcepts.map((concept, index) => {
              const actualIndex = index % concepts.length;
              const isSelected = actualIndex === currentIndex;
              
              return (
                <View key={`${concept.id}-${index}`} style={[
                  styles.cardWrapper,
                  isSelected && styles.selectedCardWrapper
                ]}>
                  <TouchableOpacity
                    style={[
                      styles.conceptCard,
                      isSelected && styles.selectedCard
                    ]}
                    onPress={() => handleConceptSelect(concept.id)}
                  >
                    <Image 
                      source={concept.image} 
                      style={styles.cardImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  {isSelected && (
                    <View style={styles.cardLabelContainer}>
                      <Text style={styles.selectedCardLabel}>
                        {concept.name}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* 확인 모달 */}
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelSelection}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {selectedConcept?.name}을 선택하시겠습니까?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={handleCancelSelection}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton]} 
                  onPress={handleConfirmSelection}
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
    paddingTop: SIZES.xl * 1.5,
    paddingHorizontal: SIZES.lg,
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: SIZES.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: (screenWidth - CARD_WIDTH) / 2,
  },
  cardWrapper: {
    alignItems: 'center',
    width: CARD_WIDTH + CARD_SPACING,
  },
  selectedCardWrapper: {
    zIndex: 2,
  },
  conceptCard: {
    width: CARD_WIDTH * 1.2,
    height: CARD_HEIGHT * 1.2,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
    opacity: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCard: {
    width: CARD_WIDTH * 2.2,
    height: CARD_HEIGHT * 2.2,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    opacity: 1,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  cardLabelContainer: {
    marginTop: SIZES.md,
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
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  selectedCardLabel: {
    color: '#FFB6C1',
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: 'rgba(255, 182, 193, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
});

export default ConceptScreen; 