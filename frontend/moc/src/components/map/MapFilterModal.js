import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Pressable, Platform} from 'react-native';
import {X} from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import {Portal} from '@gorhom/portal';
import styles from '../../styles/components/map/MapFilterModalStyles';
import {colors} from '../../styles/common';

/**
 * 지도 필터 모달
 * - 거리 슬라이더 (1km ~ 10km)
 * - 적용하기 버튼
 */
export default function MapFilterModal({visible, onClose, onApply}) {
  // 거리 (1km ~ 10km)
  const [distance, setDistance] = useState(3);

  // 적용하기
  const handleApply = () => {
    onApply({
      distance: distance,
    });
    onClose();
  };

  if (!visible) return null;

  return (
    <Portal>
      {/* 배경 오버레이 */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* 모달 콘텐츠 */}
        <Pressable
          style={styles.modalContainer}
          onPress={e => e.stopPropagation()}>
          {/* 상단 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>필터</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              style={styles.closeButton}>
              <X size={20} color={colors.textBlack} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* 거리 섹션 */}
          <View style={styles.section}>
            <View style={styles.distanceHeader}>
              <Text style={styles.sectionLabel}>거리</Text>
              <Text style={styles.distanceValue}>{distance}km</Text>
            </View>

            {/* 슬라이더 */}
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={distance}
              onValueChange={setDistance}
              minimumTrackTintColor={colors.mapIconBlue}
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={colors.mapIconBlue}
            />

            {/* 거리 범위 표시 */}
            <View style={styles.distanceRange}>
              <Text style={styles.distanceRangeText}>1km</Text>
              <Text style={styles.distanceRangeText}>10km</Text>
            </View>
          </View>

          {/* 적용하기 버튼 */}
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.8}>
            <Text style={styles.applyButtonText}>적용하기</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Portal>
  );
}
