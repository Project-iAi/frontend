import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import type { User } from '../types';
import { SIZES } from '../utils/constants';
import { images } from '../assets';
import { apiService } from '../services';
import { login as KakaoLogin } from '@react-native-seoul/kakao-login';

const KakaoLoginScreen = () => {
  const { setCurrentStep, setJwtToken, setProfileCompleted, setUser } = useAppStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleBack = () => {
    setCurrentStep('onboarding');
  };

  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      
      // 카카오 로그인 실행
      const result = await KakaoLogin();
      console.log('🔐 카카오 로그인 결과:', result);
      
      if (result.accessToken) {
        // 백엔드에 카카오 액세스 토큰 전송
        const response = await apiService.kakaoLogin(result.accessToken);
        console.log('✅ 백엔드 카카오 로그인 성공:', response);
        
        // JWT 토큰과 프로필 완료 상태 저장
        setJwtToken(response.accessToken);
        setProfileCompleted(response.profileCompleted);
        
        // 사용자 정보 설정 (임시 사용자 객체)
        const tempUser: User = {
          child: {
            id: 'temp_child_id',
            name: '아이',
            gender: 'none',
            age: 5,
            interests: []
          },
          parent: {
            id: 'temp_parent_id',
            name: '보호자',
            relationship: '보호자'
          }
        };
        setUser(tempUser);
        
        if (response.profileCompleted) {
          // 프로필이 완료된 경우 컨셉 선택 화면으로 이동
          setCurrentStep('concept');
        } else {
          // 프로필이 완료되지 않은 경우 회원가입 화면으로 이동
          setCurrentStep('signup');
        }
      } else {
        Alert.alert('오류', '카카오 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('💥 카카오 로그인 오류:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('사용자가 취소')) {
          // 사용자가 로그인을 취소한 경우
          return;
        }
        Alert.alert('오류', error.message);
      } else {
        Alert.alert('오류', '카카오 로그인 중 문제가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
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

        <View style={styles.content}>
          {/* 제목 */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>카카오로 간편하게</Text>
            <Text style={styles.subtitle}>로그인하고 시작해보세요!</Text>
          </View>

          {/* 카카오 로그인 버튼 */}
          <TouchableOpacity 
            style={styles.kakaoLoginButton} 
            onPress={handleKakaoLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <>
                <Text style={styles.kakaoLoginButtonText}>카카오로 시작하기</Text>
              </>
            )}
          </TouchableOpacity>

          {/* 설명 */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              카카오 계정으로 간편하게 로그인하여{'\n'}
              아이와 함께하는 대화를 시작하세요
            </Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xl * 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  kakaoLoginButton: {
    backgroundColor: '#FEE500',
    paddingHorizontal: SIZES.xl * 2,
    paddingVertical: SIZES.lg,
    borderRadius: 25,
    minWidth: 280,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kakaoLoginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  descriptionContainer: {
    marginTop: SIZES.xl * 2,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default KakaoLoginScreen;
