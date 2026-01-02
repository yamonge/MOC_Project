import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import Svg, {
  Path as SvgPath,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  ClipPath,
} from 'react-native-svg';
import {
  Canvas,
  Circle,
  Group,
  Paint,
  Blur,
  ColorMatrix,
  Path,
  vec,
  Shadow,
  RadialGradient,
  LinearGradient,
  SweepGradient,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  interpolate,
  useDerivedValue,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import {
  Plus,
  Camera as CameraIcon,
  Home,
  FileText,
  Flag,
  User,
  Image,
  Mic,
  MapPin,
  Sparkles,
  Video,
} from 'lucide-react-native';

// --- Constants ---
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const CANVAS_HEIGHT = SCREEN_HEIGHT; // 전체 화면 높이
const TAB_BAR_HEIGHT = 60;
const FAB_OFFSET_Y = -25;

const FAB_SIZE = 64;
const FAB_CENTER_X = SCREEN_WIDTH / 2;
const FAB_CENTER_Y_CLOSED = CANVAS_HEIGHT - TAB_BAR_HEIGHT + FAB_OFFSET_Y + 30; // 닫힌 상태 위치
const FAB_CENTER_Y_OPEN = SCREEN_HEIGHT / 2; // 화면 중앙

const MENU_RADIUS = 120; // 원형 배치를 위해 증가

// 부드러운 메타볼 효과를 위한 스프링 설정
const SPRING_CONFIG = {
  stiffness: 100,
  damping: 18,
  mass: 1,
};

// 뽕뽕 튀어나오는 탄성 스프링
const BOUNCE_SPRING_CONFIG = {
  damping: 12,
  stiffness: 150,
  mass: 0.8,
};

// 메타볼 효과를 위한 ColorMatrix (선명한 경계)
const METABALL_MATRIX = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 22, -8,
];

// --- SVG 배경 Path (Figma 디자인 곡선) ---
const getNavBarPath = () => {
  const center = SCREEN_WIDTH / 2;
  const curveWidth = 135;
  const curveDepth = 40;
  const topY = 0; // SVG 내부 좌표계 시작점
  const barHeight = TAB_BAR_HEIGHT + curveDepth;

  const startX = center - curveWidth / 2;
  const endX = center + curveWidth / 2;
  const cp1X = center - curveWidth / 4;
  const cp2X = center + curveWidth / 4;
  const bottomY = topY + curveDepth;

  return `
    M 0 ${topY}
    L ${startX} ${topY}
    C ${cp1X} ${topY}, ${cp1X} ${bottomY}, ${center} ${bottomY}
    C ${cp2X} ${bottomY}, ${cp2X} ${topY}, ${endX} ${topY}
    L ${SCREEN_WIDTH} ${topY}
    L ${SCREEN_WIDTH} ${barHeight}
    L 0 ${barHeight}
    Z
  `;
};

// --- 서브메뉴 데이터 (원형 배치) - 5개 ---
const SUB_MENU_ITEMS = [
  {id: 'Map', screen: 'Map', icon: MapPin, angle: 0, color: '#00B8DB'}, // 12시 방향
  {
    id: 'Recipe',
    screen: 'Recipe',
    icon: Sparkles,
    angle: 72,
    color: '#00B8DB',
  }, // 2시 방향
  {
    id: 'Camera',
    screen: 'Camera',
    icon: CameraIcon,
    angle: 144,
    color: '#00B8DB',
  }, // 4시 방향
  {id: 'Voice', screen: 'Voice', icon: Mic, angle: 216, color: '#00B8DB'}, // 6시 방향
  {id: 'Receipt', screen: 'Receipt', icon: Image, angle: 288, color: '#00B8DB'}, // 8시 방향 (영수증)
];

// 향후 확장을 위한 예시 (8개)
// const SUB_MENU_ITEMS = [
//   {id: 'camera', icon: Camera, angle: 0, color: '#7FC9E7'},
//   {id: 'gallery', icon: Image, angle: 45, color: '#7FC9E7'},
//   {id: 'video', icon: Video, angle: 90, color: '#7FC9E7'},
//   {id: 'music', icon: Music, angle: 135, color: '#7FC9E7'},
//   {id: 'edit', icon: Edit2, angle: 180, color: '#7FC9E7'},
//   {id: 'share', icon: Share2, angle: 225, color: '#7FC9E7'},
//   {id: 'download', icon: Download, angle: 270, color: '#7FC9E7'},
//   {id: 'settings', icon: Settings, angle: 315, color: '#7FC9E7'},
// ];

/**
 * 각도와 진행도에 따른 위치 계산
 */
const getPosition = (angleDeg, progress, radius) => {
  'worklet';
  const radian = (angleDeg * Math.PI) / 180;
  const x = Math.cos(radian) * radius * progress;
  const y = Math.sin(radian) * radius * progress;
  return {x, y};
};

