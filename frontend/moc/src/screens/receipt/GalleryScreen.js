import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {X, Image as ImageIcon} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';
import styles from '../../styles/screens/receipt/GalleryScreenStyles';
import {recognizeIngredients} from '../../api/camera';

const GalleryScreen = ({navigation, route}) => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const from = route.params?.from; // 'receipt' 또는 'profile'

  // ✅ 화면 진입 시마다 선택 초기화 및 사진 목록 새로 로드
  useFocusEffect(
    React.useCallback(() => {
      setSelectedPhoto(null); // 선택 초기화
      setPhotos([]); // 사진 목록 초기화
      setEndCursor(null); // 커서 초기화
      loadPhotos(); // 사진 다시 로드
    }, []),
  );

  // 사진 불러오기
  const loadPhotos = async () => {
    try {
      setIsLoading(true);

      const result = await CameraRoll.getPhotos({
        first: 20,
        assetType: 'Photos',
        after: endCursor,
      });

      const newPhotos = result.edges.map(edge => ({
        uri: edge.node.image.uri,
        id: edge.node.id || edge.node.image.uri,
      }));

      setPhotos(prev => [...prev, ...newPhotos]);
      setHasNextPage(result.page_info.has_next_page);
      setEndCursor(result.page_info.end_cursor);
    } catch (error) {
      console.error('📷 갤러리 사진 로드 실패:', error);
      Alert.alert('오류', '사진을 불러오는 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 사진 선택
  const handleSelectPhoto = photo => {
    console.log('GalleryScreen -> photo selected:', photo);
    setSelectedPhoto(photo);
  };

  // X 버튼 (뒤로가기) 처리
  const handleGoBack = () => {
    // from에 따라 분기 처리
    if (from === 'profile') {
      navigation.navigate('ProfileEdit');
    } else if (from === 'notice') {
      navigation.navigate('NoticeForm', {
        mode: route.params?.mode || 'create',
        noticeId: route.params?.noticeId,
        currentTitle: route.params?.currentTitle,
        currentContent: route.params?.currentContent,
        currentImage: route.params?.currentImage,
      });
    } else {
      // 영수증 선택 화면으로 복귀
      navigation.navigate('Receipt');
    }
  };

  // 선택한 사진 업로드
  const handleUpload = async () => {
    if (!selectedPhoto) {
      Alert.alert('안내', '사진을 선택해주세요.');
      return;
    }

    console.log(
      'GalleryScreen -> uploading selectedPhoto.uri:',
      selectedPhoto.uri,
    );

    // from에 따라 분기 처리
    if (from === 'profile') {
      // 프로필 수정 화면으로 돌아가면서 이미지 전달
      // AsyncStorage에 임시 저장 후 내비게이트하여 timing/race condition 방지
      try {
        await AsyncStorage.setItem('tempSelectedImage', selectedPhoto.uri);
      } catch (e) {
        console.warn('Failed to cache selected image:', e);
      }
      navigation.navigate('ProfileEdit', {
        selectedImage: selectedPhoto.uri,
      });
    } else if (from === 'notice') {
      // 공지사항 작성/수정 화면으로 돌아가면서 이미지 전달
      navigation.navigate('NoticeForm', {
        mode: route.params?.mode || 'create',
        noticeId: route.params?.noticeId,
        selectedImage: selectedPhoto.uri,
        currentTitle: route.params?.currentTitle,
        currentContent: route.params?.currentContent,
        currentImage: route.params?.currentImage,
      });
    } else {
      // ✅ 영수증 재료 인식 처리
      try {
        setIsRecognizing(true);

        // 1️⃣ OCR API 호출
        console.log('📤 OCR 인식 시작:', selectedPhoto.uri);
        // ✅ URI를 그대로 전달 (처리는 API 내부에서)
        const ocrResult = await recognizeIngredients(selectedPhoto.uri);

        if (!ocrResult?.ingredients || ocrResult.ingredients.length === 0) {
          Alert.alert(
            '안내',
            '인식된 재료가 없습니다.\n다른 사진을 선택해주세요.',
          );
          return;
        }

        // 2️⃣ 재료 데이터 변환
        const ingredients = ocrResult.ingredients.map(name => ({
          id: Date.now() + Math.random(),
          name,
        }));

        console.log('✅ OCR 인식 완료:', ingredients);

        // 3️⃣ 재료 인식 결과 화면으로 이동
        navigation.navigate('IngredientResult', {
          photoPath: selectedPhoto.uri,
          recognizedIngredients: ingredients,
          from: 'gallery',
        });
      } catch (error) {
        console.error('❌ OCR 인식 오류:', error);
        Alert.alert(
          '오류',
          '재료 인식 중 문제가 발생했습니다.\n다시 시도해주세요.',
        );
      } finally {
        setIsRecognizing(false);
      }
    }
  };

  // 그리드 아이템 렌더링
  const renderPhotoItem = ({item}) => {
    const isSelected = selectedPhoto?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.photoItem, isSelected && styles.photoItemSelected]}
        onPress={() => handleSelectPhoto(item)}
        activeOpacity={0.8}>
        <Image source={{uri: item.uri}} style={styles.photoImage} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <X color="white" size={24} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>갤러리</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* 사진 그리드 */}
      {isLoading && photos.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00B8DB" />
          <Text style={styles.loadingText}>사진을 불러오는 중...</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhotoItem}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.gridRow}
          onEndReached={() => {
            if (hasNextPage && !isLoading) {
              loadPhotos();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading && photos.length > 0 ? (
              <ActivityIndicator size="small" color="#00B8DB" />
            ) : null
          }
        />
      )}

      {/* ✅ 재료 인식 로딩 오버레이 */}
      {isRecognizing && (
        <View style={styles.recognizingOverlay}>
          <ActivityIndicator size="large" color="#00B8DB" />
          <Text style={styles.recognizingText}>재료 인식 중...</Text>
          <Text style={styles.recognizingSubText}>잠시만 기다려주세요</Text>
        </View>
      )}

      {/* 하단 업로드 버튼 */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          onPress={handleUpload}
          activeOpacity={0.8}
          disabled={!selectedPhoto || isRecognizing}
          style={{width: '100%'}}>
          <LinearGradient
            colors={
              selectedPhoto && !isRecognizing
                ? ['#00B8DB', '#155DFC']
                : ['#9CA3AF', '#6B7280']
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>
              {from === 'profile' ? '선택 완료' : '선택한 사진 업로드'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GalleryScreen;
