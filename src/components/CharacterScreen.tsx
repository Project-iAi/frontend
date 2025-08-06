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

const CharacterScreen = () => {
  const { selectedConcept, setSelectedCharacter, setCurrentStep } = useAppStore();

  const selectedConceptData = concepts.find(c => c.id === selectedConcept);

  const handleCharacterSelect = (character: any) => {
    setSelectedCharacter(character);
    setCurrentStep('emotion');
  };

  if (!selectedConceptData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>컨셉을 선택해주세요</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>친구를 선택해주세요!</Text>
        <Text style={styles.subtitle}>
          {selectedConceptData.name}에서 함께할 친구를 골라보세요
        </Text>

        {selectedConceptData.characters.map((character) => (
          <TouchableOpacity
            key={character.id}
            style={styles.characterCard}
            onPress={() => handleCharacterSelect(character)}
          >
            <Text style={styles.characterName}>{character.name}</Text>
            <Text style={styles.characterDescription}>
              {character.description}
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
  characterCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.lg,
    borderRadius: SIZES.md,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SIZES.sm,
    color: COLORS.text,
  },
  characterDescription: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.error,
    marginTop: SIZES.xl,
  },
});

export default CharacterScreen; 