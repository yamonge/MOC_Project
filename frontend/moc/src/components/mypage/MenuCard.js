import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import styles from '../../styles/components/mypage/MenuCardStyles';

// 아이콘 이미지 import
const iconImages = {
  clipboard: require('../../assets/images/mypage/list-photoroom.png'),
  star: require('../../assets/images/mypage/rating.png'),
  send: require('../../assets/images/mypage/share.png'),
  mail: require('../../assets/images/mypage/message.png'),
  'alert-triangle': require('../../assets/images/mypage/report.png'),
  settings: require('../../assets/images/mypage/settings.png'),
};

/**
 * 마이페이지 메뉴 카드 컴포넌트
 *
 * @param {string} title - 메뉴 제목
 * @param {number|null} count - 카운트 (null이면 표시 안함)
 * @param {string} backgroundColor - 배경색
 * @param {string} icon - 아이콘 이름
 * @param {function} onPress - 클릭 핸들러
 */
export default function MenuCard({
  title,
  count,
  backgroundColor,
  icon,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[styles.container, {backgroundColor}]}
      onPress={onPress}
      activeOpacity={0.7}>
      {/* 아이콘 이미지 */}
      <View style={styles.iconContainer}>
        <Image
          source={iconImages[icon]}
          style={styles.iconImage}
          resizeMode="contain"
        />
      </View>

      {/* 텍스트 영역 */}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={[styles.count, title === '설정' && {opacity: 0}]}>
          {count !== null ? `${count}개` : ' '}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
