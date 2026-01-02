import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft, Search, EyeOff, Eye, Trash2} from 'lucide-react-native';
import styles from '../../styles/screens/admin/PostManagementStyles';
import {colors} from '../../styles/common';
import {getPostList, deletePost, togglePostVisibility} from '../../api/admin';
import IngredientModal from '../../components/common/IngredientModal';

export default function PostManagementScreen({navigation}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'public', 'hidden'
  const [deleteModal, setDeleteModal] = useState({visible: false, post: null});

  // 게시글 목록 로드 (API 기반)
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);

      const trimmedSearch = searchQuery.trim();

      const params = {
        status: selectedFilter === 'all' ? null : selectedFilter,
        search: trimmedSearch.length > 0 ? trimmedSearch : null,
      };

      const response = await getPostList(params);
      setPosts(response?.posts || []);
    } catch (error) {
      console.error('게시글 목록 로드 실패:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFilter, searchQuery]);

  /**
   * ✅ 실시간 검색 + 필터 적용
   * - searchQuery 변경 시마다 바로 호출하면 API 과다 호출 → debounce(300ms)
   * - selectedFilter 변경도 동일 로직에서 처리
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPosts();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadPosts]);

  // 검색 버튼/엔터: 즉시 실행(대기 없이)
  const handleSearch = () => {
    loadPosts();
  };

  const handleFilterChange = filter => {
    setSelectedFilter(filter);
  };

  const handleToggleVisibility = async post => {
    try {
      await togglePostVisibility(post.id, !post.isHidden);
      loadPosts();
    } catch (error) {
      console.error('게시글 숨김/공개 실패:', error);
    }
  };

  const handleOpenDeleteModal = post => {
    setDeleteModal({visible: true, post});
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({visible: false, post: null});
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.post) return;

    try {
      await deletePost(deleteModal.post.id);
      handleCloseDeleteModal();
      loadPosts();
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
    }
  };

  const FilterButton = ({label, value}) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === value && styles.filterButtonActive,
      ]}
      onPress={() => handleFilterChange(value)}
      activeOpacity={0.7}>
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === value && styles.filterButtonTextActive,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const PostCard = ({post}) => {
    return (
      <View style={styles.postCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <View
            style={[
              styles.statusBadge,
              post.isHidden
                ? styles.statusBadgeHidden
                : styles.statusBadgePublic,
            ]}>
            <Text
              style={[
                styles.statusBadgeText,
                post.isHidden
                  ? styles.statusBadgeTextHidden
                  : styles.statusBadgeTextPublic,
              ]}>
              {post.isHidden ? '숨김' : '공개'}
            </Text>
          </View>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.ownerText}>소유자: {post.owner}</Text>
          <Text style={styles.dateText}>{post.date}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleToggleVisibility(post)}
            activeOpacity={0.8}>
            <LinearGradient
              colors={
                post.isHidden ? ['#00c950', '#008736'] : ['#6a7282', '#17191c']
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientButton}>
              {post.isHidden ? (
                <Eye size={16} color={colors.white} />
              ) : (
                <EyeOff size={16} color={colors.white} />
              )}
              <Text style={styles.actionButtonText}>
                {post.isHidden ? '공개' : '숨김'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleOpenDeleteModal(post)}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#ED6F75', '#F60000']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              angle={166.1}
              style={styles.gradientButton}>
              <Trash2 size={16} color={colors.white} />
              <Text style={styles.actionButtonText}>삭제</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('AdminSettings')}>
          <ArrowLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시글 관리</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="제목, 작성자, 게시글 ID 검색"
            placeholderTextColor="rgba(10, 10, 10, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery} // ✅ 입력 즉시 state 갱신 → debounce effect로 자동 검색
            onSubmitEditing={handleSearch} // ✅ 엔터 누르면 즉시 검색(대기 없음)
            returnKeyType="search"
          />
        </View>

        <View style={styles.filterRow}>
          <FilterButton label="전체" value="all" />
          <FilterButton label="공개" value="public" />
          <FilterButton label="숨김" value="hidden" />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>게시글이 없습니다.</Text>
          </View>
        )}
      </ScrollView>

      <IngredientModal
        visible={deleteModal.visible}
        type="delete"
        title="게시글 삭제"
        message={`"${
          deleteModal.post?.title || ''
        }" 게시글을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}
