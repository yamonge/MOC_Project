import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {X, Clock} from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import {Portal} from '@gorhom/portal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TimePickerModal from './TimePickerModal';
import {createPost} from '../../api/map';
import styles from '../../styles/components/map/PostCreateModalStyles';
import {Alert} from 'react-native';
import {colors} from '../../styles/common';

/**
 * 게시물 작성 모달
 * - 만날 장소 (선택된 마트 자동 입력)
 * - 만날 시간 선택 (TimePickerModal 사용)
 * - 인원수 슬라이더 (2~5명)
 * - 구매할 재료 선택 (다중 선택)
 * - 설명 입력 (선택, 최대 100자)
 */
export default function PostCreateModal({
  visible,
  onClose,
  storeName = '',
  selectedMarker,
  onCreated,
}) {
  // 만날 시간
  const [selectedTime, setSelectedTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 인원수 (2~5명)
  const [peopleCount, setPeopleCount] = useState(2);

  // 구매할 재료 (다중 선택)
  const ingredientOptions = [
    {id: 'meat', label: '🥩 육류', emoji: '🥩'},
    {id: 'dairy', label: '🥛 유제품', emoji: '🥛'},
    {id: 'vegetable', label: '🥬 채소', emoji: '🥬'},
    {id: 'fruit', label: '🍎 과일', emoji: '🍎'},
    {id: 'snack', label: '🍫 간식', emoji: '🍫'},
    {id: 'etc', label: '기타', emoji: ''},
  ];
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // 설명 (선택)
  const [description, setDescription] = useState('');
  const [tempDescription, setTempDescription] = useState('');
  const MAX_DESCRIPTION_LENGTH = 100;

  // ✅ visible이 true가 될 때마다 모든 state 초기화
  useEffect(() => {
    if (visible) {
      setSelectedTime(null);
      setShowTimePicker(false);
      setPeopleCount(2);
      setSelectedIngredients([]);
      setDescription('');
      setTempDescription('');
    }
  }, [visible]);

  /**
   * 재료 선택 토글
   */
  const toggleIngredient = ingredientId => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredientId)) {
        return prev.filter(id => id !== ingredientId);
      } else {
        return [...prev, ingredientId];
      }
    });
  };

  /**
   * 시간 선택 확인
   */
  const handleTimeConfirm = timeData => {
    setSelectedTime(timeData);
    setShowTimePicker(false);
  };

  /**
   * 만들기 버튼
   */
  const handleCreate = async () => {
    // 유효성 검사
    if (!selectedTime) {
      Alert.alert('알림', '만날 시간을 선택해주세요.');
      return;
    }

    // 🔥 시간 검증: 현재 시간보다 1시간 이후여야 함
    const now = new Date().getTime();
    const meetTime =
      typeof selectedTime?.timestamp === 'number'
        ? selectedTime.timestamp
        : new Date(selectedTime?.timestamp).getTime();

    const oneHourLater = now + 60 * 60 * 1000; // 1시간 = 3600000ms

    if (meetTime < oneHourLater) {
      Alert.alert(
        '알림',
        '만날 시간은 현재 시간으로부터 최소 1시간 이후여야 합니다.',
      );
      return;
    }

    if (selectedIngredients.length === 0) {
      Alert.alert('알림', '구매할 재료를 선택해주세요.');
      return;
    }

    // 백엔드 API 호출 (게시물 생성)
    if (!selectedMarker?.latitude || !selectedMarker?.longitude) {
      Alert.alert('알림', '마트(핀)를 먼저 선택해주세요.');
      return;
    }

    const safeMax = Math.max(2, Number(peopleCount || 0));

    const postData = {
      placeName: selectedMarker?.name || storeName,
      placeAddress:
        selectedMarker?.address || selectedMarker?.roadAddress || '',
      latitude: Number(selectedMarker?.latitude),
      longitude: Number(selectedMarker?.longitude),

      // ✅ 백엔드가 Long(ms)로 받도록: 숫자(ms)로 보냄
      meetDateTime:
        typeof selectedTime?.timestamp === 'number'
          ? selectedTime.timestamp
          : new Date(selectedTime?.timestamp).getTime(),

      minPersonCnt: 2,
      maxPersonCnt: safeMax,

      description: tempDescription.trim(),
      categoryCodes: selectedIngredients,
    };

    console.log('[게시물 생성 요청]', JSON.stringify(postData, null, 2));

    // 백엔드 API 연동
    try {
      const postId = await createPost(postData);
      // axiosConfig가 response.data를 리턴하므로
      // 백엔드가 Long(postId)만 반환하면 postId가 바로 들어옵니다.

      console.log('[게시물 생성 성공] postId=', postId);
      Alert.alert('완료', '게시물이 작성되었습니다.');

      // (선택) 작성 후 목록 갱신 콜백이 있으면 호출
      onCreated?.(postId);

      // (중요) 성공시에만 닫기
      onClose?.();

      // 2단계: 작성 시점에 채팅방 생성 처리(백엔드에서 chatRoomId 반환 시 여기서 이동 가능)
    } catch (error) {
      console.error('[게시물 생성 실패]', error);
      Alert.alert('오류', '게시물 작성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!visible) return null;

  return (
    <Portal>
      <View style={styles.overlay}>
        {/* 반투명 배경 (클릭 시 닫기) */}
        <TouchableOpacity
          style={{flex: 1}}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>게시물 작성</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <X size={24} color={colors.textBlack} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* 내용 */}
          <KeyboardAwareScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={100}
            keyboardShouldPersistTaps="handled">
            {/* 만날 장소 */}
            <View style={styles.locationBox}>
              <Text style={styles.locationLabel}>만날 장소</Text>
              <Text style={styles.locationValue}>{storeName}</Text>
            </View>

            {/* 만날 시간 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>만날 시간</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowTimePicker(true)}>
                <Clock size={20} color={colors.textBlack} strokeWidth={2} />
                <Text style={styles.timeButtonText}>
                  {selectedTime ? selectedTime.text : '시간 선택'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 인원수 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>인원수</Text>
                <Text style={styles.required}>*</Text>
                <Text style={styles.sectionTitle}> : {peopleCount}명</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={2}
                maximumValue={5}
                step={1}
                value={peopleCount}
                onValueChange={setPeopleCount}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.borderGray}
                thumbTintColor={colors.primary}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>2명</Text>
                <Text style={styles.sliderLabel}>5명</Text>
              </View>
            </View>

            {/* 구매할 재료 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>구매할 재료</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <View style={styles.ingredientGrid}>
                {ingredientOptions.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.ingredientButton,
                      selectedIngredients.includes(option.id) &&
                        styles.ingredientButtonSelected,
                    ]}
                    onPress={() => toggleIngredient(option.id)}>
                    <Text
                      style={[
                        styles.ingredientButtonText,
                        selectedIngredients.includes(option.id) &&
                          styles.ingredientButtonTextSelected,
                      ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 설명 (선택) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>설명 (선택)</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder={`예: 급하게 구해야 해서 빨리 가실 분!\n천천히 둘러본후 카페 갈 예정이에요\n초보라 도와주세요`}
                placeholderTextColor={colors.textGray}
                defaultValue={description}
                onEndEditing={e => {
                  const text = e.nativeEvent.text;
                  if (text.length <= MAX_DESCRIPTION_LENGTH) {
                    setDescription(text);
                    setTempDescription(text);
                  }
                }}
                onChange={e => {
                  // 글자 수 카운트만 업데이트
                  setTempDescription(e.nativeEvent.text);
                }}
                multiline
                maxLength={MAX_DESCRIPTION_LENGTH}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {tempDescription.length}/{MAX_DESCRIPTION_LENGTH}
              </Text>
            </View>

            {/* 안내 메시지 */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                게시물 작성 후 채팅방이 자동으로 생성됩니다. 참여자들과 함께
                즐거운 장보기 하세요!
              </Text>
            </View>
          </KeyboardAwareScrollView>

          {/* 하단 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreate}
              activeOpacity={0.8}>
              <Text style={styles.createButtonText}>만들기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 시간 선택 모달 */}
        <TimePickerModal
          visible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          onConfirm={handleTimeConfirm}
        />
      </View>
    </Portal>
  );
}
