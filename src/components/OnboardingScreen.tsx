import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';

const OnboardingScreen = () => {
  const { setCurrentStep } = useAppStore();

  const handleStart = () => {
    setCurrentStep('signup');
  };

  const handleViewRecords = () => {
    setCurrentStep('collection');
  };

  return (
    <ImageBackground 
      source={images.backgrounds.main} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* 로고 */}
          <View style={styles.logoContainer}>
            <Image 
              source={images.logos.iai} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* 버튼들 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>시작하기</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.recordsButton} onPress={handleViewRecords}>
              <Text style={styles.recordsButtonText}>기록 보러가기</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.xl,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.sm, // 더 위로 올림
  },
  logo: {
    width: 600, // 200 * 3 = 600
    height: 400, // 360에서 400으로 증가
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
    paddingBottom: SIZES.xl,
    marginTop: -SIZES.xl * 2, // 버튼들을 더 위로 올림
  },
  startButton: {
    backgroundColor: '#FFB6C1', // 핑크색
    paddingHorizontal: SIZES.xl * 2,
    paddingVertical: SIZES.lg,
    borderRadius: 50, // 타원형
    marginBottom: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  recordsButton: {
    paddingVertical: SIZES.sm,
  },
  recordsButtonText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen; 