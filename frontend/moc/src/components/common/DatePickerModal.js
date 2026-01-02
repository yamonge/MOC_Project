import React, {useState, useEffect} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from 'react-native-wheel-pick';
import {X} from 'lucide-react-native';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../styles/common';

/**
 * 생년월일 선택 모달 (Bottom Sheet)
 *
 * @param {boolean} visible - 모달 표시 여부
 * @param {function} onClose - 닫기 버튼 클릭 시 호출되는 함수
 * @param {function} onConfirm - 완료 버튼 클릭 시 호출되는 함수 (선택된 날짜 전달)
 * @param {Date} initialDate - 초기 날짜 (선택사항)
 */
export default function DatePickerModal({
  visible,
  onClose,
  onConfirm,
  initialDate,
}) {
  // 현재 날짜 또는 초기 날짜
  const now = initialDate || new Date();

  // 년도 목록 생성 (1926년 ~ 현재년도)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1926; year <= currentYear; year++) {
      years.push(year.toString());
    }
    return years.reverse(); // 최신년도가 위로
  };

  const yearOptions = generateYears();
  const monthOptions = Array.from({length: 12}, (_, i) => (i + 1).toString());

  // 일 목록 (선택된 년/월에 따라 동적 생성)
  const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({length: daysInMonth}, (_, i) => (i + 1).toString());
  };

  // 선택된 년/월/일 값
  const [selectedYear, setSelectedYear] = useState(
    now.getFullYear().toString(),
  );
  const [selectedMonth, setSelectedMonth] = useState(
    (now.getMonth() + 1).toString(),
  );
  const [selectedDay, setSelectedDay] = useState(now.getDate().toString());

  const dayOptions = getDaysInMonth(
    parseInt(selectedYear),
    parseInt(selectedMonth),
  );

  // 완료 버튼 클릭
  const handleConfirm = () => {
    const selectedDate = new Date(
      parseInt(selectedYear),
      parseInt(selectedMonth) - 1,
      parseInt(selectedDay),
    );
    onConfirm(selectedDate);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      {/* 배경 오버레이 */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        {/* Bottom Sheet */}
        <TouchableOpacity
          style={styles.bottomSheet}
          activeOpacity={1}
          onPress={e => e.stopPropagation()} // 클릭 이벤트 전파 방지
        >
          {/* 헤더 */}
          <View style={styles.header}>
            {/* 닫기 버튼 */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textDark} />
            </TouchableOpacity>

            {/* 타이틀 */}
            <Text style={styles.title}>생년월일 선택</Text>

            {/* 완료 버튼 */}
            <TouchableOpacity
              onPress={handleConfirm}
              style={styles.confirmButton}>
              <Text style={styles.confirmText}>완료</Text>
            </TouchableOpacity>
          </View>

          {/* 휠 피커 영역 */}
          <View style={styles.pickerContainer}>
            {/* 년도 */}
            <View style={styles.pickerColumn}>
              <Picker
                style={styles.picker}
                selectedValue={`${selectedYear}년`}
                pickerData={yearOptions.map(y => `${y}년`)}
                onValueChange={value => {
                  const year = value.replace('년', '');
                  setSelectedYear(year);
                }}
                textColor={colors.textDark}
                textSize={18}
                selectTextColor={colors.primary}
                isShowSelectLine={true}
                selectLineColor={colors.primary}
                selectLineSize={2}
                isShowSelectBackground={true}
                selectBackgroundColor="rgba(59, 130, 246, 0.1)"
              />
            </View>

            {/* 월 */}
            <View style={styles.pickerColumn}>
              <Picker
                style={styles.picker}
                selectedValue={`${selectedMonth}월`}
                pickerData={monthOptions.map(m => `${m}월`)}
                onValueChange={value => {
                  const month = value.replace('월', '');
                  setSelectedMonth(month);
                }}
                textColor={colors.textDark}
                textSize={18}
                selectTextColor={colors.primary}
                isShowSelectLine={true}
                selectLineColor={colors.primary}
                selectLineSize={2}
                isShowSelectBackground={true}
                selectBackgroundColor="rgba(59, 130, 246, 0.1)"
              />
            </View>

            {/* 일 */}
            <View style={styles.pickerColumn}>
              <Picker
                style={styles.picker}
                selectedValue={`${selectedDay}일`}
                pickerData={dayOptions.map(d => `${d}일`)}
                onValueChange={value => {
                  const day = value.replace('일', '');
                  setSelectedDay(day);
                }}
                textColor={colors.textDark}
                textSize={18}
                selectTextColor={colors.primary}
                isShowSelectLine={true}
                selectLineColor={colors.primary}
                selectLineSize={2}
                isShowSelectBackground={true}
                selectBackgroundColor="rgba(59, 130, 246, 0.1)"
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.blackOverlay,
    justifyContent: 'flex-end',
  },

  bottomSheet: {
    backgroundColor: colors.bgWhite,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    paddingBottom: spacing.xl,
    ...shadows.cardLarge,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },

  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    ...typography.subtitle,
    color: colors.textDark,
  },

  confirmButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmText: {
    ...typography.button,
    color: colors.primary,
  },

  pickerContainer: {
    flexDirection: 'row',
    height: 200,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },

  pickerColumn: {
    flex: 1,
  },

  picker: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 200,
  },
});
