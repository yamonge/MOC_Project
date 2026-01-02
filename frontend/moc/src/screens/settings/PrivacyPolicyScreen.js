import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {ArrowLeft} from 'lucide-react-native';
import styles from '../../styles/screens/settings/PrivacyPolicyStyles';
import {colors} from '../../styles/common';

/**
 * 개인정보 처리방침 화면
 *
 * 구조:
 * - 상단 헤더: 뒤로가기 + "개인정보 처리방침" 타이틀
 * - 스크롤 컨텐츠: 개인정보 처리방침 전문
 */
export default function PrivacyPolicyScreen({navigation}) {
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Settings')}>
          <ArrowLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>개인정보 처리방침</Text>
      </View>

      {/* 스크롤 영역 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentCard}>
          {/* 업데이트 정보 */}
          <View style={styles.updateInfo}>
            <Text style={styles.updateDate}>
              최종 업데이트: 2024년 12월 14일
            </Text>
            <Text style={styles.introText}>
              My Own Chef(이하 "회사")은 이용자의 개인정보를
              중요시하며,「개인정보 보호법」을 준수하고 있습니다.
            </Text>
          </View>

          <View style={styles.sections}>
            {/* 1. 수집하는 개인정보 항목 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. 수집하는 개인정보 항목</Text>
              <View style={styles.sectionContent}>
                <View style={styles.subsection}>
                  <Text style={styles.subsectionTitle}>가. 필수 항목</Text>
                  <Text style={styles.listItem}>• 이메일 주소</Text>
                  <Text style={styles.listItem}>• 비밀번호</Text>
                  <Text style={styles.listItem}>• 이름</Text>
                  <Text style={styles.listItem}>• 닉네임</Text>
                </View>

                <View style={styles.subsection}>
                  <Text style={styles.subsectionTitle}>나. 선택 항목</Text>
                  <Text style={styles.listItem}>• 프로필 사진</Text>
                  <Text style={styles.listItem}>
                    • 위치 정보 (같이 장보기 서비스 이용 시)
                  </Text>
                  <Text style={styles.listItem}>
                    • 카메라/갤러리 접근 (영수증 촬영 시)
                  </Text>
                </View>
              </View>
            </View>

            {/* 2. 개인정보의 수집 및 이용 목적 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                2. 개인정보의 수집 및 이용 목적
              </Text>
              <View style={styles.sectionContent}>
                <Text style={styles.bodyText}>
                  회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
                </Text>
                <Text style={styles.listItem}>
                  • 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별,
                  불량회원의 부정 이용 방지
                </Text>
                <Text style={styles.listItem}>
                  • 서비스 제공: AI 레시피 추천, 같이 장보기 매칭, 레시피 게시판
                  서비스 제공
                </Text>
                <Text style={styles.listItem}>
                  • 마케팅 및 광고: 이벤트 정보 및 참여기회 제공, 광고성 정보
                  제공
                </Text>
                <Text style={styles.listItem}>
                  • 고객 지원: 고객 문의 대응, 공지사항 전달
                </Text>
              </View>
            </View>

            {/* 3. 개인정보의 보유 및 이용기간 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                3. 개인정보의 보유 및 이용기간
              </Text>
              <View style={styles.sectionContent}>
                <Text style={styles.bodyText}>
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
                  개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
                  개인정보를 처리·보유합니다.
                </Text>
                <Text style={styles.listItem}>
                  • 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이
                  진행중인 경우에는 해당 수사·조사 종료 시까지)
                </Text>
                <Text style={styles.listItem}>
                  • 상법, 전자상거래 등에서의 소비자보호에 관한 법률 등
                  관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는
                  관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
                </Text>
              </View>
            </View>

            {/* 4. 개인정보의 제3자 제공 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. 개인정보의 제3자 제공</Text>
              <View style={styles.sectionContent}>
                <Text style={styles.bodyText}>
                  회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지
                  않습니다. 다만, 아래의 경우에는 예외로 합니다:
                </Text>
                <Text style={styles.listItem}>
                  • 이용자가 사전에 동의한 경우
                </Text>
                <Text style={styles.listItem}>
                  • 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와
                  방법에 따라 수사기관의 요구가 있는 경우
                </Text>
              </View>
            </View>

            {/* 5. 정보주체의 권리·의무 및 행사방법 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                5. 정보주체의 권리·의무 및 행사방법
              </Text>
              <View style={styles.sectionContent}>
                <Text style={styles.bodyText}>
                  이용자는 언제든지 다음 각 호의 개인정보 보호 관련 권리를
                  행사할 수 있습니다:
                </Text>
                <Text style={styles.listItem}>• 개인정보 열람 요구</Text>
                <Text style={styles.listItem}>
                  • 오류 등이 있을 경우 정정 요구
                </Text>
                <Text style={styles.listItem}>• 삭제 요구</Text>
                <Text style={styles.listItem}>• 처리정지 요구</Text>
              </View>
            </View>

            {/* 6. 개인정보 보호책임자 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. 개인정보 보호책임자</Text>
              <View style={styles.sectionContent}>
                <Text style={styles.listItem}>이름: MOC 개인정보보호팀</Text>
                <Text style={styles.listItem}>직책: 개인정보보호 담당자</Text>
                <Text style={styles.listItem}>
                  이메일: privacy@myownchef.com
                </Text>
                <Text style={styles.listItem}>전화: 02-1234-5678</Text>
              </View>
            </View>
          </View>

          {/* 적용일 안내 */}
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              본 개인정보처리방침은 2025년 12월 14일부터 적용됩니다.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
