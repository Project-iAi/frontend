import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { SIZES } from '../utils/constants';
import { images } from '../assets';
import { Character, ConceptType, Conversation } from '../types';

const CollectionScreen = () => {
  const {
    diaryEntries,
    setCurrentStep,
    setCurrentConversation,
    setSelectedCharacter,
    setSelectedConcept,
    setSelectedEmotion,
  } = useAppStore();
  const [currentMonth, _setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleNewConversation = () => {
    setCurrentStep('concept');
  };

  const handleBack = () => {
    setCurrentStep('diary');
  };

  // 현재 월의 달력 데이터 생성
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    // 6주 x 7일 = 42일을 생성하여 완전한 달력 그리드 만들기
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [currentMonth]);

  // 임시 대화 데이터
  const tempConversations: Record<string, Conversation> = {
    'conv1': {
      id: 'conv1',
      characterId: 'ham',
      emotion: 'happy',
      messages: [
        { id: '1', sender: 'character' as const, content: '안녕하세요! 저는 햄삐예요. 오늘 우주에서 만나서 정말 기뻐요!', timestamp: new Date() },
        { id: '2', sender: 'user' as const, content: '안녕햄삐! 우주에 대해 궁금한 게 있어요.', timestamp: new Date() },
        { id: '3', sender: 'character' as const, content: '정말요? 우주에 대해 무엇이 궁금하신가요?', timestamp: new Date() },
        { id: '4', sender: 'user' as const, content: '별들이 어떻게 생겼는지 궁금해요.', timestamp: new Date() },
        { id: '5', sender: 'character' as const, content: '별들은 정말 아름다워요! 각각 다른 색깔과 크기를 가지고 있답니다.', timestamp: new Date() },
      ],
      createdAt: new Date(2025, 7, 1),
    },
    'conv2': {
      id: 'conv2',
      characterId: 'chick',
      emotion: 'happy',
      messages: [
        { id: '1', sender: 'character' as const, content: '안녕하세요! 저는 아리삐예요. 학교에서 만나서 반가워요!', timestamp: new Date() },
        { id: '2', sender: 'user' as const, content: '안녕아리삐! 학교 재미있어요?', timestamp: new Date() },
        { id: '3', sender: 'character' as const, content: '네! 학교에서는 친구들과 함께 배우고 놀 수 있어서 정말 재미있어요!', timestamp: new Date() },
        { id: '4', sender: 'user' as const, content: '무엇을 배우는지 궁금해요.', timestamp: new Date() },
        { id: '5', sender: 'character' as const, content: '수학, 과학, 예술 등 다양한 것을 배워요. 무엇이 가장 재미있을까요?', timestamp: new Date() },
      ],
      createdAt: new Date(2025, 7, 5),
    },
    'conv3': {
      id: 'conv3',
      characterId: 'rabbit',
      emotion: 'happy',
      messages: [
        { id: '1', sender: 'character' as const, content: '안녕하세요! 저는 래삐예요. 밭에서 만나서 반가워요!', timestamp: new Date() },
        { id: '2', sender: 'user' as const, content: '안녕래삐! 밭에서는 무엇을 하세요?', timestamp: new Date() },
        { id: '3', sender: 'character' as const, content: '밭에서는 맛있는 채소들을 기르고 있어요! 당근, 상추, 토마토 등이에요.', timestamp: new Date() },
        { id: '4', sender: 'user' as const, content: '정말요? 어떤 채소가 가장 맛있어요?', timestamp: new Date() },
        { id: '5', sender: 'character' as const, content: '당근이 가장 맛있어요! 달콤하고 아삭아삭해요. 한번 먹어보고 싶으세요?', timestamp: new Date() },
      ],
      createdAt: new Date(2025, 7, 5),
    },
    'conv4': {
      id: 'conv4',
      characterId: 'dog',
      emotion: 'happy',
      messages: [
        { id: '1', sender: 'character' as const, content: '안녕하세요! 저는 멍삐예요. 학교에서 만나서 반가워요!', timestamp: new Date() },
        { id: '2', sender: 'user' as const, content: '안녕멍삐! 오늘 학교에서 무엇을 했어요?', timestamp: new Date() },
        { id: '3', sender: 'character' as const, content: '오늘은 체육 시간에 달리기를 했어요! 정말 재미있었어요.', timestamp: new Date() },
        { id: '4', sender: 'user' as const, content: '달리기 재미있었어요?', timestamp: new Date() },
        { id: '5', sender: 'character' as const, content: '네! 친구들과 함께 달리면서 웃고 떠들었어요. 정말 즐거웠어요!', timestamp: new Date() },
      ],
      createdAt: new Date(2025, 7, 5),
    },
    'conv5': {
      id: 'conv5',
      characterId: 'lion',
      emotion: 'happy',
      messages: [
        { id: '1', sender: 'character' as const, content: '안녕하세요! 저는 사삐예요. 우주에서 만나서 반가워요!', timestamp: new Date() },
        { id: '2', sender: 'user' as const, content: '안녕사삐! 우주는 어떤 곳이에요?', timestamp: new Date() },
        { id: '3', sender: 'character' as const, content: '우주는 정말 신비로운 곳이에요! 수많은 별들과 행성들이 있어요.', timestamp: new Date() },
        { id: '4', sender: 'user' as const, content: '정말요? 어떤 행성이 가장 재미있어요?', timestamp: new Date() },
        { id: '5', sender: 'character' as const, content: '목성이 가장 재미있어요! 큰 빨간 점이 있어서 정말 특별해요.', timestamp: new Date() },
      ],
      createdAt: new Date(2025, 7, 10),
    },
    'conv6': {
      id: 'conv6',
      characterId: 'rac',
      emotion: 'happy',
      messages: [
        { id: '1', sender: 'character' as const, content: '안녕하세요! 저는 구리삐예요. 밭에서 만나서 반가워요!', timestamp: new Date() },
        { id: '2', sender: 'user' as const, content: '안녕구리삐! 밭에서는 무엇을 하고 있어요?', timestamp: new Date() },
        { id: '3', sender: 'character' as const, content: '밭에서는 맛있는 과일들을 기르고 있어요! 사과, 배, 복숭아 등이에요.', timestamp: new Date() },
        { id: '4', sender: 'user' as const, content: '정말요? 어떤 과일이 가장 맛있어요?', timestamp: new Date() },
        { id: '5', sender: 'character' as const, content: '사과가 가장 맛있어요! 달콤하고 아삭아삭해요. 한번 먹어보고 싶으세요?', timestamp: new Date() },
      ],
      createdAt: new Date(2025, 7, 15),
    },
    'conv7': {
      id: 'conv7',
      characterId: 'cat',
      emotion: 'happy',
      messages: [
        { id: '1', sender: 'character' as const, content: '안녕하세요! 저는 냥삐예요. 학교에서 만나서 반가워요!', timestamp: new Date() },
        { id: '2', sender: 'user' as const, content: '안녕냥삐! 오늘 학교에서 무엇을 배웠어요?', timestamp: new Date() },
        { id: '3', sender: 'character' as const, content: '오늘은 미술 시간에 그림을 그렸어요! 정말 재미있었어요.', timestamp: new Date() },
        { id: '4', sender: 'user' as const, content: '무엇을 그렸어요?', timestamp: new Date() },
        { id: '5', sender: 'character' as const, content: '가족들을 그렸어요! 엄마, 아빠, 그리고 저를 그렸어요. 정말 예쁘게 나왔어요!', timestamp: new Date() },
      ],
      createdAt: new Date(2025, 7, 20),
    },
    'conv8': {
      id: 'conv8',
      characterId: 'fox',
      emotion: 'happy',
      messages: [
        { id: '1', sender: 'character' as const, content: '안녕하세요! 저는 여삐예요. 우주에서 만나서 반가워요!', timestamp: new Date() },
        { id: '2', sender: 'user' as const, content: '안녕여삐! 우주에서는 무엇을 하고 있어요?', timestamp: new Date() },
        { id: '3', sender: 'character' as const, content: '우주에서는 별들을 관찰하고 있어요! 각각 다른 모양과 색깔을 가지고 있어요.', timestamp: new Date() },
        { id: '4', sender: 'user' as const, content: '정말요? 어떤 별이 가장 예뻐요?', timestamp: new Date() },
        { id: '5', sender: 'character' as const, content: '북극성이 가장 예뻐요! 밤하늘에서 가장 밝게 빛나요.', timestamp: new Date() },
      ],
      createdAt: new Date(2025, 7, 25),
    },
    'conv9': {
      id: 'conv9',
      characterId: 'bear',
      emotion: 'happy',
      messages: [
        { id: '1', sender: 'character' as const, content: '안녕하세요! 저는 고미삐예요. 밭에서 만나서 반가워요!', timestamp: new Date() },
        { id: '2', sender: 'user' as const, content: '안녕고미삐! 밭에서는 무엇을 하고 있어요?', timestamp: new Date() },
        { id: '3', sender: 'character' as const, content: '밭에서는 맛있는 꿀을 모으고 있어요! 꿀벌들과 함께 일하고 있어요.', timestamp: new Date() },
        { id: '4', sender: 'user' as const, content: '정말요? 꿀이 맛있어요?', timestamp: new Date() },
        { id: '5', sender: 'character' as const, content: '네! 꿀은 정말 달콤하고 맛있어요. 한번 먹어보고 싶으세요?', timestamp: new Date() },
      ],
      createdAt: new Date(2025, 7, 28),
    },
  };

  // 임시 일기 데이터
  const tempDiaryEntries = {
    'conv1': {
      id: 'diary1',
      conversationId: 'conv1',
      title: '햄삐와의 대화',
      content: '오늘은 우주에서 햄삐와 함께 별들에 대해 이야기를 나누었어요. 햄삐는 별들이 어떻게 생겼는지 알려주었고, 각각 다른 색깔과 크기를 가지고 있다고 했어요. 정말 신기했어요!',
      createdAt: new Date(2025, 7, 1),
      concept: 'space' as const,
      time: '오전 10:30',
    },
    'conv2': {
      id: 'diary2',
      conversationId: 'conv2',
      title: '아리삐와의 대화',
      content: '오늘은 학교에서 아리삐와 함께 학교 생활에 대해 이야기를 나누었어요. 아리삐는 학교에서 친구들과 함께 배우고 노는 것이 정말 재미있다고 했어요. 수학, 과학, 예술 등 다양한 것을 배운다고 해요.',
      createdAt: new Date(2025, 7, 5),
      concept: 'school' as const,
      time: '오전 9:15',
    },
    'conv3': {
      id: 'diary3',
      conversationId: 'conv3',
      title: '래삐와의 대화',
      content: '오늘은 밭에서 래삐와 함께 채소 기르기에 대해 이야기를 나누었어요. 래삐는 당근, 상추, 토마토 등을 기르고 있다고 했어요. 당근이 가장 맛있다고 해서 정말 궁금했어요!',
      createdAt: new Date(2025, 7, 5),
      concept: 'ground' as const,
      time: '오후 2:45',
    },
    'conv4': {
      id: 'diary4',
      conversationId: 'conv4',
      title: '멍삐와의 대화',
      content: '오늘은 학교에서 멍삐와 함께 체육 시간에 대해 이야기를 나누었어요. 멍삐는 오늘 달리기를 했다고 했어요. 친구들과 함께 달리면서 웃고 떠들었다고 해서 정말 재미있었을 것 같아요!',
      createdAt: new Date(2025, 7, 5),
      concept: 'school' as const,
      time: '오후 4:20',
    },
    'conv5': {
      id: 'diary5',
      conversationId: 'conv5',
      title: '사삐와의 대화',
      content: '오늘은 우주에서 사삐와 함께 우주에 대해 이야기를 나누었어요. 사삐는 우주가 정말 신비로운 곳이라고 했어요. 수많은 별들과 행성들이 있다고 해요. 목성이 가장 재미있다고 했어요!',
      createdAt: new Date(2025, 7, 10),
      concept: 'space' as const,
      time: '오전 11:00',
    },
    'conv6': {
      id: 'diary6',
      conversationId: 'conv6',
      title: '구리삐와의 대화',
      content: '오늘은 밭에서 구리삐와 함께 과일 기르기에 대해 이야기를 나누었어요. 구리삐는 사과, 배, 복숭아 등을 기르고 있다고 했어요. 사과가 가장 맛있다고 해서 정말 궁금했어요!',
      createdAt: new Date(2025, 7, 15),
      concept: 'ground' as const,
      time: '오후 3:30',
    },
    'conv7': {
      id: 'diary7',
      conversationId: 'conv7',
      title: '냥삐와의 대화',
      content: '오늘은 학교에서 냥삐와 함께 미술 시간에 대해 이야기를 나누었어요. 냥삐는 오늘 가족들을 그렸다고 했어요. 엄마, 아빠, 그리고 자신을 그렸다고 해요. 정말 예쁘게 나왔다고 해서 정말 궁금했어요!',
      createdAt: new Date(2025, 7, 20),
      concept: 'school' as const,
      time: '오전 10:00',
    },
    'conv8': {
      id: 'diary8',
      conversationId: 'conv8',
      title: '여삐와의 대화',
      content: '오늘은 우주에서 여삐와 함께 별 관찰에 대해 이야기를 나누었어요. 여삐는 우주에서 별들을 관찰하고 있다고 했어요. 각각 다른 모양과 색깔을 가지고 있다고 해요. 북극성이 가장 예쁘다고 했어요!',
      createdAt: new Date(2025, 7, 25),
      concept: 'space' as const,
      time: '오후 1:15',
    },
    'conv9': {
      id: 'diary9',
      conversationId: 'conv9',
      title: '고미삐와의 대화',
      content: '오늘은 밭에서 고미삐와 함께 꿀 모으기에 대해 이야기를 나누었어요. 고미삐는 꿀벌들과 함께 일하고 있다고 했어요. 꿀이 정말 달콤하고 맛있다고 해서 정말 궁금했어요!',
      createdAt: new Date(2025, 7, 28),
      concept: 'ground' as const,
      time: '오후 2:00',
    },
  };

  // 실제 데이터와 임시 데이터 합치기
  const allEntries = [...diaryEntries, ...Object.values(tempDiaryEntries)];

  // 아이콘 가져오기
  const getIconForEntry = (entry: any) => {
    const concept = entry.concept || 'school';
    
    // 기본 아이콘 반환
    switch (concept) {
      case 'space':
        return images.icons.space;
      case 'school':
        return images.icons.school;
      case 'ground':
        return images.icons.farm; // farm이 ground를 의미
      default:
        return images.icons.school;
    }
  };

  // 캐릭터 이미지 가져오기
  const getCharacterImage = (characterName: string) => {
    const name = characterName.toLowerCase();
    
    // 정확한 캐릭터 이름 매칭
    if (name.includes('햄삐') || name.includes('ham')) {
      return images.allCharacters.ham?.normal || images.characters['space-1'];
    } else if (name.includes('아리삐') || name.includes('chick')) {
      return images.allCharacters.chick?.normal || images.characters['farm-3'];
    } else if (name.includes('래삐') || name.includes('rabbit')) {
      return images.allCharacters.rabbit?.normal || images.characters['farm-1'];
    } else if (name.includes('멍삐') || name.includes('dog')) {
      return images.allCharacters.dog?.normal || images.characters['school-3'];
    } else if (name.includes('사삐') || name.includes('lion')) {
      return images.allCharacters.lion?.normal || images.characters['school-1'];
    } else if (name.includes('구리삐') || name.includes('rac')) {
      return images.allCharacters.rac?.normal || images.characters['space-1'];
    } else if (name.includes('냥삐') || name.includes('cat')) {
      return images.allCharacters.cat?.normal || images.characters['space-3'];
    } else if (name.includes('여삐') || name.includes('fox')) {
      return images.allCharacters.fox?.normal || images.characters['space-2'];
    } else if (name.includes('고미삐') || name.includes('bear')) {
      return images.allCharacters.bear?.normal || images.characters['space-1'];
    }
    
    // 기본 이미지
    return images.characters['space-1'];
  };

  // 해당 날짜의 일기 항목들 가져오기
  const getEntriesForDate = (date: Date) => {
    return allEntries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate.getDate() === date.getDate() &&
             entryDate.getMonth() === date.getMonth() &&
             entryDate.getFullYear() === date.getFullYear();
    });
  };

  // 날짜 클릭 핸들러
  const handleDatePress = (date: Date) => {
    const entries = getEntriesForDate(date);
    if (entries.length > 0) {
      setSelectedDate(date);
      setShowModal(true);
    }
  };

  // 캐릭터 정보 매핑
  const characterInfo = {
    'ham': { name: '햄삐', concept: 'space' as ConceptType },
    'chick': { name: '아리삐', concept: 'school' as ConceptType },
    'rabbit': { name: '래삐', concept: 'farm' as ConceptType },
    'dog': { name: '멍삐', concept: 'school' as ConceptType },
    'lion': { name: '사삐', concept: 'space' as ConceptType },
    'rac': { name: '구리삐', concept: 'farm' as ConceptType },
    'cat': { name: '냥삐', concept: 'school' as ConceptType },
    'fox': { name: '여삐', concept: 'space' as ConceptType },
    'bear': { name: '고미삐', concept: 'farm' as ConceptType },
  };

  // 대화 보기 핸들러
  const handleViewConversation = (entry: any) => {
    const conversationId = entry.conversationId;
    const conversation = tempConversations[conversationId];
    
    if (conversation) {
      const charInfo = characterInfo[conversation.characterId as keyof typeof characterInfo];
      
      if (charInfo) {
        // 캐릭터 정보 설정
        const character: Character = {
          id: conversation.characterId,
          name: charInfo.name,
          concept: charInfo.concept,
          description: `${charInfo.name}와의 대화`,
        };
        
        setSelectedCharacter(character);
        setSelectedConcept(charInfo.concept);
        setSelectedEmotion(conversation.emotion);
        setCurrentConversation(conversation);
        setShowModal(false);
        setCurrentStep('conversation');
      }
    }
  };

  // 일기 보기 핸들러
  const handleViewDiary = (entry: any) => {
    const conversationId = entry.conversationId;
    const conversation = tempConversations[conversationId];
    const diaryEntry = tempDiaryEntries[conversationId as keyof typeof tempDiaryEntries];
    
    if (conversation && diaryEntry) {
      const charInfo = characterInfo[conversation.characterId as keyof typeof characterInfo];
      
      if (charInfo) {
        // 캐릭터 정보 설정
        const character: Character = {
          id: conversation.characterId,
          name: charInfo.name,
          concept: charInfo.concept,
          description: `${charInfo.name}와의 대화`,
        };
        
        setSelectedCharacter(character);
        setSelectedConcept(charInfo.concept);
        setSelectedEmotion(conversation.emotion);
        setCurrentConversation(conversation);
        setShowModal(false);
        setCurrentStep('diary');
      }
    }
  };

  // 월 이름 가져오기
  const getMonthName = (date: Date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[date.getMonth()];
  };

  // 요일 헤더
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <ImageBackground 
      source={images.backgrounds.main} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>기록 보러가기</Text>
          <TouchableOpacity style={styles.newButton} onPress={handleNewConversation}>
            <Text style={styles.newButtonText}>새로운 대화</Text>
          </TouchableOpacity>
        </View>

        {/* 달력 카드 */}
        <View style={styles.calendarCard}>
          {/* 달력 상단 */}
          <View style={styles.calendarHeader}>
            <View style={styles.monthContainer}>
              <Text style={styles.monthNumber}>
                {String(currentMonth.getMonth() + 1).padStart(2, '0')}
              </Text>
              <View style={styles.monthDivider} />
              <View style={styles.monthTextContainer}>
                <Text style={styles.monthText}>{getMonthName(currentMonth)}</Text>
                <Text style={styles.yearText}>{currentMonth.getFullYear()}</Text>
              </View>
            </View>
          </View>

          {/* 요일 헤더 */}
          <View style={styles.weekHeader}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.weekDay}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* 달력 그리드 */}
          <View style={styles.calendarGrid}>
            {calendarData.map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const isToday = date.toDateString() === new Date().toDateString();
              const entries = getEntriesForDate(date);
              
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.calendarDay,
                    !isCurrentMonth && styles.otherMonthDay,
                    isToday && styles.todayDay
                  ]}
                  onPress={() => handleDatePress(date)}
                  disabled={entries.length === 0}
                >
                  <Text style={[
                    styles.dayText,
                    !isCurrentMonth && styles.otherMonthText,
                    isToday && styles.todayText
                  ]}>
                    {date.getDate()}
                  </Text>
                  
                  {/* 아이콘들 */}
                  {entries.length > 0 && (
                    <View style={styles.singleIconContainer}>
                      <View style={styles.singleIconWrapper}>
                        <Image 
                          source={getIconForEntry(entries[0])} 
                          style={styles.singleIconImage}
                          resizeMode="contain"
                        />
                      </View>
                      {entries.length > 1 && (
                        <Text style={styles.moreIndicator}>...</Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 선택 모달 */}
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedDate ? `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일` : ''}
              </Text>
              
              <ScrollView style={styles.entriesList}>
                {selectedDate && getEntriesForDate(selectedDate).map((entry) => (
                  <View key={entry.id} style={styles.entryItem}>
                    <View style={styles.entryHeader}>
                      <View style={styles.entryContent}>
                        <Image 
                          source={getCharacterImage(entry.title)} 
                          style={styles.characterImage}
                        />
                        <Text style={styles.entryTitle}>{entry.title}</Text>
                      </View>
                      <Text style={styles.entryTime}>{entry.time}</Text>
                    </View>
                    <View style={styles.entryButtons}>
                      <TouchableOpacity 
                        style={styles.conversationButton}
                        onPress={() => handleViewConversation(entry)}
                      >
                        <Text style={styles.buttonText}>대화</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.diaryButton}
                        onPress={() => handleViewDiary(entry)}
                      >
                        <Text style={styles.buttonText}>일기</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.lg,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 20,
    color: '#333333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  newButton: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    margin: SIZES.lg,
    borderRadius: 20,
    padding: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
  },
  monthDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: SIZES.md,
  },
  monthTextContainer: {
    flexDirection: 'column',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  yearText: {
    fontSize: 14,
    color: '#666666',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: SIZES.sm,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  calendarDay: {
    width: '14.285%', // 100% / 7 = 14.285%
    height: 80, // 높이를 줄임
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.xs,
    position: 'relative',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  todayDay: {
    backgroundColor: '#FFE6F2',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
    position: 'absolute',
    top: 4,
    left: 4,
  },
  otherMonthText: {
    color: '#999999',
  },
  todayText: {
    color: '#FF69B4',
    fontWeight: 'bold',
  },
  singleIconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
  },
  singleIconWrapper: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleIconImage: {
    width: 30,
    height: 30,
  },
  moreIndicator: {
    fontSize: 24,
    color: '#999999',
    marginTop: -8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: SIZES.xl,
    width: '85%',
    maxHeight: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: SIZES.lg,
  },
  entriesList: {
    width: '100%',
    maxHeight: '70%',
  },
  entryItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  entryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  characterImage: {
    width: 40,
    height: 40,
    marginRight: SIZES.sm,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  entryTime: {
    fontSize: 14,
    color: '#666666',
  },
  entryButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.md,
  },
  conversationButton: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
    minWidth: 80,
  },
  diaryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
    minWidth: 80,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.md,
    borderRadius: 25,
    marginTop: SIZES.md,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CollectionScreen; 