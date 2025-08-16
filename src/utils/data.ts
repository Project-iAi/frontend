import { Concept, Emotion } from '../types';
import { apiService, ApiCharacter } from '../services/api';

// 컨셉 데이터
export const concepts: Concept[] = [
  {
    id: 'space',
    name: '우주',
    description: '우주를 탐험하며 새로운 세계를 발견해요!',
    characters: [
      {
        id: 'space-1',
        name: '우주인 루나',
        concept: 'space',
        description: '달에서 온 친구 루나와 함께 우주를 탐험해요!',
        apiId: 1, // 햄삐
      },
      {
        id: 'space-2',
        name: '별똥별 스타',
        concept: 'space',
        description: '반짝이는 별똥별 스타와 함께 여행해요!',
        apiId: 2, // 냥삐
      },
      {
        id: 'space-3',
        name: '로봇 코스모',
        concept: 'space',
        description: '똑똑한 로봇 코스모와 함께 우주를 탐험해요!',
        apiId: 3, // 래삐
      },
    ],
  },
  {
    id: 'farm',
    name: '밭',
    description: '자연과 함께하며 건강한 음식을 기를 수 있어요!',
    characters: [
      {
        id: 'farm-1',
        name: '농부 할아버지',
        concept: 'farm',
        description: '경험 많은 농부 할아버지와 함께 농작물을 기르세요!',
        apiId: 4, // 여삐
      },
      {
        id: 'farm-2',
        name: '토끼 농부',
        concept: 'farm',
        description: '귀여운 토끼 농부와 함께 채소를 기르세요!',
        apiId: 5, // 아리삐
      },
      {
        id: 'farm-3',
        name: '나무 요정',
        concept: 'farm',
        description: '자연의 요정과 함께 나무를 심고 가꾸세요!',
        apiId: 6, // 구리삐
      },
    ],
  },
  {
    id: 'school',
    name: '학교',
    description: '친구들과 함께 배우며 성장해요!',
    characters: [
      {
        id: 'school-1',
        name: '선생님 지니',
        concept: 'school',
        description: '친근한 선생님 지니와 함께 공부해요!',
        apiId: 7, // 사삐
      },
      {
        id: 'school-2',
        name: '책벌레 도서관',
        concept: 'school',
        description: '책을 좋아하는 도서관 친구와 함께 이야기를 나누세요!',
        apiId: 8, // 멍삐
      },
      {
        id: 'school-3',
        name: '체육 선생님',
        concept: 'school',
        description: '활발한 체육 선생님과 함께 운동해요!',
        apiId: 9, // 고미삐
      },
    ],
  },
];

// 감정 데이터 - API와 호환되도록 한글명 사용
export const emotions: Emotion[] = [
  {
    id: 'happy',
    name: '기쁨',
    emoji: '😊',
    description: '오늘 정말 기뻐요!',
  },
  {
    id: 'sad',
    name: '슬픔',
    emoji: '😢',
    description: '오늘 조금 슬퍼요...',
  },
  {
    id: 'angry',
    name: '화남',
    emoji: '😠',
    description: '오늘 화가 나요!',
  },
];

// 캐릭터별 인사말
export const characterGreetings = {
  'space-1': '안녕하세요! 저는 우주인 루나예요. 오늘 우주에 대해 궁금한 게 있나요?',
  'space-2': '반짝반짝! 저는 별똥별 스타예요. 오늘 어떤 이야기를 나눠볼까요?',
  'space-3': '삐빅! 저는 로봇 코스모예요. 우주 탐험에 대해 이야기해요!',
  'farm-1': '안녕하세요! 저는 농부 할아버지예요. 오늘 농작물에 대해 배워볼까요?',
  'farm-2': '토끼토끼! 저는 토끼 농부예요. 귀여운 채소들과 함께해요!',
  'farm-3': '반갑습니다! 저는 나무 요정이에요. 자연과 함께하는 시간을 가져요!',
  'school-1': '안녕하세요! 저는 선생님 지니예요. 오늘 무엇을 배우고 싶나요?',
  'school-2': '책을 좋아하는 도서관 친구예요! 어떤 이야기를 읽어볼까요?',
  'school-3': '안녕! 저는 체육 선생님이에요. 오늘 운동하고 싶은 게 있나요?',
};

// API에서 캐릭터 데이터를 가져와서 기존 이름과 설명은 유지하는 함수
export const getCharactersWithApiData = async (): Promise<Concept[]> => {
  try {
    // API에서 캐릭터 데이터 가져오기
    const apiCharacters = await apiService.getCharacters();
    console.log('API에서 받은 캐릭터 데이터:', apiCharacters);
    
    // 기존 concepts 배열을 복사하여 반환 (기존 이름과 설명 유지)
    // API 데이터는 persona 등 다른 정보로 활용 가능
    return concepts.map(concept => ({
      ...concept,
      characters: concept.characters.map(character => {
        // API ID가 일치하는 캐릭터 찾기
        const apiCharacter = apiCharacters.find(apiChar => apiChar.id === character.apiId);
        if (apiCharacter) {
          console.log(`캐릭터 ${character.name}에 API 데이터 연결:`, apiCharacter);
        }
        return character;
      })
    }));
  } catch (error) {
    console.warn('캐릭터 API 조회 실패, 기존 데이터 사용:', error);
    return concepts;
  }
};

// 기본 concepts 배열도 export (기존 코드와의 호환성 유지)
export { concepts as defaultConcepts }; 