import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {ChevronRight} from 'lucide-react-native';
import {homeStyles} from '../../styles/screens/home/homeStyles';
import {colors} from '../../styles/common';
const FryingPan = require('../../assets/images/main/mainFryingPan.png');
const Mice = require('../../assets/images/main/mainMice.png');
const Board = require('../../assets/images/main/mianBoard.png');
const ShoppingCart = require('../../assets/images/main/mianShoppingCart.png');
const CardArrows = require('../../assets/images/main/cardArrows.png');

/**
 * 메인 홈 화면의 메뉴 카드 컴포넌트
 * 4가지 타입: 냉장고털기, 레시피찾기, 레시피게시판, 같이장보기
 *
 * @param {string} type - 카드 타입 ('fridge', 'search', 'board', 'shopping')
 * @param {string} title - 카드 제목
 * @param {string} subtitle - 카드 부제목
 * @param {function} onPress - 카드 클릭 핸들러
 * @param {object} style - 추가 스타일
 */
export default function MenuCard({type, title, subtitle, onPress, style}) {
  // 타입별 설정 (이미지 크기와 위치 개별 조정 가능)
  const getCardConfig = () => {
    switch (type) {
      case 'fridge':
        return {
          cardStyle: homeStyles.fridgeCard,
          imageSource: FryingPan,
          imageStyle: homeStyles.fridgeImage,
          imageSize: {width: 230, height: 200},
          imagePosition: {top: -40, right: 20},
          arrowDecorationColor: 'rgba(255, 255, 255, 0.15)',
          arrowIconColor: '#12175E', // 어두운 남색
          arrowIconSize: 18,
          textColor: '#12175E', // 어두운 남색
          subtitleColor: '#12175E',
        };
      case 'search':
        return {
          cardStyle: homeStyles.recipeSearchCard,
          imageSource: Mice,
          imageStyle: homeStyles.recipeSearchImage,
          imageSize: {width: 140, height: 140},
          imagePosition: {top: -60, right: 50},
          arrowDecorationColor: 'rgba(255, 255, 255, 0.2)',
          arrowIconColor: '#FFFFFF', // 흰색
          arrowIconSize: 16,
          textColor: '#FFFFFF',
          subtitleColor: 'rgba(255, 255, 255, 0.9)',
        };
      case 'board':
        return {
          cardStyle: homeStyles.recipeBoardCard,
          imageSource: Board,
          imageStyle: homeStyles.recipeBoardImage,
          imageSize: {width: 160, height: 160},
          imagePosition: {top: -35, right: 0},
          arrowDecorationColor: 'rgba(255, 255, 255, 0.2)',
          arrowIconColor: '#FFFFFF', // 흰색
          arrowIconSize: 16,
          textColor: '#FFFFFF',
          subtitleColor: 'rgba(255, 255, 255, 0.9)',
        };
      case 'shopping':
        return {
          cardStyle: homeStyles.shoppingCard,
          imageSource: ShoppingCart,
          imageStyle: homeStyles.shoppingImage,
          imageSize: {width: 160, height: 160},
          imagePosition: {top: -25, right: 30},
          arrowDecorationColor: 'rgba(18, 23, 94, 0.1)',
          arrowIconColor: '#12175E', // 어두운 남색
          arrowIconSize: 16,
          textColor: '#12175E',
          subtitleColor: '#12175E',
        };
      default:
        return {
          cardStyle: {},
          imageSource: null,
          imageStyle: {},
          imageSize: {width: 140, height: 140},
          isDark: false,
        };
    }
  };

  const config = getCardConfig();

  return (
    <TouchableOpacity
      style={[homeStyles.menuCard, config.cardStyle, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      {/* 오른쪽 위 화살표 장식 */}
      <View style={homeStyles.cardArrowDecoration}>
        <Image
          source={CardArrows}
          style={{
            width: 60,
            height: 60,
            tintColor: config.arrowDecorationColor,
          }}
          resizeMode="contain"
        />
      </View>

      {/* 화살표 아이콘 */}
      <View style={homeStyles.arrowIcon}>
        <ChevronRight
          size={config.arrowIconSize || 14}
          color={config.arrowIconColor}
          strokeWidth={2.5}
        />
      </View>

      {/* 메뉴 이미지 (각 카드별 크기와 위치 개별 조정) */}
      {config.imageSource && (
        <View style={[config.imageStyle, config.imagePosition]}>
          <Image
            source={config.imageSource}
            style={{
              width: config.imageSize.width,
              height: config.imageSize.height,
            }}
            resizeMode="contain"
          />
        </View>
      )}

      {/* 텍스트 */}
      <View>
        <Text style={[homeStyles.menuCardTitle, {color: config.textColor}]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              homeStyles.menuCardSubtitle,
              {color: config.subtitleColor},
            ]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
