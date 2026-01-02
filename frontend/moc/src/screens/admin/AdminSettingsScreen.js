import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ArrowLeft,
  Users,
  AlertTriangle,
  FileText,
  Bell,
  Shield,
  Star,
} from 'lucide-react-native';
import styles from '../../styles/screens/admin/AdminSettingsStyles';
import {colors} from '../../styles/common';
import {getAdminStats} from '../../api/admin';

/**
 * 관리자 설정 메인 화면
 *
 * 구조:
 * - 상단 그라데이션 헤더: 뒤로가기 + "관리자 설정" 타이틀 + 일러스트
 * - 관리 메뉴: 회원 관리, 신고 관리, 게시글 관리, 공지사항 작성
 * - 통계 카드: 전체 회원, 미처리 신고
 */
export default function AdminSettingsScreen({navigation}) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingReports: 0,
  });

 // ✅ 화면 포커스될 때마다 재조회
  useFocusEffect(
    useCallback(() => {
      loadAdminStats();
      // cleanup 필요 없으면 return 생략
      return () => {};
    }, []),
  );

  // 관리자 통계 로드
  const loadAdminStats = async () => {
    try {
      const data = await getAdminStats();
      setStats({
        totalUsers: data?.totalUsers || 0,
        pendingReports: data?.pendingReports || 0,
      });
    } catch (error) {
      console.error('관리자 통계 로드 실패:', error);
    }
  };

  // 관리 메뉴 항목 렌더링
  const AdminMenuItem = ({
    icon: Icon,
    title,
    description,
    colors: gradientColors,
    onPress,
  }) => (
    <TouchableOpacity
      style={styles.menuCard}
      onPress={onPress}
      activeOpacity={0.7}>
      <LinearGradient
        colors={gradientColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.menuIcon}>
        <Icon size={28} color={colors.white} strokeWidth={2} />
      </LinearGradient>
      <View style={styles.menuInfo}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 그라데이션 헤더 */}
      <LinearGradient
        colors={['#ED6F75', '#C80000']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        angle={160}
        style={styles.header}>
        {/* 배경 장식 아이콘들 */}
        <View style={[styles.decorIcon, styles.decorIcon1]}>
          <Star size={48} color="rgba(255, 255, 255, 0.3)" strokeWidth={2} />
        </View>
        <View style={[styles.decorIcon, styles.decorIcon2]}>
          <Shield size={28} color="rgba(255, 255, 255, 0.3)" strokeWidth={2} />
        </View>
        <View style={[styles.decorIcon, styles.decorIcon3]}>
          <Star size={42} color="rgba(255, 255, 255, 0.3)" strokeWidth={2} />
        </View>

        {/* 헤더 내용 */}
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Settings')}>
            <ArrowLeft size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>관리자 설정</Text>
        </View>

        {/* 일러스트 - 피그마에서 추출 필요 */}
        <Image
          source={require('../../assets/images/admin/adminIcon.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </LinearGradient>

      {/* 스크롤 영역 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 관리 메뉴 */}
        <View style={styles.menuSection}>
          <AdminMenuItem
            icon={Users}
            title="회원 관리"
            description="회원 목록, 계정 정지/해제"
            colors={['#00B8DB', '#155DFC']}
            onPress={() => navigation.navigate('UserManagement')}
          />
          <AdminMenuItem
            icon={AlertTriangle}
            title="신고 관리"
            description="신고 목록, 경고/정지 처리"
            colors={['#ED6F75', '#C80000']}
            onPress={() => navigation.navigate('ReportManagement')}
          />
          <AdminMenuItem
            icon={FileText}
            title="게시글 관리"
            description="게시글 검색, 삭제/숨김"
            colors={['#7371FC', '#8677D9', '#B99DD8']}
            onPress={() => navigation.navigate('PostManagement')}
          />
          <AdminMenuItem
            icon={Bell}
            title="공지사항 관리"
            description="공지 작성, 수정, 삭제"
            colors={['#05DF72', '#00BC7D']}
            onPress={() => navigation.navigate('NoticeManagement')}
          />
        </View>

        {/* 통계 카드 */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>전체 회원</Text>
            <Text style={styles.statValue}>
              {stats.totalUsers.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabelRed}>미처리 신고</Text>
            <Text style={styles.statValueRed}>{stats.pendingReports}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
