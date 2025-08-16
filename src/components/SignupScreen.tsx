import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';
import { apiService } from '../services';

const SignupScreen = () => {
  const { setCurrentStep, setUser, jwtToken } = useAppStore();
  const [childName, setChildName] = useState('');
  const [childGender, setChildGender] = useState<'남자' | '여자'>('남자');
  const [childAge, setChildAge] = useState('');
  const [motherName, setMotherName] = useState('');
  const [interests, setInterests] = useState('');
  const [interestTags, setInterestTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    setCurrentStep('onboarding');
  };

  const handleGenderSelect = (gender: '남자' | '여자') => {
    setChildGender(gender);
  };

  const handleInterestChange = (text: string) => {
    setInterests(text);
    
    // 쉼표로 태그 추가
    if (text.includes(',')) {
      const newTag = text.replace(',', '').trim();
      if (newTag && !interestTags.includes(newTag)) {
        setInterestTags([...interestTags, newTag]);
        setInterests('');
      }
    }
  };

  const handleInterestSubmit = () => {
    const newTag = interests.trim();
    if (newTag && !interestTags.includes(newTag)) {
      setInterestTags([...interestTags, newTag]);
      setInterests('');
    }
  };

  const removeInterestTag = (tagToRemove: string) => {
    setInterestTags(interestTags.filter(tag => tag !== tagToRemove));
  };

  const handleNext = async () => {
    if (!childName || !childAge || !motherName) {
      Alert.alert('알림', '필수 정보를 입력해주세요.');
      return;
    }

    if (!jwtToken) {
      Alert.alert('오류', '인증 토큰이 없습니다. 다시 로그인해주세요.');
      setCurrentStep('onboarding');
      return;
    }

    try {
      setIsLoading(true);

      // 백엔드 회원가입 API 호출
      const signupData = {
        childName,
        childGender,
        childAge: parseInt(childAge, 10),
        motherName,
        childInterests: interestTags,
      };

      await apiService.signup(signupData, jwtToken);

      // 로컬 사용자 정보 저장
      const user = {
        child: {
          id: '1',
          name: childName,
          gender: childGender === '남자' ? 'male' : 'female',
          age: parseInt(childAge, 10),
          interests: interestTags,
        },
        parent: {
          id: '1',
          name: motherName,
          relationship: '엄마',
        },
      };

      setUser(user);
      setCurrentStep('concept');
    } catch (error) {
      console.error('💥 회원가입 오류:', error);
      Alert.alert('오류', '회원가입에 실패했습니다. 다시 시도해주세요.');
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

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 회원가입 박스 */}
          <View style={styles.signupBox}>
            <Text style={styles.title}>회원가입</Text>
            
            {/* 아이 이름 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>아이 이름</Text>
              <TextInput
                style={styles.input}
                placeholder="아이 이름을 입력해주세요"
                value={childName}
                onChangeText={setChildName}
                placeholderTextColor="#999"
                autoComplete="off"
                autoCorrect={false}
                autoCapitalize="none"
                textContentType="none"
                keyboardType="default"
                returnKeyType="next"
                blurOnSubmit={false}
                multiline={false}
              />
            </View>

            {/* 성별 선택 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>성별</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity 
                  style={[
                    styles.genderButton, 
                    childGender === '남자' && styles.genderButtonSelected
                  ]} 
                  onPress={() => handleGenderSelect('남자')}
                >
                  <Text style={[
                    styles.genderButtonText,
                    childGender === '남자' && styles.genderButtonTextSelected
                  ]}>남자</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.genderButton, 
                    childGender === '여자' && styles.genderButtonSelected
                  ]} 
                  onPress={() => handleGenderSelect('여자')}
                >
                  <Text style={[
                    styles.genderButtonText,
                    childGender === '여자' && styles.genderButtonTextSelected
                  ]}>여자</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 나이 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>아이 나이</Text>
              <TextInput
                style={styles.input}
                placeholder="아이 나이를 입력해주세요"
                value={childAge}
                onChangeText={setChildAge}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            {/* 엄마 이름 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>엄마 이름</Text>
              <TextInput
                style={styles.input}
                placeholder="엄마 이름을 입력해주세요"
                value={motherName}
                onChangeText={setMotherName}
                placeholderTextColor="#999"
                autoComplete="off"
                autoCorrect={false}
                autoCapitalize="none"
                textContentType="none"
                keyboardType="default"
                returnKeyType="next"
                blurOnSubmit={false}
                multiline={false}
              />
            </View>

            {/* 관심사 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>관심사</Text>
              <TextInput
                style={styles.input}
                placeholder="관심사를 입력하고 엔터 또는 쉼표를 눌러주세요"
                value={interests}
                onChangeText={handleInterestChange}
                onSubmitEditing={handleInterestSubmit}
                placeholderTextColor="#999"
                returnKeyType="done"
                autoComplete="off"
                autoCorrect={false}
                autoCapitalize="none"
                textContentType="none"
                keyboardType="default"
              />
              {interestTags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {interestTags.map((tag, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.tag}
                      onPress={() => removeInterestTag(tag)}
                    >
                      <Text style={styles.tagText}>#{tag}</Text>
                      <Text style={styles.tagRemove}>×</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* 다음 버튼 */}
            <TouchableOpacity 
              style={[styles.nextButton, isLoading && styles.nextButtonDisabled]} 
              onPress={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.nextButtonText}>다음</Text>
              )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xl * 1.5,
    paddingBottom: SIZES.xl,
  },
  signupBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: SIZES.xl,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.lg,
    color: '#333',
  },
  inputGroup: {
    marginBottom: SIZES.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SIZES.xs,
    color: '#333',
  },
  input: {
    borderWidth: 0,
    borderRadius: 12,
    padding: SIZES.md,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F5F5F5',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.sm,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginHorizontal: SIZES.xs,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  genderButtonSelected: {
    backgroundColor: '#FFB6C1',
    borderColor: '#FFB6C1',
  },
  genderButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  genderButtonTextSelected: {
    color: '#333',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SIZES.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB6C1',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
    marginRight: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  tagRemove: {
    fontSize: 16,
    color: '#666',
    marginLeft: SIZES.xs,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#FFB6C1',
    paddingVertical: SIZES.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SIZES.xl,
  },
  nextButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
  nextButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
});

export default SignupScreen; 