import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import {ChevronLeft, ChevronRight} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from '../../styles/screens/camera/recipeFilterStyles';

export default function RecipeFilterScreen({route, navigation}) {
  const {ingredients = [], from = 'camera'} = route.params || {};

  // 필터 상태
  const [selectedStyle, setSelectedStyle] = useState('한식');
  const [selectedDifficulty, setSelectedDifficulty] = useState('쉬움');
  const [selectedTime, setSelectedTime] = useState('10분');

  // 요리 스타일 선택 (단일 선택)
  const selectStyle = style => {
    setSelectedStyle(style);
  };

  // 난이도 선택 (단일 선택)
  const selectDifficulty = difficulty => {
    setSelectedDifficulty(difficulty);
  };

  // 조리 시간 선택 (단일 선택)
  const selectTime = time => {
    setSelectedTime(time);
  };

  // 다음 버튼
  const handleNext = () => {
    const filters = {
      style: selectedStyle,
      difficulty: selectedDifficulty,
      time: selectedTime,
    };
    console.log('선택된 필터:', filters);
    console.log('재료 목록:', ingredients);
    // 재료 선택 화면으로 이동 (from 전달)
    navigation.navigate('IngredientSelection', {ingredients, filters, from});
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 상단 헤더 */}
      <LinearGradient
        colors={['#00B8DB', '#155DFC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>레시피 필터</Text>
        </View>
      </LinearGradient>

      {/* 콘텐츠 영역 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 요리 스타일 */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>요리 스타일</Text>
          <View style={styles.filterButtonsRow}>
            {['한식', '중식', '양식', '일식', '퓨전'].map(style =>
              selectedStyle === style ? (
                <LinearGradient
                  key={style}
                  colors={['#00D084', '#00B86D']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={[styles.filterButton, styles.filterButtonSelected]}>
                  <TouchableOpacity
                    onPress={() => selectStyle(style)}
                    activeOpacity={0.7}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        styles.filterButtonText,
                        styles.filterButtonTextSelected,
                      ]}>
                      {style}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              ) : (
                <TouchableOpacity
                  key={style}
                  onPress={() => selectStyle(style)}
                  activeOpacity={0.7}
                  style={styles.filterButton}>
                  <Text style={styles.filterButtonText}>{style}</Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        {/* 난이도 */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>난이도</Text>
          <View style={styles.filterButtonsRow}>
            {['쉬움', '보통', '어려움'].map(difficulty =>
              selectedDifficulty === difficulty ? (
                <LinearGradient
                  key={difficulty}
                  colors={['#00D084', '#00B86D']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={[
                    styles.filterButton,
                    styles.filterButtonSelected,
                    {flex: 1},
                  ]}>
                  <TouchableOpacity
                    onPress={() => selectDifficulty(difficulty)}
                    activeOpacity={0.7}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        styles.filterButtonText,
                        styles.filterButtonTextSelected,
                      ]}>
                      {difficulty}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              ) : (
                <TouchableOpacity
                  key={difficulty}
                  onPress={() => selectDifficulty(difficulty)}
                  activeOpacity={0.7}
                  style={[styles.filterButton, {flex: 1}]}>
                  <Text style={styles.filterButtonText}>{difficulty}</Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        {/* 조리 시간 */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>조리 시간</Text>
          <View style={styles.filterButtonsRow}>
            {['10분', '30분'].map(time =>
              selectedTime === time ? (
                <LinearGradient
                  key={time}
                  colors={['#00D084', '#00B86D']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={[
                    styles.filterButton,
                    styles.filterButtonSelected,
                    {flex: 1},
                  ]}>
                  <TouchableOpacity
                    onPress={() => selectTime(time)}
                    activeOpacity={0.7}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        styles.filterButtonText,
                        styles.filterButtonTextSelected,
                      ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              ) : (
                <TouchableOpacity
                  key={time}
                  onPress={() => selectTime(time)}
                  activeOpacity={0.7}
                  style={[styles.filterButton, {flex: 1}]}>
                  <Text style={styles.filterButtonText}>{time}</Text>
                </TouchableOpacity>
              ),
            )}
          </View>
          <View style={[styles.filterButtonsRow, {marginTop: 8}]}>
            {['1시간', '2시간+'].map(time =>
              selectedTime === time ? (
                <LinearGradient
                  key={time}
                  colors={['#00D084', '#00B86D']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={[
                    styles.filterButton,
                    styles.filterButtonSelected,
                    {flex: 1},
                  ]}>
                  <TouchableOpacity
                    onPress={() => selectTime(time)}
                    activeOpacity={0.7}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        styles.filterButtonText,
                        styles.filterButtonTextSelected,
                      ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              ) : (
                <TouchableOpacity
                  key={time}
                  onPress={() => selectTime(time)}
                  activeOpacity={0.7}
                  style={[styles.filterButton, {flex: 1}]}>
                  <Text style={styles.filterButtonText}>{time}</Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>
      </ScrollView>

      {/* 하단 다음 버튼 */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.7}
          style={{width: '100%'}}>
          <LinearGradient
            colors={['#00B8DB', '#155DFC']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.nextButton}>
            <Text style={styles.nextButtonText}>다음</Text>
            <ChevronRight color="#FFFFFF" size={20} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
