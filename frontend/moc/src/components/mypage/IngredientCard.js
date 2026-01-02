import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Trash2} from 'lucide-react-native';
import styles from '../../styles/components/mypage/IngredientCardStyles';

// 카테고리별 그라데이션 색상
const categoryColors = {
  meat: ['#ff6467', '#ff2056'],
  dairy: ['#51a2ff', '#00b8db'],
  vegetable: ['#4ade80', '#16a34a'],
  fruit: ['#fbbf24', '#f59e0b'],
};

/**
 * 재료 카드 컴포넌트
 *
 * @param {string} name - 재료명
 * @param {string} category - 카테고리 (meat, dairy, vegetable, fruit)
 * @param {string} icon - 아이콘 타입
 * @param {function} onDelete - 삭제 핸들러
 */
export default function IngredientCard({
  name,
  category = 'meat',
  icon,
  onDelete,
}) {
  const gradientColors = categoryColors[category] || categoryColors.meat;

  return (
    <View style={styles.container}>
      {/* 좌측: 카테고리 아이콘 */}
      <LinearGradient
        colors={gradientColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        angle={135}
        style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          {/* 실제 아이콘 이미지로 교체 필요 */}
          <View style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>{name.charAt(0)}</Text>
          </View>
        </View>
        <View style={styles.iconOverlay} />
      </LinearGradient>

      {/* 중앙: 재료명 */}
      <Text style={styles.name}>{name}</Text>

      {/* 우측: 삭제 버튼 */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        activeOpacity={0.8}>
        <LinearGradient
          colors={['#fb2c36', '#ec003f']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          angle={135}
          style={styles.deleteButtonGradient}>
          <Trash2 color="#fff" size={22} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