export default function MetaballNavigation({state, navigation}) {
  // Camera, Gallery 화면일 때는 네비게이션 숨김
  const currentRoute = state.routes[state.index].name;
  if (currentRoute === 'Camera' || currentRoute === 'Gallery') {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);

  // 각 서브메뉴 아이템의 진행도
  const subMenuProgress = SUB_MENU_ITEMS.map(() => useSharedValue(0));
  const rotation = useSharedValue(0);
  const fabScale = useSharedValue(1);
  const fabCenterY = useSharedValue(FAB_CENTER_Y_CLOSED); // FAB Y 위치 애니메이션
  const backdropOpacity = useSharedValue(0);
  const navBarOpacity = useSharedValue(1); // 네비게이션 바 투명도

  // --- 애니메이션 ---
  useEffect(() => {
    rotation.value = withSpring(isOpen ? 45 : 0, {
      stiffness: 200,
      damping: 20,
    });

    fabScale.value = withSpring(isOpen ? 1.7 : 1, {
      stiffness: 120,
      damping: 18,
    });

    // FAB 중앙 이동 (속도 감소)
    fabCenterY.value = withSpring(
      isOpen ? FAB_CENTER_Y_OPEN : FAB_CENTER_Y_CLOSED,
      {
        stiffness: 100,
        damping: 25,
      },
    );

    // 블러 배경
    backdropOpacity.value = withSpring(isOpen ? 1 : 0, {
      stiffness: 200,
      damping: 20,
    });

    // 네비게이션 바는 항상 보이게
    navBarOpacity.value = 1;

    // 서브메뉴 뽕뽕 튀어나오기 (속도 감소)
    SUB_MENU_ITEMS.forEach((_, index) => {
      const delay = isOpen
        ? index * 100 + 250 // FAB 이동 후 시작 (딜레이 증가)
        : 0; // 닫힐 때는 한꺼번에
      subMenuProgress[index].value = withDelay(
        delay,
        withSpring(isOpen ? 1 : 0, {
          damping: 13,
          stiffness: 160,
          mass: 0.9,
        }),
      );
    });
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // --- Skia 메타볼 위치 계산 ---
  const metaballPositions = SUB_MENU_ITEMS.map((item, index) =>
    useDerivedValue(() => {
      const pos = getPosition(
        item.angle,
        subMenuProgress[index].value,
        MENU_RADIUS,
      );
      return vec(FAB_CENTER_X + pos.x, fabCenterY.value + pos.y);
    }),
  );

  // 브릿지 메타볼 (FAB과 서브메뉴 사이에만)
  const bridgeData = SUB_MENU_ITEMS.map((item, index) =>
    useDerivedValue(() => {
      const progress = subMenuProgress[index].value;

      // 0.1~0.35 구간에서만 브릿지 생성 (더 짧게)
      if (progress < 0.1 || progress > 0.35) {
        return [];
      }

      const bridges = [];
      const numBridges = 4; // 브릿지 개수 줄임

      for (let i = 0; i < numBridges; i++) {
        const t = (i + 1) / (numBridges + 1);
        const bridgeProgress = progress * t;
        const pos = getPosition(item.angle, bridgeProgress, MENU_RADIUS);

        // 거리에 따라 반지름 감소 (장력 효과)
        const radius = 45 - t * 10;

        bridges.push({
          pos: vec(FAB_CENTER_X + pos.x, fabCenterY.value + pos.y),
          radius: radius,
        });
      }

      return bridges;
    }),
  );

  // FAB 중심 위치 (동적 Y)
  const fabCenter = useDerivedValue(() => {
    return vec(FAB_CENTER_X, fabCenterY.value);
  });

  // FAB 반지름 (스케일 적용) - 동적 크기 변화
  const fabRadius = useDerivedValue(() => {
    return 34 * fabScale.value; // 기본 34에서 스케일 적용
  });

  // --- Reanimated 아이콘 스타일 (위치 + 스케일) ---
  const iconStyles = SUB_MENU_ITEMS.map((item, index) =>
    useAnimatedStyle(() => {
      const pos = getPosition(
        item.angle,
        subMenuProgress[index].value,
        MENU_RADIUS,
      );

      // 동적 중심점 계산 (FAB 이동에 따라)
      const centerY = fabCenterY.value;

      return {
        position: 'absolute',
        left: FAB_CENTER_X + pos.x - 28, // 아이콘 중심 기준
        top: centerY + pos.y - 28,
        transform: [{scale: subMenuProgress[index].value}],
        opacity: interpolate(
          subMenuProgress[index].value,
          [0, 0.3, 1],
          [0, 0, 1],
        ),
      };
    }),
  );

  const plusStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
    pointerEvents: isOpen ? 'auto' : 'none',
  }));

  const blurStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const navBarStyle = useAnimatedStyle(() => ({
    opacity: navBarOpacity.value,
  }));

  return (
    <>
      <View style={styles.container}>
        {/* 블러 배경 */}
        {isOpen && (
          <Animated.View
            style={[styles.blurBackdrop, blurStyle]}
            pointerEvents="none">
            {/* 반투명 오버레이 추가 (블러 효과 강화) */}
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'rgba(192, 192, 192, 0.6)',
              }}
            />
            <BlurView
              style={styles.blurView}
              blurType="light"
              blurAmount={10}
              reducedTransparencyFallbackColor="rgba(240, 240, 240, 0.85)"
            />
          </Animated.View>
        )}

        {/* LAYER 1: SVG 네비게이션 바 배경 (고정) */}
        <View style={styles.navBarBackground}>
          <Svg
            width={SCREEN_WIDTH}
            height={TAB_BAR_HEIGHT}
            style={styles.navBarSvg}>
            <Defs>
              <SvgLinearGradient id="shadow" x1="0" y1="1" x2="0" y2="0">
                <Stop offset="0" stopColor="rgba(0, 0, 0, 0)" />
                <Stop offset="0.3" stopColor="rgba(149, 168, 195, 0.25)" />
              </SvgLinearGradient>
              {/* 클립 패스 정의 (테두리용) */}
              <ClipPath id="borderClip">
                <SvgPath d={getNavBarPath()} />
              </ClipPath>
            </Defs>
            {/* 실제 배경 */}
            <SvgPath d={getNavBarPath()} fill="#ffffff" />
            {/* 상단 테두리 - 더 넓게 그리고 클립 */}
            <SvgPath
              d={getNavBarPath()}
              fill="none"
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth="2"
              clipPath="url(#borderClip)"
            />
          </Svg>
        </View>

        {/* LAYER 2: Skia Canvas (메타볼 애니메이션만) */}
        <View
          style={styles.canvas}
          pointerEvents={isOpen ? 'box-none' : 'none'}>
          <Canvas style={styles.canvas}>
            {/* 각 서브메뉴마다 독립적인 메타볼 레이어 */}
            {SUB_MENU_ITEMS.map((item, index) => (
              <Group key={`metaball-group-${index}`}>
                <Group
                  layer={
                    <Paint>
                      <Blur blur={20} />
                      <ColorMatrix matrix={METABALL_MATRIX} />
                    </Paint>
                  }>
                  {/* FAB 메타볼 (동적 크기 적용 - 그라데이션 적용) */}
                  <Circle c={fabCenter} r={fabRadius}>
                    <LinearGradient
                      start={useDerivedValue(() =>
                        vec(
                          fabCenter.value.x - fabRadius.value,
                          fabCenter.value.y,
                        ),
                      )}
                      end={useDerivedValue(() =>
                        vec(
                          fabCenter.value.x + fabRadius.value,
                          fabCenter.value.y,
                        ),
                      )}
                      colors={['#00B8DB', '#0095D5', '#0080CC', '#155DFC']}
                    />
                  </Circle>

                  {/* 이 서브메뉴와 연결되는 브릿지들 */}
                  {bridgeData[index].value.map((bridge, bridgeIndex) => (
                    <Circle
                      key={`bridge-${bridgeIndex}`}
                      c={bridge.pos}
                      r={bridge.radius}
                      color={item.color}
                    />
                  ))}

                  {/* 이 서브메뉴 메타볼 (투명하게 - 브릿지만 보이게) */}
                  <Circle
                    c={metaballPositions[index]}
                    r={21}
                    color={item.color}
                  />
                </Group>
              </Group>
            ))}

            {/* 서브메뉴 그라데이션 원들 */}
            {metaballPositions.map((pos, index) => (
              <Circle key={`submenu-gradient-${index}`} c={pos} r={28}>
                <LinearGradient
                  start={useDerivedValue(() =>
                    vec(pos.value.x - 28, pos.value.y),
                  )}
                  end={useDerivedValue(() =>
                    vec(pos.value.x + 28, pos.value.y),
                  )}
                  colors={['#00B8DB', '#0095D5', '#0080CC', '#155DFC']}
                />
              </Circle>
            ))}

            {/* FAB 그라데이션 원 */}
            <Group>
              {/* 메인 FAB */}
              <Circle c={fabCenter} r={fabRadius}>
                <LinearGradient
                  start={useDerivedValue(() =>
                    vec(fabCenter.value.x - fabRadius.value, fabCenter.value.y),
                  )}
                  end={useDerivedValue(() =>
                    vec(fabCenter.value.x + fabRadius.value, fabCenter.value.y),
                  )}
                  colors={['#00B8DB', '#0095D5', '#0080CC', '#155DFC']}
                />
              </Circle>
            </Group>
          </Canvas>
        </View>

        {/* LAYER 2: React Native 오버레이 (아이콘 & 인터랙션) */}
        <View style={styles.overlay} pointerEvents="box-none">
          {/* 하단 탭 바 아이콘들 (페이드아웃) */}
          <Animated.View style={[styles.tabBarIconsContainer, navBarStyle]}>
            <View style={styles.iconGroup}>
              <TouchableOpacity
                onPress={() => {
                  if (isOpen) closeMenu();
                  navigation.navigate('Home');
                }}>
                <Home
                  color={state.index === 0 ? '#3B82F6' : '#97A2B0'}
                  size={28}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (isOpen) closeMenu();
                  navigation.navigate('RecipeBoard');
                }}>
                <FileText
                  color={state.index === 1 ? '#3B82F6' : '#97A2B0'}
                  size={28}
                />
              </TouchableOpacity>
            </View>
            <View style={{width: 100}} />
            <View style={styles.iconGroup}>
              <TouchableOpacity
                onPress={() => {
                  if (isOpen) closeMenu();
                  navigation.navigate('Notification');
                }}>
                <Flag
                  color={state.index === 2 ? '#3B82F6' : '#97A2B0'}
                  size={28}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (isOpen) closeMenu();
                  navigation.navigate('Profile');
                }}>
                <User
                  color={state.index === 3 ? '#3B82F6' : '#97A2B0'}
                  size={28}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* 서브메뉴 아이콘들 (절대 위치) */}
          <View style={styles.centerAnchor} pointerEvents="box-none">
            {SUB_MENU_ITEMS.map((item, index) => (
              <Animated.View
                key={item.id}
                style={[
                  iconStyles[index],
                  {
                    width: 56,
                    height: 56,
                  },
                ]}
                pointerEvents={isOpen ? 'auto' : 'none'}>
                <TouchableOpacity
                  onPress={() => {
                    console.log(
                      `🎯 ${item.id} 버튼 클릭 → ${item.screen} 화면으로 이동`,
                    );

                    try {
                      // FAB 서브메뉴는 항상 스택 초기화하고 시작
                      navigation.reset({
                        index: 0,
                        routes: [{name: item.screen}],
                      });
                      closeMenu();
                    } catch (error) {
                      console.error('Navigation error:', error);
                      Alert.alert('에러', `${item.screen} 화면으로 이동 실패`);
                      closeMenu();
                    }
                  }}
                  style={styles.touchable}
                  activeOpacity={0.8}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <item.icon color="white" size={24} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* 중앙 FAB 버튼 (동적 위치 & 크기) */}
          <Animated.View
            style={[
              styles.fabAnchor,
              useAnimatedStyle(() => ({
                transform: [
                  {translateY: fabCenterY.value - FAB_CENTER_Y_CLOSED},
                  {scale: fabScale.value},
                ],
              })),
            ]}>
            <TouchableOpacity
              onPress={toggleMenu}
              style={styles.fabTouchable}
              activeOpacity={1}>
              <Animated.View style={plusStyle}>
                <Plus color="white" size={32} strokeWidth={3} />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* 투명한 배경 터치 레이어 - 가장 아래 */}
        {isOpen && (
          <Pressable
            style={[StyleSheet.absoluteFillObject, {zIndex: 5}]}
            onPress={closeMenu}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },

  // SVG 네비게이션 바 배경 (LAYER 1)
  navBarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    zIndex: 1,
    // 그림자 효과 (iOS)
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // 그림자 효과 (Android)
    elevation: 8,
  },
  navBarSvg: {
    position: 'absolute',
    bottom: 0,
  },

  // Canvas 메타볼 레이어 (LAYER 2)
  canvas: {
    flex: 1,
    zIndex: 5,
  },

  // 아이콘 오버레이 (LAYER 3)
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },

  // 탭 바 아이콘
  tabBarIconsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  iconGroup: {
    flexDirection: 'row',
    width: 90,
    justifyContent: 'space-between',
  },

  // 중앙 앵커
  centerAnchor: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SCREEN_WIDTH,
    height: CANVAS_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  menuItem: {
    position: 'absolute',
    left: FAB_CENTER_X - 28,
    top: FAB_CENTER_Y_CLOSED - 28, // 기본 위치 (동적 위치는 애니메이션으로 처리)
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 메인 FAB
  fabAnchor: {
    position: 'absolute',
    left: FAB_CENTER_X - 28,
    top: FAB_CENTER_Y_CLOSED - 28, // 기본 위치
    width: 56,
    height: 56,
    zIndex: 35,
  },
  fabTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },

  // 블러 배경 (전체 화면)
  blurBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  backdropPress: {
    flex: 1,
  },
  blurView: {
    flex: 1,
  },
});
