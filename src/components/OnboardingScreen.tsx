import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';

const OnboardingScreen = () => {
  const { setCurrentStep } = useAppStore();

  const handleStart = () => {
    try {
      setCurrentStep('signup');
    } catch (error) {
      console.error('Error navigating to signup:', error);
      Alert.alert('오류', '화면 이동 중 오류가 발생했습니다.');
    }
  };

  const handleViewRecords = () => {
    try {
      setCurrentStep('collection');
    } catch (error) {
      console.error('Error navigating to collection:', error);
      Alert.alert('오류', '화면 이동 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.backgroundImage}
        resizeMode="cover"
        onError={(error) => console.error('Image loading error:', error)}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* 로고 */}
            <View style={styles.logoContainer}>
              <Image 
                source={images.logos.iai} 
                style={styles.logo}
                resizeMode="contain"
                onError={(error) => console.error('Logo loading error:', error)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // 배경색 추가
  },
  backgroundImage: {
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
    marginTop: SIZES.sm,
  },
  logo: {
    width: 600,
    height: 400,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
    paddingBottom: SIZES.xl,
    marginTop: -SIZES.xl * 2,
  },
  startButton: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: SIZES.xl * 2,
    paddingVertical: SIZES.lg,
    borderRadius: 50,
    marginBottom: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recordsButton: {
    paddingVertical: SIZES.sm,
  },
  recordsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen; 