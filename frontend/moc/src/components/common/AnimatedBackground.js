import React, {useEffect, useRef} from 'react';
import {View, Animated, Easing} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ChefHat, Utensils, Sparkles} from 'lucide-react-native';
import styles from '../../styles/components/AnimatedBackgroundStyles';

const AnimatedBackground = () => {
  // 애니메이션 값들
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const rotateAnim1 = useRef(new Animated.Value(0)).current;
  const rotateAnim2 = useRef(new Animated.Value(0)).current;
  const rotateAnim3 = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 부드러운 떠다니는 애니메이션
    const floatingAnimation1 = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -20,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    const floatingAnimation2 = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -25,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    const floatingAnimation3 = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: -15,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    // 회전 애니메이션
    const rotateAnimation1 = Animated.loop(
      Animated.timing(rotateAnim1, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const rotateAnimation2 = Animated.loop(
      Animated.timing(rotateAnim2, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const rotateAnimation3 = Animated.loop(
      Animated.timing(rotateAnim3, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    // 스케일 애니메이션
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    floatingAnimation1.start();
    floatingAnimation2.start();
    floatingAnimation3.start();
    rotateAnimation1.start();
    rotateAnimation2.start();
    rotateAnimation3.start();
    scaleAnimation.start();

    return () => {
      floatingAnimation1.stop();
      floatingAnimation2.stop();
      floatingAnimation3.stop();
      rotateAnimation1.stop();
      rotateAnimation2.stop();
      rotateAnimation3.stop();
      scaleAnimation.stop();
    };
  }, []);

  const rotate1 = rotateAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotate2 = rotateAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const rotate3 = rotateAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#98D8FF', '#698FEE', '#D7FEFF']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      locations={[0, 0.5, 1]}
      style={styles.container}>
      {/* 흐릿한 원형 배경들 */}
      <Animated.View
        style={[
          styles.circleTop,
          {
            transform: [{translateY: floatAnim1}, {scale: scaleAnim}],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circleTopRight,
          {
            transform: [{translateY: floatAnim2}, {scale: scaleAnim}],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circleLeft,
          {
            transform: [{translateY: floatAnim3}],
          },
        ]}
      />

      {/* 요리 아이콘들 */}
      <Animated.View
        style={[
          styles.iconChef,
          {
            transform: [{translateY: floatAnim1}, {rotate: rotate1}],
          },
        ]}>
        <ChefHat color="rgba(255, 255, 255, 0.6)" size={28} strokeWidth={1.5} />
      </Animated.View>

      <Animated.View
        style={[
          styles.iconUtensils,
          {
            transform: [{translateY: floatAnim2}, {rotate: rotate2}],
          },
        ]}>
        <Utensils
          color="rgba(255, 255, 255, 0.5)"
          size={24}
          strokeWidth={1.5}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.iconSparkles,
          {
            transform: [{translateY: floatAnim3}, {rotate: rotate3}],
          },
        ]}>
        <Sparkles
          color="rgba(255, 255, 255, 0.6)"
          size={22}
          strokeWidth={1.5}
        />
      </Animated.View>

      {/* 하단 페이지네이션 인디케이터 */}
      <View style={styles.paginationContainer}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </LinearGradient>
  );
};

export default AnimatedBackground;
