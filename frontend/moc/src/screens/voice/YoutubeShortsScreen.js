import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {Play, Clock} from 'lucide-react-native';
import {getRecipeByVoice} from '../../api/voice';
import styles from '../../styles/screens/voice/YoutubeShortsScreenStyles';
import {useFocusEffect} from '@react-navigation/native';
import YoutubePlayerModal from '../../components/voice/YoutubePlayerModal';

/**
 * 유튜브 쇼츠 리스트 화면
 * 음성 인식 결과로 검색된 레시피 영상 목록
 */
export default function YoutubeShortsScreen({route, navigation}) {
  const {recipeName} = route.params || {recipeName: '제육볶음'};
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [playerVisible, setPlayerVisible] = useState(false);

  // 배경 애니메이션
  const overlay01X = useSharedValue(0);
  const overlay01Y = useSharedValue(0);
  const overlay02X = useSharedValue(0);
  const overlay02Y = useSharedValue(0);

  useEffect(() => {
    // 배경 원 애니메이션
    overlay01X.value = withRepeat(
      withTiming(15, {duration: 4000, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
    overlay01Y.value = withRepeat(
      withTiming(20, {duration: 5000, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
    overlay02X.value = withRepeat(
      withTiming(-10, {duration: 5000, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
    overlay02Y.value = withRepeat(
      withTiming(-15, {duration: 4500, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
  }, []);

  // 화면 포커스될 때마다 레시피 검색 (재검색 지원)
  useFocusEffect(
    React.useCallback(() => {
      fetchShorts();
    }, [recipeName]),
  );

  // 애니메이션 스타일
  const overlay01Style = useAnimatedStyle(() => ({
    transform: [{translateX: overlay01X.value}, {translateY: overlay01Y.value}],
  }));

  const overlay02Style = useAnimatedStyle(() => ({
    transform: [{translateX: overlay02X.value}, {translateY: overlay02Y.value}],
  }));

  // 유튜브 쇼츠 검색
  const fetchShorts = async () => {
    try {
      setLoading(true);
      console.log('🔍 레시피 검색 시작:', recipeName);
      const response = await getRecipeByVoice(recipeName);
      console.log('✅ 레시피 검색 응답:', response);

      if (response && response.shorts) {
        setShorts(response.shorts);
      } else {
        console.warn('⚠️ 응답에 shorts 배열이 없습니다:', response);
        setShorts([]);
      }
    } catch (error) {
      console.error('❌ 레시피 검색 실패:', error);
      Alert.alert('오류', '레시피를 불러올 수 없습니다.');
      setShorts([]);
    } finally {
      setLoading(false);
    }
  };

  // 마이크 버튼 클릭 - 다시 음성 인식
  const handleMicPress = () => {
    navigation.navigate('Voice');
  };

  // 쇼츠 클릭 - 앱 내 WebView로 재생
  const handleShortPress = videoId => {
    setSelectedVideoId(videoId);
    setPlayerVisible(true);
  };

  // 플레이어 닫기
  const handleClosePlayer = () => {
    setPlayerVisible(false);
    setSelectedVideoId(null);
  };

  // 시간 포맷팅 (초 → mm:ss)
  const formatDuration = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 상단 결과 영역 (그라데이션 배경 + 마이크) */}
        <LinearGradient
          colors={['#7371FC', '#8677D9', '#B99DD8']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          angle={169.43}
          style={styles.resultArea}>
          {/* 배경 움직이는 원들 */}
          <Animated.View style={[styles.overlay02, overlay02Style]} />
          <Animated.View style={[styles.overlay01, overlay01Style]} />

          {/* 마이크 버튼 */}
          <TouchableOpacity
            onPress={handleMicPress}
            activeOpacity={0.8}
            style={styles.micButtonWrapper}>
            <LinearGradient
              colors={['#7371FC', '#8677D9', '#B99DD8']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              angle={167.96}
              style={styles.micButton}>
              <Image
                source={require('../../assets/images/main/mainMice.png')}
                style={styles.micImage}
                resizeMode="contain"
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* 인식된 요리명 */}
          <Text style={styles.recipeNameText}>{recipeName}</Text>
        </LinearGradient>

        {/* 쇼츠 리스트 영역 */}
        <View style={styles.shortsContainer}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Play size={20} color="#000000" fill="#000000" />
            <Text style={styles.headerText}>레시피 Shorts</Text>
          </View>

          {/* 쇼츠 그리드 (2열) */}
          <View style={styles.grid}>
            {shorts.map((short, index) => (
              <TouchableOpacity
                key={short.videoId || index}
                style={styles.shortItem}
                onPress={() => handleShortPress(short.videoId)}
                activeOpacity={0.8}>
                {/* 썸네일 */}
                <View style={styles.thumbnail}>
                  <Image
                    source={{uri: short.thumbnailUrl}}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                  {/* 그라데이션 오버레이 */}
                  <LinearGradient
                    colors={[
                      'rgba(0,0,0,0)',
                      'rgba(0,0,0,0.2)',
                      'rgba(0,0,0,0.7)',
                    ]}
                    locations={[0, 0.5, 1]}
                    style={styles.thumbnailGradient}
                  />
                  {/* 시간 배지 */}
                  <View style={styles.durationBadge}>
                    <Clock size={12} color="#FFFFFF" />
                    <Text style={styles.durationText}>
                      {formatDuration(short.duration || 60)}
                    </Text>
                  </View>
                </View>

                {/* 제목 */}
                <Text style={styles.shortTitle} numberOfLines={2}>
                  {short.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* YouTube 플레이어 모달 */}
      <YoutubePlayerModal
        visible={playerVisible}
        videoId={selectedVideoId}
        onClose={handleClosePlayer}
      />
    </View>
  );
}
