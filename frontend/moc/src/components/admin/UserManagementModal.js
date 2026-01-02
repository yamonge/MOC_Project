import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {X, AlertTriangle} from 'lucide-react-native';
import styles from '../../styles/components/admin/UserManagementModalStyles';
import {colors} from '../../styles/common';
import {suspendUser, unsuspendUser, deleteUser} from '../../api/admin';
import SuspendDurationModal from './SuspendDurationModal';

/**
 * 회원 관리 모달
 *
 * Props:
 * - visible: 모달 표시 여부
 * - user: 선택된 회원 정보
 * - onClose: 모달 닫기 콜백
 * - onUpdate: 회원 정보 업데이트 콜백
 *
 * 기능:
 * - 회원 정보 표시 (이름, 닉네임, 가입일, 신고 횟수, 상태)
 * - 계정 활성화 (정지 -> 활동중)
 * - 회원 탈퇴 (영구 삭제)
 * - 취소
 */
export default function UserManagementModal({
  visible,
  user,
  onClose,
  onUpdate,
}) {
  const [loading, setLoading] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);

  if (!visible || !user) return null;

  const isActive = user.status === 'active';

  // 계정 활성화/정지
  const handleToggleStatus = async () => {
    if (isActive) {
      // 정지 -> 기간 선택 모달 열기
      setShowDurationModal(true);
      return;
    } else {
      // 활성화 -> 바로 실행
      Alert.alert(
        '계정 활성화',
        `${user.name} 회원의 계정을 활성화하시겠습니까?`,
        [
          {text: '취소', style: 'cancel'},
          {
            text: '활성화',
            onPress: async () => {
              try {
                setLoading(true);
                await unsuspendUser(user.id);

                Alert.alert('완료', '계정이 활성화되었습니다.');
                onUpdate?.();
                onClose();
              } catch (error) {
                console.error('계정 활성화 실패:', error);
                Alert.alert('오류', '계정 활성화에 실패했습니다.');
              } finally {
                setLoading(false);
              }
            },
          },
        ],
      );
    }
  };

  // 기간 선택 후 계정 정지
  const handleSuspendWithDuration = async duration => {
    const durationText =
      duration === 'permanent' ? '영구 정지' : `${duration}일 정지`;

    Alert.alert(
      '계정 정지',
      `${user.name} 회원을 ${durationText}하시겠습니까?`,
      [
        {text: '취소', style: 'cancel'},
        {
          text: '정지',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await suspendUser(user.id, {
                reason: '관리자 직접 정지',
                duration: duration,
              });
              Alert.alert('완료', `계정이 ${durationText}되었습니다.`);
              onUpdate?.();
              onClose();
            } catch (error) {
              console.error('계정 정지 실패:', error);
              Alert.alert('오류', '계정 정지에 실패했습니다.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  // 회원 탈퇴
  const handleDeleteUser = () => {
    Alert.alert(
      '회원 탈퇴',
      `${user.name} 회원을 탈퇴시키시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      [
        {text: '취소', style: 'cancel'},
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);

              await deleteUser(user.id, {reason: '약관 위반'});
              Alert.alert('완료', '회원이 탈퇴되었습니다.');
              onUpdate?.();
              onClose();
            } catch (error) {
              console.error('회원 탈퇴 실패:', error);
              Alert.alert('오류', '회원 탈퇴에 실패했습니다.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.modalContainer}>
        {/* 헤더 */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>회원 관리</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}>
            <X size={24} color="#0a0a0a" />
          </TouchableOpacity>
        </View>

        {/* 콘텐츠 */}
        <View style={styles.modalContent}>
          {/* 경고 아이콘 */}
          <View style={styles.iconContainer}>
            {/* 사용자 프로필 사진 */}
            <AlertTriangle size={64} color="#FF8904" strokeWidth={2} />
          </View>

          {/* 회원 정보 */}
          <View style={styles.userInfoSection}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userNickname}>@{user.nickname}</Text>
            <Text style={styles.userJoinDate}>가입일: {user.joinDate}</Text>
            {user.reportCount > 0 && (
              <Text style={styles.userReportCount}>
                신고 {user.reportCount}회
              </Text>
            )}
            <View
              style={[
                styles.statusBadge,
                isActive
                  ? styles.statusBadgeActive
                  : styles.statusBadgeSuspended,
              ]}>
              <Text
                style={[
                  styles.statusBadgeText,
                  isActive
                    ? styles.statusBadgeTextActive
                    : styles.statusBadgeTextSuspended,
                ]}>
                {isActive ? '활동중' : '정지'}
              </Text>
            </View>
          </View>

          {/* 액션 버튼 */}
          <View style={styles.actionButtons}>
            {/* 계정 활성화/정지 버튼 */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleToggleStatus}
              activeOpacity={0.8}
              disabled={loading}>
              <LinearGradient
                colors={
                  isActive ? ['#ED6F75', '#F60000'] : ['#00c950', '#008736']
                }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                angle={170.24}
                style={styles.gradientButton}>
                <Text style={styles.actionButtonText}>
                  {isActive ? '계정 정지' : '계정 활성화'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* 회원 탈퇴 버튼 */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDeleteUser}
              activeOpacity={0.8}
              disabled={loading}>
              <LinearGradient
                colors={['#ED6F75', '#F60000']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                angle={170.24}
                style={styles.gradientButton}>
                <Text style={styles.actionButtonText}>회원 탈퇴</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* 취소 버튼 */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
              disabled={loading}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 정지 기간 선택 모달 */}
        <SuspendDurationModal
          visible={showDurationModal}
          userName={user.name}
          onClose={() => setShowDurationModal(false)}
          onSelect={handleSuspendWithDuration}
        />
      </View>
    </View>
  );
}
