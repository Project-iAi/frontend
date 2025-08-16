import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';
import { apiService, ParentReport } from '../services';

const ReportScreen = () => {
  const { setCurrentStep, selectedReportDate, jwtToken, currentConversation } = useAppStore();
  const [report, setReport] = useState<ParentReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API에서 리포트 데이터 가져오기
  useEffect(() => {
    const fetchReport = async () => {
      if (!selectedReportDate || !currentConversation?.roomId || !jwtToken) {
        setError('리포트를 불러올 수 없습니다.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const reportData = await apiService.getParentReport(currentConversation.roomId, jwtToken);
        setReport(reportData);
      } catch (err) {
        console.error('리포트 조회 실패:', err);
        setError('리포트를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [selectedReportDate, currentConversation?.roomId, jwtToken]);

  const handleBack = () => {
    setCurrentStep('collection');
  };

  const handleViewCollection = () => {
    setCurrentStep('collection');
  };

  const handleNewConversation = () => {
    setCurrentStep('concept');
  };

  const formatReportDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'Asia/Seoul',
    };
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  };

  // 점수를 시각적으로 표시하는 함수
  const renderScoreBar = (score: number, label: string) => (
    <View style={styles.scoreItem}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={styles.scoreBarContainer}>
        <View style={[styles.scoreBar, { width: `${score * 10}%` }]} />
      </View>
      <Text style={styles.scoreText}>{score}/10</Text>
    </View>
  );

  if (!selectedReportDate) {
    return (
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>리포트 날짜가 선택되지 않았습니다</Text>
            <TouchableOpacity style={styles.errorBackButton} onPress={handleBack}>
              <Text style={styles.errorBackButtonText}>뒤로가기</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (isLoading) {
    return (
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>리포트를 불러오는 중...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (error || !report) {
    return (
      <ImageBackground 
        source={images.backgrounds.main} 
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error || '리포트를 불러올 수 없습니다'}</Text>
            <TouchableOpacity style={styles.errorBackButton} onPress={handleBack}>
              <Text style={styles.errorBackButtonText}>뒤로가기</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={images.backgrounds.main} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* 엄마 이미지 중앙 상단 */}
          <View style={styles.momContainer}>
            <Image
              source={require('../assets/images/characters/mom.png')}
              style={styles.momImage}
              resizeMode="contain"
            />
          </View>

          {/* 리포트 카드 */}
          <View style={styles.reportCard}>
            {/* 날짜 표시 */}
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {formatReportDate(selectedReportDate)}
              </Text>
            </View>

            {/* 전체 평가 점수 */}
            <View style={styles.overallScoreContainer}>
              <Text style={styles.overallScoreTitle}>전체 평가</Text>
              <Text style={styles.overallScoreValue}>{report.overallScore.toFixed(1)}점</Text>
            </View>

            {/* 감정 상태 */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>감정 상태</Text>
              <Text style={styles.sectionContent}>{report.emotionalState}</Text>
            </View>

            {/* 관심사 */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>관심사</Text>
              <View style={styles.interestsContainer}>
                {report.interests.map((interest: string, index: number) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 언어 발달 */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>언어 발달</Text>
              <Text style={styles.sectionContent}>{report.languageDevelopment}</Text>
            </View>

            {/* 사회성 */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>사회성</Text>
              <Text style={styles.sectionContent}>{report.socialSkills}</Text>
            </View>

            {/* 주요 하이라이트 */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>주요 하이라이트</Text>
              {report.highlights.map((highlight: string, index: number) => (
                <Text key={index} style={styles.highlightText}>• {highlight}</Text>
              ))}
            </View>

            {/* 제안사항 */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>제안사항</Text>
              {report.suggestions.map((suggestion: string, index: number) => (
                <Text key={index} style={styles.suggestionText}>• {suggestion}</Text>
              ))}
            </View>

            {/* 종합 평가 */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>종합 평가</Text>
              <Text style={styles.sectionContent}>{report.overallAssessment}</Text>
            </View>

            {/* 발달 점수 */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>발달 점수</Text>
              {renderScoreBar(report.developmentScores.language, '언어')}
              {renderScoreBar(report.developmentScores.social, '사회성')}
              {renderScoreBar(report.developmentScores.emotional, '감정')}
              {renderScoreBar(report.developmentScores.creativity, '창의성')}
              {renderScoreBar(report.developmentScores.curiosity, '호기심')}
            </View>
          </View>

          {/* 버튼 영역 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.newButton} onPress={handleNewConversation}>
              <Text style={styles.newButtonText}>다시 놀러가기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.collectionButton} onPress={handleViewCollection}>
              <Text style={styles.collectionButtonText}>기록 보러가기</Text>
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
  content: {
    flexGrow: 1,
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.md, // 상단 여백 줄임
    paddingBottom: SIZES.xl,
    alignItems: 'center',
  },
  momContainer: {
    alignItems: 'center',
    marginBottom: 0, // 아래 여백 완전 제거
    marginTop: -SIZES.lg, // 위로 올림
  },
  momImage: {
    width: 180, // 더 크게 증가
    height: 180, // 더 크게 증가
    borderRadius: 90,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: SIZES.xl,
    width: '100%',
    marginTop: -SIZES.lg, // 더 위로 올림
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: SIZES.lg,
  },
  dateContainer: {
    marginBottom: SIZES.lg,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  titleContainer: {
    marginBottom: SIZES.lg,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  reportContent: {
    backgroundColor: '#FFF5F5',
    borderRadius: 15,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  reportMessage: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
  adviceContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    padding: SIZES.lg,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  adviceText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1976D2',
    textAlign: 'center',
  },
  // 새로운 스타일들
  overallScoreContainer: {
    alignItems: 'center',
    marginBottom: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
  },
  overallScoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: SIZES.xs,
  },
  overallScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  sectionContainer: {
    marginBottom: SIZES.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: SIZES.sm,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555555',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  interestTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  highlightText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555555',
    marginBottom: SIZES.xs,
  },
  suggestionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555555',
    marginBottom: SIZES.xs,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  scoreLabel: {
    width: 60,
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  scoreBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginHorizontal: SIZES.sm,
  },
  scoreBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  scoreText: {
    width: 40,
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
    marginTop: SIZES.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  newButton: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 25,
    flex: 1,
    marginRight: SIZES.sm,
    alignItems: 'center',
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  collectionButton: {
    backgroundColor: '#FFFACD',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 25,
    flex: 1,
    marginLeft: SIZES.sm,
    alignItems: 'center',
  },
  collectionButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FF6B6B',
    marginBottom: SIZES.lg,
  },
  errorBackButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: 25,
  },
  errorBackButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReportScreen;
