import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft, Home} from 'lucide-react-native';
import styles from '../../styles/screens/settings/AppInfoStyles';
import {colors} from '../../styles/common';

/**
 * 앱 정보 화면
 *
 * 구조:
 * - 상단 헤더: 뒤로가기 + "앱 정보" 타이틀
 * - 앱 아이콘 + 이름 + 버전
 * - 정보 카드: 개발사, 고객센터, 운영시간, 사업자정보
 * - 하단 저작권 정보
 */
export default function AppInfoScreen({navigation}) {
  const appVersion = '1.0.0';

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Settings')}>
          <ArrowLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>앱 정보</Text>
      </View>

      {/* 스크롤 영역 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 앱 아이콘 & 정보 */}
        <View style={styles.appIconSection}>
          <LinearGradient
            colors={['#2B7FFF', '#9810FA']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.appIcon}>
            <Home size={40} color={colors.white} strokeWidth={2} />
          </LinearGradient>
          <Text style={styles.appName}>MOC 앱</Text>
          <Text style={styles.appVersion}>버전 {appVersion}</Text>
        </View>

        {/* 정보 카드들 */}
        <View style={styles.infoCards}>
          {/* 개발사 */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>개발사</Text>
            <Text style={styles.infoValue}>MOC 주식회사</Text>
          </View>

          {/* 고객센터 */}
          <View style={[styles.infoCard, styles.infoCardTall]}>
            <Text style={styles.infoLabel}>고객센터</Text>
            <Text style={styles.infoValue}>support@myownchef.com</Text>
            <Text style={styles.infoValue}>02-1234-5678</Text>
          </View>

          {/* 운영 시간 */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>운영 시간</Text>
            <Text style={styles.infoValue}>
              평일 09:00 - 18:00 (주말 및 공휴일 휴무)
            </Text>
          </View>

          {/* 사업자 정보 */}
          <View style={[styles.infoCard, styles.businessCard]}>
            <Text style={styles.infoLabel}>사업자 정보</Text>
            <Text style={styles.businessInfo}>상호: My Own Chef 주식회사</Text>
            <Text style={styles.businessInfo}>대표: MOC 팀</Text>
            <Text style={styles.businessInfo}>
              사업자등록번호: 123-45-67890
            </Text>
            <Text style={styles.businessInfo}>
              주소: 서울특별시 강남구 테헤란로 123
            </Text>
          </View>
        </View>

        {/* 저작권 정보 */}
        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            © 2024 My Own Chef. All rights reserved.
          </Text>
          <Text style={styles.madeWithLove}>Made with ❤️ in Seoul</Text>
        </View>
      </ScrollView>
    </View>
  );
}
