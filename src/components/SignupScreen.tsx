import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { COLORS, SIZES } from '../utils/constants';

const SignupScreen = () => {
  const { setCurrentStep, setUser } = useAppStore();
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [parentName, setParentName] = useState('');
  const [relationship, setRelationship] = useState('');

  const handleNext = () => {
    if (!childName || !childAge || !parentName || !relationship) {
      Alert.alert('알림', '모든 정보를 입력해주세요.');
      return;
    }

    const user = {
      child: {
        id: '1',
        name: childName,
        age: parseInt(childAge, 10),
      },
      parent: {
        id: '1',
        name: parentName,
        relationship,
      },
    };

    setUser(user);
    setCurrentStep('concept');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>정보를 입력해주세요</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>아이 정보</Text>
          <TextInput
            style={styles.input}
            placeholder="아이 이름"
            value={childName}
            onChangeText={setChildName}
          />
          <TextInput
            style={styles.input}
            placeholder="나이"
            value={childAge}
            onChangeText={setChildAge}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>보호자 정보</Text>
          <TextInput
            style={styles.input}
            placeholder="보호자 이름"
            value={parentName}
            onChangeText={setParentName}
          />
          <TextInput
            style={styles.input}
            placeholder="관계 (예: 엄마, 아빠)"
            value={relationship}
            onChangeText={setRelationship}
          />
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.xl,
    color: COLORS.text,
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SIZES.md,
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: SIZES.sm,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    fontSize: 16,
    color: COLORS.text,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.md,
    borderRadius: SIZES.sm,
    alignItems: 'center',
    marginTop: SIZES.lg,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SignupScreen; 