import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { concepts } from '../utils/data';
import { COLORS, SIZES } from '../utils/constants';

const ConceptScreen = () => {
  const { setCurrentStep, setSelectedConcept } = useAppStore();

  const handleConceptSelect = (conceptId: string) => {
    setSelectedConcept(conceptId as any);
    setCurrentStep('character');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>어떤 세계로 가볼까요?</Text>
        <Text style={styles.subtitle}>
          마음에 드는 컨셉을 선택해주세요
        </Text>

        {concepts.map((concept) => (
          <TouchableOpacity
            key={concept.id}
            style={styles.conceptCard}
            onPress={() => handleConceptSelect(concept.id)}
          >
            <Text style={styles.conceptName}>{concept.name}</Text>
            <Text style={styles.conceptDescription}>
              {concept.description}
            </Text>
            <Text style={styles.characterCount}>
              {concept.characters.length}명의 친구들이 있어요!
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.sm,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SIZES.xl,
    color: COLORS.textSecondary,
  },
  conceptCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.lg,
    borderRadius: SIZES.md,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  conceptName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SIZES.sm,
    color: COLORS.text,
  },
  conceptDescription: {
    fontSize: 16,
    marginBottom: SIZES.sm,
    color: COLORS.text,
    lineHeight: 22,
  },
  characterCount: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default ConceptScreen; 