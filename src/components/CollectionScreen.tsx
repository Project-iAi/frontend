import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { COLORS, SIZES } from '../utils/constants';

const CollectionScreen = () => {
  const { diaryEntries, setCurrentStep } = useAppStore();

  const handleNewConversation = () => {
    setCurrentStep('concept');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>나의 그림일기 모음</Text>
        <TouchableOpacity style={styles.newButton} onPress={handleNewConversation}>
          <Text style={styles.newButtonText}>새로운 대화</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {diaryEntries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>아직 그림일기가 없어요</Text>
            <Text style={styles.emptySubtitle}>
              첫 번째 대화를 시작해보세요!
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={handleNewConversation}>
              <Text style={styles.startButtonText}>대화 시작하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          diaryEntries.map((entry) => (
            <View key={entry.id} style={styles.diaryCard}>
              <Text style={styles.diaryTitle}>{entry.title}</Text>
              <Text style={styles.diaryDate}>{formatDate(entry.createdAt)}</Text>
              <Text style={styles.diaryContent} numberOfLines={3}>
                {entry.content}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textSecondary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  newButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.sm,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: SIZES.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SIZES.sm,
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 16,
    marginBottom: SIZES.xl,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.sm,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  diaryCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.lg,
    borderRadius: SIZES.md,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  diaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
    color: COLORS.text,
  },
  diaryDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SIZES.sm,
  },
  diaryContent: {
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.text,
  },
});

export default CollectionScreen; 