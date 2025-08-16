import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';
import { apiService } from '../services/index';

const { height: screenHeight } = Dimensions.get('window');

const DiaryScreen = () => {
  const {
    currentConversation,
    selectedCharacter,
    user,
    setCurrentStep,
    currentDiary,
    setCurrentDiary,
  } = useAppStore();

  const [isGenerating, setIsGenerating] = useState(true);
  const [diaryContent, setDiaryContent] = useState('');
  const [textLinesCount, setTextLinesCount] = useState(0);
  const LINE_HEIGHT = 32; // styles.diaryContent.lineHeight와 동일하게 유지 (행간 확대)
  const UNDERLINE_OFFSET = 4; // 글과 밑줄 사이 간격
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    setCurrentStep('collection');
  };

  const handleViewCollection = () => {
    setCurrentStep('collection');
  };

  const handleNewConversation = () => {
    setCurrentStep('concept');
  };

  // 사용하지 않는 유틸 제거됨

  // 감정 한글/이모지 매핑
  const emotionToKorean = (emotion?: string) => {
    if (!emotion) return undefined;
    const map: Record<string, string> = { happy: '기쁨', sad: '슬픔', angry: '화남' };
    return map[emotion] || undefined;
  };
  const emotionToEmoji = (emotion?: string) => {
    if (!emotion) return undefined;
    const map: Record<string, string> = { happy: '😊', sad: '😢', angry: '😠' };
    return map[emotion] || undefined;
  };

  const formatDiaryDateTimeKST = () => {
    const base = currentDiary?.createdAt ? new Date(currentDiary.createdAt) : new Date();
    // 날짜
    const ymd = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(base);
    // 시간 (오전/오후 hh:mm)
    const hm = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(base);
    // ymd는 2025. 08. 15 형태 → 년/월/일로 치환
    const [year, month, day] = ymd.replace(/\s/g, '').split('.').filter(Boolean);
    const dateText = `${year}년 ${Number(month)}월 ${Number(day)}일`;
    return `${dateText} ${hm}`;
  };

  useEffect(() => {
    const fetchDiary = async () => {
      // currentDiary가 있으면 그것을 사용 (일기 생성 직후)
      if (currentDiary) {
        setDiaryContent(currentDiary.content);
        setIsGenerating(false);
        return;
      }

      // currentDiary가 없고 roomId가 있으면 API에서 조회
      if (currentConversation?.roomId) {
        setIsLoading(true);
        setError(null);
        
        try {
          console.log('일기 조회 중...', currentConversation.roomId);
          const diary = await apiService.getDiary(currentConversation.roomId);
          console.log('일기 조회 완료:', diary);
          
          setDiaryContent(diary.content);
          // 스토어 타입(DiaryEntry)에 맞게 createdAt을 문자열로 변환
          setCurrentDiary({
            ...diary,
            createdAt: new Date(diary.createdAt),
          } as any);
          setIsGenerating(false);
          
        } catch (diaryError) {
          console.error('일기 조회 실패:', diaryError);
          setError('일기를 불러올 수 없습니다.');
          setIsGenerating(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDiary();
  }, [currentDiary, currentConversation?.roomId, setCurrentDiary]);

  // 기본 필수 정보 체크
  if (!selectedCharacter || !user) {
    return (
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>정보가 없습니다</Text>
            <TouchableOpacity style={styles.errorBackButton} onPress={handleBack}>
              <Text style={styles.errorBackButtonText}>뒤로가기</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // 오류 상태
  if (error) {
    return (
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.errorBackButton} 
              onPress={() => {
                setError(null);
                setIsLoading(true);
              }}
            >
              <Text style={styles.errorBackButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (isGenerating || isLoading) {
    return (
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.generatingContainer}>
            <View style={styles.loadingCard}>
              <Text style={styles.generatingText}>
                {isLoading ? '일기를 불러오고 있어요...' : '일기를 생성하고 있어요...'}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // 일기 데이터가 없는 경우
  if (!currentDiary) {
    return (
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>아직 일기가 생성되지 않았습니다</Text>
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
      source={images.backgrounds.main} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.diaryCard}>
            {/* 제목만 표시 (오늘의 기분은 날짜 옆에서만) */}
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{`${selectedCharacter?.name ?? '캐릭터'}와의 대화`}</Text>
            </View>
            {/* 날짜 + 오늘의 기분 */}
            <View style={styles.dateRow}>
              <Text style={styles.dateText}>{formatDiaryDateTimeKST()}</Text>
              {currentConversation?.emotion && (
                <Text style={styles.moodText}>
                  오늘의 기분: {emotionToKorean(currentConversation.emotion)}{emotionToEmoji(currentConversation.emotion) ? ` ${emotionToEmoji(currentConversation.emotion)}` : ''}
                </Text>
              )}
            </View>

            <View style={styles.illustrationContainer}>
              <View style={styles.illustrationBox}>
                {currentDiary?.imageUrl ? (
                  <Image 
                    source={{ uri: currentDiary.imageUrl }}
                    style={styles.generatedImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.loadingImageContainer}>
                    <Text style={styles.loadingText}>그림을 그리는 중...</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.notebookLines}>
                <View pointerEvents="none" style={styles.linesOverlay}>
                  {Array.from({ length: Math.max(textLinesCount, 1) }).map((_, idx) => (
                    <View key={idx} style={[styles.noteLine, { top: (idx + 1) * LINE_HEIGHT + UNDERLINE_OFFSET }]} />
                  ))}
                </View>
                <Text 
                  style={styles.diaryContent}
                  onLayout={(e) => {
                    const h = e.nativeEvent.layout.height;
                    const lines = Math.ceil(h / LINE_HEIGHT);
                    if (lines !== textLinesCount) {
                      setTextLinesCount(lines);
                    }
                  }}
                >
                  {diaryContent}
                </Text>
              </View>
            </View>
          </View>

          {/* 버튼 영역 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.newButton} onPress={handleNewConversation}>
              <Text style={styles.newButtonText}>다시 놀러가기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.collectionButton} onPress={handleViewCollection}>
              <Text style={styles.collectionButtonText}>기록 보러가기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  content: {
    flexGrow: 1,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.xl,
  },
  backButton: {
    position: 'absolute',
    top: SIZES.lg,
    left: SIZES.lg,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
  },
  diaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: SIZES.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: screenHeight * 0.7,
  },
  titleContainer: {
    marginBottom: SIZES.xs,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  dateRow: {
    marginBottom: SIZES.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  moodText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
  },
  illustrationContainer: {
    marginBottom: SIZES.lg,
  },
  illustrationBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    padding: SIZES.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 180,
  },
  cloudContainer: {
    flex: 1,
    alignItems: 'center',
  },
  cloudEmoji: {
    fontSize: 50,
  },
  characterContainer: {
    flex: 1,
    alignItems: 'center',
  },
  characterEmoji: {
    fontSize: 50,
  },
  generatedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  loadingImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFF5F5',
    borderRadius: 15,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    minHeight: 200,
  },
  notebookLines: {
    flex: 1,
    backgroundColor: '#FFF5F5',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  linesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  noteLine: {
    position: 'absolute',
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    width: '100%',
  },
  lineContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  diaryContent: {
    fontSize: 16,
    lineHeight: 32,
    color: '#333333',
    textAlign: 'left',
    flexWrap: 'wrap',
    width: '100%',
    zIndex: 1,
    backgroundColor: 'transparent',
    fontFamily: 'Epilogue',
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FF6B6B',
    marginBottom: SIZES.lg,
  },
  errorBackButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 25,
  },
  errorBackButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  returnButton: {
    position: 'absolute',
    top: SIZES.xl * 2,
    right: SIZES.lg,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  returnButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  generatingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.lg,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: SIZES.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: screenHeight * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generatingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SIZES.lg,
  },
  newButton: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 25,
    flex: 1,
    marginRight: SIZES.sm,
    alignItems: 'center',
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  collectionButton: {
    backgroundColor: '#FFFACD',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 25,
    flex: 1,
    marginLeft: SIZES.sm,
    alignItems: 'center',
  },
  collectionButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DiaryScreen; 