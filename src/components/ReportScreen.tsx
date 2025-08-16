import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  ScrollView,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';

const ReportScreen = () => {
  const { setCurrentStep, selectedReportDate } = useAppStore();

  const handleBack = () => {
    setCurrentStep('collection');
  };

  const handleViewCollection = () => {
    setCurrentStep('collection');
  };

  const handleNewConversation = () => {
    setCurrentStep('concept');
  };

  // 리포트 메시지 생성 함수
  const getReportMessage = (date: Date) => {
    const reports = [
      "오늘은 햄삐가 기분이 조금 안 좋았네요! 기분을 산책으로 잘 다스려주세요!",
      "오늘은 냥삐가 정말 신났어요! 함께 놀아주셔서 감사해요!",
      "오늘은 래삐가 조금 외로워했어요! 따뜻한 말로 위로해주세요!",
      "오늘은 여삐가 새로운 것을 배우고 싶어해요! 함께 탐험해보세요!",
      "오늘은 아리삐가 친구들과 잘 지내고 있어요! 대화를 많이 나눠주세요!",
      "오늘은 구리삐가 창의적인 생각을 하고 있어요! 아이디어를 들어보세요!",
      "오늘은 사삐가 리더십을 발휘하고 있어요! 응원해주세요!",
      "오늘은 멍삐가 충성스럽게 지켜주고 있어요! 사랑으로 보답해주세요!",
      "오늘은 고미삐가 평화로운 시간을 보내고 있어요! 편안한 분위기를 만들어주세요!"
    ];
    
    // 날짜에 따라 다른 리포트 반환
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return reports[dayOfYear % reports.length];
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

            {/* 리포트 제목 */}
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>부모님께 전하는 리포트</Text>
            </View>

            {/* 리포트 내용 */}
            <View style={styles.reportContent}>
              <Text style={styles.reportMessage}>
                {getReportMessage(selectedReportDate)}
              </Text>
            </View>

            {/* 추가 조언 */}
            <View style={styles.adviceContainer}>
              <Text style={styles.adviceTitle}>💡 오늘의 조언</Text>
              <Text style={styles.adviceText}>
                아이와 함께하는 시간이 가장 소중합니다. 
                대화를 통해 아이의 마음을 이해하고, 
                따뜻한 관심으로 성장을 도와주세요.
              </Text>
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
    paddingVertical: SIZES.xl,
    alignItems: 'center',
  },
  momContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  momImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: SIZES.xl,
    width: '100%',
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
