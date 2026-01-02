import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert, Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Star} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createReview} from '../../api/review';
import {getChatRoomParticipants} from '../../api/chat';
import {colors} from '../../styles/common';
import styles from '../../styles/components/chat/ReviewWriteModalStyles';

/**
 * 후기 작성 모달
 * @param {boolean} visible - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 콜백
 * @param {number} chatRoomId - 채팅방 ID
 * @param {number} shoppingPostId - 장보기 게시글 ID
 * @param {string} placeName - 장소명 (예: "이마트 월드컵점")
 * @param {function} onSuccess - 후기 작성 성공 콜백
 * @param {function} onSkip - 후기 작성 안 함 콜백
 */
export default function ReviewWriteModal({
  visible,
  onClose,
  chatRoomId,
  shoppingPostId,
  placeName,
  onSuccess,
  onSkip,
}) {
  const [userId, setUserId] = useState(null);
  const [hostUserId, setHostUserId] = useState(null); // 방장 ID
  const [hostNickname, setHostNickname] = useState(null); // 방장 닉네임
  const [hostProfileImageUrl, setHostProfileImageUrl] = useState(null); // 방장 프로필 이미지 URL
  const [rating, setRating] = useState(0); // 별점 (1~5)
  const [reviewText, setReviewText] = useState(''); // 후기 내용
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  // 사용자 ID 로드
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setUserId(Number(id));
      } catch (error) {
        console.error('userId 로드 실패:', error);
      }
    };
    loadUserId();
  }, []);

  // 방장 정보 로드 (채팅방 참여자 목록에서 isOwner가 true인 사용자 = 방장)
  useEffect(() => {
    const loadHostInfo = async () => {
      if (!chatRoomId || !visible) return;

      try {
        console.log('📋 [ReviewWriteModal] 방장 정보 로드 시작...');
        const participants = await getChatRoomParticipants(chatRoomId);

        if (participants && participants.length > 0) {
          // 🔥 isOwner가 true인 참여자 찾기 (방장 = 게시글 작성자)
          const host = participants.find(
            p => p.isOwner === true || p.isOwner === 1,
          );

          if (host) {
            setHostUserId(host.userId);
            setHostNickname(host.nickname || null);
            setHostProfileImageUrl(host.profileImageUrl || null);
            console.log(
              '✅ [ReviewWriteModal] 방장 ID:',
              host.userId,
              '닉네임:',
              host.nickname,
              '프로필 이미지:',
              host.profileImageUrl || '없음',
            );
          } else {
            console.warn(
              '⚠️ [ReviewWriteModal] 방장을 찾을 수 없습니다. 첫 번째 참여자를 방장으로 설정합니다.',
            );
            const firstParticipant = participants[0];
            setHostUserId(firstParticipant.userId);
            setHostNickname(firstParticipant.nickname || null);
            setHostProfileImageUrl(firstParticipant.profileImageUrl || null);
          }
        } else {
          console.warn('⚠️ [ReviewWriteModal] 참여자 목록이 비어있습니다.');
        }
      } catch (error) {
        console.error('❌ [ReviewWriteModal] 방장 정보 로드 실패:', error);
      }
    };

    loadHostInfo();
  }, [chatRoomId, visible]);

  // 모달 초기화
  useEffect(() => {
    if (visible) {
      setRating(0);
      setReviewText('');
      setIsFocused(false);
      // 방장 정보는 유지 (visible이 true일 때 다시 로드됨)
    }
  }, [visible]);

  // 별점 선택
  const handleStarPress = index => {
    setRating(index + 1);
  };

  // 후기 제출
  const handleSubmit = async () => {
    // 유효성 검사
    if (rating === 0) {
      Alert.alert('알림', '별점을 선택해주세요.');
      return;
    }

    if (!hostUserId) {
      Alert.alert('오류', '방장 정보를 불러올 수 없습니다.');
      return;
    }

    if (!shoppingPostId) {
      Alert.alert('오류', '게시글 정보를 찾을 수 없습니다.');
      return;
    }

    setLoading(true);

    try {
      console.log('✍️ [ReviewWriteModal] 후기 작성 시작...');
      console.log('  - 작성자:', userId);
      console.log('  - 대상자 (방장):', hostUserId);
      console.log('  - 게시글 ID:', shoppingPostId);
      console.log('  - 별점:', rating);
      console.log('  - 후기 내용:', reviewText || '(없음)');

      const reviewData = {
        targetUserId: hostUserId, // 방장에게 후기 작성
        shoppingPostId: shoppingPostId,
        rating: rating,
        userReviewComment: reviewText.trim() || null, // 선택 사항
      };

      await createReview(userId, reviewData);

      console.log('✅ [ReviewWriteModal] 후기 작성 완료!');
      Alert.alert('완료', '후기가 작성되었습니다!', [
        {
          text: '확인',
          onPress: () => {
            onClose();
            if (onSuccess) onSuccess();
          },
        },
      ]);
    } catch (error) {
      console.error('❌ [ReviewWriteModal] 후기 작성 실패:', error);
      Alert.alert(
        '오류',
        '후기 작성에 실패했습니다.\n잠시 후 다시 시도해주세요.',
      );
    } finally {
      setLoading(false);
    }
  };

  // 작성 안 함 버튼
  const handleSkip = () => {
    if (rating > 0 || reviewText.trim().length > 0) {
      Alert.alert(
        '확인',
        '작성 중인 내용이 있습니다.\n정말로 나가시겠습니까?',
        [
          {text: '취소', style: 'cancel'},
          {
            text: '나가기',
            style: 'destructive',
            onPress: async () => {
              onClose();
              // 🔥 작성 안 함 시에도 채팅방 목록에서 제거
              if (onSkip) {
                await onSkip();
              }
            },
          },
        ],
      );
    } else {
      // 🔥 작성 안 함 선택 시 채팅방 목록에서 제거
      const executeSkip = async () => {
        onClose();
        if (onSkip) {
          await onSkip();
        }
      };
      executeSkip();
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>후기 작성</Text>
        </View>

        {/* 콘텐츠 */}
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={20}>
          <View style={styles.content}>
            {/* 프로필 섹션 */}
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                {hostProfileImageUrl ? (
                  <Image
                    source={{uri: hostProfileImageUrl}}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.profileEmoji}>
                    {hostNickname
                      ? hostNickname.charAt(0).toUpperCase()
                      : '👽'}
                  </Text>
                )}
              </View>
              <Text style={styles.profileTitle}>
                {hostNickname || placeName || '장보기'}님과의 장보기
              </Text>
              <Text style={styles.profileSubtitle}>어떠셨나요?</Text>
            </View>

            {/* 별점 섹션 */}
            <View style={styles.starsContainer}>
              {[0, 1, 2, 3, 4].map(index => (
                <TouchableOpacity
                  key={index}
                  style={styles.starButton}
                  onPress={() => handleStarPress(index)}
                  activeOpacity={0.7}>
                  <Star
                    size={40}
                    color={index < rating ? '#FFC107' : '#E5E7EB'}
                    fill={index < rating ? '#FFC107' : '#E5E7EB'}
                    strokeWidth={0}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* 후기 입력 섹션 */}
            <View style={styles.reviewInputSection}>
              <Text style={styles.reviewLabel}>후기 (선택)</Text>
              <TextInput
                style={[
                  styles.textInput,
                  isFocused && styles.textInputFocused,
                  !reviewText && styles.placeholderText,
                ]}
                placeholder="함께한 경험을 공유해주세요"
                placeholderTextColor="rgba(23, 23, 23, 0.5)"
                value={reviewText}
                onChangeText={text => {
                  if (text.length <= 200) {
                    setReviewText(text);
                  }
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                multiline
                maxLength={200}
              />
              <Text style={styles.charCount}>{reviewText.length}/200</Text>
            </View>

            {/* 안내 박스 */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                작성한 후기는 다른 사용자들에게 도움이 됩니다. 정직하고 건설적인
                피드백을 부탁드려요!
              </Text>
            </View>
          </View>
          {/* 버튼 영역 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleSkip}
              activeOpacity={0.8}>
              <Text style={styles.cancelButtonText}>작성 안 함</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                (rating === 0 || loading) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={rating === 0 || loading}
              activeOpacity={0.8}>
              <Text style={styles.submitButtonText}>
                {loading ? '작성 중...' : '작성하기'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}
