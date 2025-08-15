import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';

const { width: screenWidth } = Dimensions.get('window');

const OnboardingScreen = () => {
  const { setCurrentStep } = useAppStore();

  const handleStart = () => {
    setCurrentStep('signup');
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.logoPageContainer}>
            <Image 
              source={images.logos.iai} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>시작하기</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.startButton, styles.recordsButton]}
              onPress={() => setCurrentStep('collection')}
            >
              <Text style={styles.recordsButtonText}>기록 보러가기</Text>
            </TouchableOpacity>
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
    marginTop: SIZES.xl * 3,
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
    marginTop: SIZES.xl,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Epilogue',
  },
  recordsButton: {
    backgroundColor: 'transparent',
    paddingVertical: SIZES.md,
    elevation: 0,
  },
  recordsButtonText: {
    color: '#888888',
    fontSize: 16,
    textDecorationLine: 'underline',
    textShadowColor: 'transparent',
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