import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import LottieView from 'lottie-react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'AI를 통해 레시피를 받아보세요!',
    description: '다른 유저들이 공유한 레시피를\n제공 받을 수도 있습니다!',
    animation: require('../../assets/animations/onboarding1.json'),
  },
  {
    id: '2',
    title: '함께 쇼핑하고 절약해보세요!',
    description:
      '같이 장보기 기능을 통해\n원하는 물품을 구매하고 식비를 절약 해보세요!',
    animation: require('../../assets/animations/onboarding2.json'),
  },
  {
    id: '3',
    title: '내가 받은 레시피를 공유해봐요!',
    description:
      '사람들과 받은 레시피를 공유하고\n마음에 드는 레시피를 저장할 수 있습니다!',
    animation: require('../../assets/animations/onboarding3.json'),
  },
];

const OnboardingScreen = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleScroll = event => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleStart = async () => {
    // 최초 실행 플래그 저장
    try {
      const AsyncStorage =
        require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('hasLaunched', 'true');
    } catch (error) {
      console.error('AsyncStorage 저장 에러:', error);
    }

    // 로그인 화면으로 이동
    navigation.replace('Login');
  };

  const renderItem = ({item}) => (
    <View style={styles.slide}>
      {/* 배경 애니메이션 */}
      <LottieView
        source={require('../../assets/animations/onboardingBackground.json.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={styles.backgroundAnimation}
      />

      {/* 전경 애니메이션 */}
      <View style={styles.contentContainer}>
        <LottieView
          source={item.animation}
          autoPlay
          loop
          style={
            item.id === '3'
              ? styles.foregroundAnimation3
              : item.id === '2'
              ? styles.foregroundAnimation2
              : styles.foregroundAnimation
          }
        />

        {/* 텍스트 */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* 페이지 인디케이터 */}
      <View style={styles.indicatorContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      {/* 시작하기 버튼 (마지막 페이지에만 표시) */}
      {currentIndex === onboardingData.length - 1 && (
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>시작하기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  backgroundAnimation: {
    position: 'absolute',
    width: '80%',
    height: '110%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  foregroundAnimation: {
    width: SCREEN_WIDTH * 1.0,
    height: SCREEN_HEIGHT * 1.0,
    marginTop: -250,
  },
  foregroundAnimation2: {
    width: SCREEN_WIDTH * 1.0,
    height: SCREEN_HEIGHT * 1.0,
    marginTop: -200,
  },
  foregroundAnimation3: {
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_HEIGHT * 1.5,
    marginTop: -250,
  },
  textContainer: {
    position: 'absolute',
    bottom: 200,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 120,
    width: SCREEN_WIDTH,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D0D0D0',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#00B4D8',
    width: 24,
  },
  startButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#00B4D8',
    paddingHorizontal: 80,
    paddingVertical: 16,
    borderRadius: 30,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
