import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {X, Image as ImageIcon, Edit3, ChevronRight} from 'lucide-react-native';
import AnimatedBackground from '../../components/common/AnimatedBackground';
import PermissionModal from '../../components/common/PermissionModal';
import styles from '../../styles/screens/receipt/ReceiptSelectionScreenStyles';

const ReceiptSelectionScreen = ({navigation}) => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const handlePhotoUpload = async () => {
    if (Platform.OS === 'android') {
      const androidVersion = Platform.Version;
      const permission =
        androidVersion >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      // 권한 요청 (시스템 권한 창 표시)
      const granted = await PermissionsAndroid.request(permission);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // 권한 허용 → 갤러리로 이동
        navigation.navigate('Gallery');
      } else {
        // 권한 거부 → 모달 표시
        setShowPermissionModal(true);
      }
    } else {
      // iOS는 바로 이동
      navigation.navigate('Gallery');
    }
  };

  const handleDirectInput = () => {
    // 마이페이지 > 재료 관리 화면으로 이동
    console.log('직접 입력 - 재료 관리로 이동');
    navigation.navigate('IngredientManagement');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 배경 */}
      <AnimatedBackground />

      {/* 컨텐츠 */}
      <View style={styles.content}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <X color="white" size={24} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.title}>영수증 등록</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 선택 카드들 */}
        <View style={styles.cardsContainer}>
          {/* 사진 업로드 */}
          <TouchableOpacity
            style={styles.cardLarge}
            onPress={handlePhotoUpload}
            activeOpacity={0.8}>
            <View style={[styles.iconContainer, styles.iconPink]}>
              <ImageIcon color="white" size={30} strokeWidth={2} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>사진 업로드</Text>
              <Text style={styles.cardDescription}>
                갤러리에서 영수증 사진을 선택해요
              </Text>
            </View>
            <ChevronRight color="#9CA3AF" size={24} strokeWidth={2} />
          </TouchableOpacity>

          {/* 직접 입력 */}
          <TouchableOpacity
            style={styles.card}
            onPress={handleDirectInput}
            activeOpacity={0.8}>
            <View style={[styles.iconContainer, styles.iconBlue]}>
              <Edit3 color="white" size={30} strokeWidth={2} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>직접 입력</Text>
              <Text style={styles.cardDescription}>
                내 재료 관리로 이동해요
              </Text>
            </View>
            <ChevronRight color="#9CA3AF" size={24} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 갤러리 권한 모달 */}
      <PermissionModal
        visible={showPermissionModal}
        title="갤러리 권한 필요"
        message={
          '영수증 사진 선택을 위해 갤러리 접근 권한이 필요합니다.\n설정에서 권한을 허용해주세요.'
        }
        onCancel={() => setShowPermissionModal(false)}
        onConfirm={() => setShowPermissionModal(false)}
      />
    </View>
  );
};

export default ReceiptSelectionScreen;
