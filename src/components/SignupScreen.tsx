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
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';

const SignupScreen = () => {
  const { setCurrentStep, setUser } = useAppStore();
  const [childName, setChildName] = useState('');
  const [childGender, setChildGender] = useState<'male' | 'female' | 'none'>('none');
  const [childAge, setChildAge] = useState('');
  const [parentName, setParentName] = useState('');
  const [interests, setInterests] = useState('');
  const [interestTags, setInterestTags] = useState<string[]>([]);

  const handleBack = () => {
    setCurrentStep('onboarding');
  };

  const handleGenderSelect = (gender: 'male' | 'female' | 'none') => {
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

  const handleNext = () => {
    if (!childName || !childAge || !parentName) {
      Alert.alert('알림', '필수 정보를 입력해주세요.');
      return;
    }

    const user = {
      child: {
        id: '1',
        name: childName,
        gender: childGender,
        age: parseInt(childAge, 10),
        interests: interestTags,
      },
      parent: {
        id: '1',
        name: parentName,
        relationship: '보호자',
      },
    };

    setUser(user);
    setCurrentStep('concept');
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
              />
            </View>

            {/* 성별 선택 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>성별</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity 
                  style={[
                    styles.genderButton, 
                    childGender === 'male' && styles.genderButtonSelected
                  ]} 
                  onPress={() => handleGenderSelect('male')}
                >
                  <Text style={[
                    styles.genderButtonText,
                    childGender === 'male' && styles.genderButtonTextSelected
                  ]}>남성</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.genderButton, 
                    childGender === 'female' && styles.genderButtonSelected
                  ]} 
                  onPress={() => handleGenderSelect('female')}
                >
                  <Text style={[
                    styles.genderButtonText,
                    childGender === 'female' && styles.genderButtonTextSelected
                  ]}>여성</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.genderButton, 
                    childGender === 'none' && styles.genderButtonSelected
                  ]} 
                  onPress={() => handleGenderSelect('none')}
                >
                  <Text style={[
                    styles.genderButtonText,
                    childGender === 'none' && styles.genderButtonTextSelected
                  ]}>선택안함</Text>
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

            {/* 보호자 이름 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>보호자 이름</Text>
              <TextInput
                style={styles.input}
                placeholder="보호자 이름을 입력해주세요"
                value={parentName}
                onChangeText={setParentName}
                placeholderTextColor="#999"
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
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>다음</Text>
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
});

export default SignupScreen; 