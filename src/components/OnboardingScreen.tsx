import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';

const { width: screenWidth } = Dimensions.get('window');

const OnboardingScreen = () => {
  const { setCurrentStep } = useAppStore();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef(null);

  const handleStart = () => {
    try {
      setCurrentStep('signup');
    } catch (error) {
      console.error('Error navigating to signup:', error);
      Alert.alert('오류', '화면 이동 중 오류가 발생했습니다.');
    }
  };

  const onboardingPages = [
    {
      id: 1,
      title: '안녕! 오늘은 마음 속으로\n여행을 떠나볼 거야',
      image: require('../assets/images/onboarding/page1.png'),
      isLogo: false,
    },
    {
      id: 2,
      title: '마음 속 이야기를 들려줄\n준비가 됐나요?',
      image: require('../assets/images/onboarding/page2.png'),
      isLogo: false,
    },
    {
      id: 3,
      title: '하루하루 그림일기로\n기록을 남겨요',
      image: require('../assets/images/onboarding/page3.png'),
      isLogo: false,
    },
    {
      id: 4,
      title: '매일 쌓이는 추억을\n확인하세요',
      image: require('../assets/images/onboarding/page4.png'),
      isLogo: false,
    },
  ];

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const page = Math.round(contentOffset / screenWidth);
    setCurrentPage(page);
  };

  const goToPage = (pageIndex: number) => {
    if (scrollViewRef.current) {
      (scrollViewRef.current as any).scrollTo({
        x: pageIndex * screenWidth,
        animated: true,
      });
    }
    setCurrentPage(pageIndex);
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          {/* 온보딩 슬라이드 */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.scrollView}
          >
            {/* 로고 페이지 */}
            <View style={styles.logoPageContainer}>
              <Image 
                source={images.logos.iai} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            
            {/* 온보딩 페이지들 */}
            {onboardingPages.map((page) => (
              <View key={page.id} style={styles.onboardingPageContainer}>
                {/* 페이지 제목 */}
                <View style={styles.titleContainer}>
                  <ImageBackground 
                    source={require('../assets/images/icons/cloud1.png')}
                    style={styles.titleBackground}
                    resizeMode="contain"
                  >
                    <Text style={styles.pageTitle}>
                      {page.title}
                    </Text>
                  </ImageBackground>
                </View>

                {/* 온보딩 이미지 */}
                <View style={styles.onboardingImageContainer}>
                  <Image 
                    source={page.image} 
                    style={styles.onboardingImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          {/* 슬라이드 안내 화살표 */}
          {currentPage === 0 && (
            <View style={styles.arrowRightContainer}>
              <Text style={styles.arrowText}>››</Text>
            </View>
          )}
          {currentPage > 0 && currentPage < 4 && (
            <View style={styles.arrowContainer}>
              <Text style={styles.arrowText}>‹‹</Text>
              <Text style={styles.arrowText}>››</Text>
            </View>
          )}
          {currentPage === 4 && (
            <View style={styles.arrowLeftContainer}>
              <Text style={styles.arrowText}>‹‹</Text>
            </View>
          )}

          {/* 점 인디케이터 */}
          <View style={styles.indicatorContainer}>
            {[0, ...onboardingPages.map((_, index) => index + 1)].map((_, _index) => (
              <TouchableOpacity
                key={_index}
                style={[
                  styles.indicatorDot,
                  currentPage === _index && styles.activeIndicatorDot
                ]}
                onPress={() => goToPage(_index)}
              />
            ))}
          </View>

          {/* 버튼들 */}
          <View style={styles.buttonContainer}>
            {currentPage === 4 && (
              <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                <Text style={styles.startButtonText}>시작하기</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  backgroundImage: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    paddingHorizontal: SIZES.xl,
    paddingTop: -SIZES.lg,
    paddingBottom: SIZES.sm,
    width: '100%',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#654321',
    textAlign: 'center',
    lineHeight: 34,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.xl,
    fontFamily: 'Epilogue',
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  titleBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 80,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.xl,
    width: 700,
    height: 280,
    marginTop: -SIZES.lg,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  pageContainer: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SIZES.sm,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.lg,
  },
  logoImage: {
    width: screenWidth,
    height: screenWidth,
  },
  onboardingImage: {
    width: screenWidth,
    height: screenWidth * 1.4,
  },
  pageImage: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.lg,
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D3D3D3',
    marginHorizontal: 8,
  },
  activeIndicatorDot: {
    backgroundColor: '#D2B48C',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  arrowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.xl,
    pointerEvents: 'none',
  },
  arrowRightContainer: {
    position: 'absolute',
    top: '50%',
    right: SIZES.xl,
    pointerEvents: 'none',
  },
  arrowLeftContainer: {
    position: 'absolute',
    top: '50%',
    left: SIZES.xl,
    pointerEvents: 'none',
  },
  arrowText: {
    fontSize: 32,
    color: '#D2B48C',
    opacity: 0.6,
    fontFamily: 'Epilogue',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
    paddingBottom: SIZES.xl,
  },
  startButton: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: SIZES.xl * 2,
    paddingVertical: SIZES.lg,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Epilogue',
  },
  recordsButton: {
    paddingVertical: SIZES.sm,
  },
  recordsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontFamily: 'Epilogue',
  },
  logoPageContainer: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SIZES.xl * 2,
  },
  logoImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.lg,
  },
  onboardingPageContainer: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: -SIZES.xl * 5,
    paddingBottom: SIZES.xl * 2,
  },
  onboardingImageContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: SIZES.lg,
    paddingTop: 0,
    marginTop: -SIZES.xl * 5,
    flex: 1,
  },

});

export default OnboardingScreen; 