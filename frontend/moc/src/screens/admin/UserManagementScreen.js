import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {ArrowLeft, Search, CheckSquare, Square} from 'lucide-react-native';
import styles from '../../styles/screens/admin/UserManagementStyles';
import {colors} from '../../styles/common';
import {getUserList} from '../../api/admin';
import UserManagementModal from '../../components/admin/UserManagementModal';

/**
 * 회원 관리 화면
 *
 * ✅ 변경 최소화 핵심
 * - dummyUsers 삭제
 * - 서버에서 받아온 원본 목록을 allUsers에 저장
 * - 기존 주석(필터/검색) 로직 그대로 사용
 */
export default function UserManagementScreen({navigation}) {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // 서버 원본(매핑 후) 보관
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'active', 'suspended'
  const [selectedUsers, setSelectedUsers] = useState([]); // 선택된 회원 ID 배열
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 회원 (모달용)
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * ✅ 서버 status 매핑 함수
   * - ACTIVE -> active
   * - SUSPENDED -> suspended
   * - 이미 active/suspended면 그대로
   */
  const normalizeStatus = status => {
    if (!status) return 'active';
    const s = String(status).toUpperCase();
    if (s === 'ACTIVE') return 'active';
    if (s === 'SUSPENDED') return 'suspended';
    // 이미 프론트 형태로 내려오는 경우
    if (String(status).toLowerCase() === 'active') return 'active';
    if (String(status).toLowerCase() === 'suspended') return 'suspended';
    return 'active';
  };

  // ✅ 최초 1회 서버에서 원본 목록을 받아온다.
  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ 필터/검색/allUsers 변경 시 즉시 로컬 필터링 적용
  useEffect(() => {
    applyFilterAndSearch();
  }, [selectedFilter, searchQuery, allUsers]);

  // ✅ 서버에서 원본 목록 로드(여기서 status 매핑)
  const loadUsers = async () => {
    try {
      setLoading(true);

      // 전체 원본만 받기(필터/검색은 프론트에서)
      const response = await getUserList({status: null, search: ''});
      const serverUsers = response.users || [];

      // ✅ 여기서 한 번만 status 매핑해서 allUsers에 저장
      const mappedUsers = serverUsers.map(u => ({
        ...u,
        status: normalizeStatus(u.status),
      }));

      setAllUsers(mappedUsers);
    } catch (err) {
      console.error('회원 목록 로드 실패:', err);
      setAllUsers([]);
      setUsers([]);
      setSelectedUsers([]);
      setSelectAll(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * allUsers에 그대로 적용
   */
  const applyFilterAndSearch = () => {
    // 필터 적용
    let filteredUsers = allUsers;
    if (selectedFilter !== 'all') {
      filteredUsers = allUsers.filter(user => user.status === selectedFilter);
    }

    // 검색 적용
    if (searchQuery.trim()) {
      filteredUsers = filteredUsers.filter(
        user =>
          (user.name || '').includes(searchQuery) ||
          (user.nickname || '').includes(searchQuery) ||
          (user.email || '').includes(searchQuery),
      );
    }

    setUsers(filteredUsers);

    // 목록이 바뀌면 선택 상태 초기화
    setSelectedUsers([]);
    setSelectAll(false);
  };

  // 엔터(선택 사항) - 로컬 필터 한 번 더
  const handleSearch = () => {
    applyFilterAndSearch();
  };

  // 필터 변경
  const handleFilterChange = filter => {
    setSelectedFilter(filter);
    setSelectedUsers([]);
    setSelectAll(false);
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
    setSelectAll(!selectAll);
  };

  // 개별 선택/해제
  const handleSelectUser = userId => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedUsers, userId];
      setSelectedUsers(newSelected);
      if (newSelected.length === users.length) {
        setSelectAll(true);
      }
    }
  };

  // 회원 카드 클릭 (모달 열기)
  const handleUserPress = user => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  // 회원 정보 업데이트 후 → 서버 원본 재로딩
  const handleUpdateUser = () => {
    loadUsers();
  };

  // 필터 버튼 렌더링
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

  // 상태 배지 렌더링
  const StatusBadge = ({status}) => {
    const isActive = status === 'active';
    return (
      <View
        style={[
          styles.statusBadge,
          isActive ? styles.statusBadgeActive : styles.statusBadgeSuspended,
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
    );
  };

  // 회원 카드 렌더링 (원본 유지)
  const UserCard = ({user}) => {
    const isSelected = selectedUsers.includes(user.id);
    const CheckIcon = isSelected ? CheckSquare : Square;

    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => handleUserPress(user)}
        activeOpacity={0.7}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={e => {
            e.stopPropagation();
            handleSelectUser(user.id);
          }}
          activeOpacity={0.7}>
          <CheckIcon
            size={16}
            color={isSelected ? colors.primary : '#9ca3af'}
          />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userNickname}>@{user.nickname}</Text>
          </View>
          <View style={styles.userMetaRow}>
            <Text style={styles.userJoinDate}>가입일: {user.joinDate}</Text>
            {user.reportCount > 0 && (
              <Text style={styles.userReportCount}>
                신고 {user.reportCount}회
              </Text>
            )}
          </View>
        </View>

        <StatusBadge status={user.status} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('AdminSettings')}>
          <ArrowLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원 관리</Text>
      </View>

      {/* 검색 및 필터 영역 */}
      <View style={styles.searchSection}>
        {/* 검색 바 */}
        <View style={styles.searchBar}>
          <Search size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="이메일 또는 닉네임 검색"
            placeholderTextColor="rgba(10, 10, 10, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery} // 입력 즉시 로컬 필터링
            onSubmitEditing={handleSearch} // (유지)
            returnKeyType="search"
          />
        </View>

        {/* 필터 버튼 */}
        <View style={styles.filterRow}>
          <FilterButton label="전체" value="all" />
          <FilterButton label="활동중" value="active" />
          <FilterButton label="정지" value="suspended" />
        </View>
      </View>

      {/* 회원 목록 */}
      <View style={styles.listContainer}>
        {/* 전체 선택 헤더 */}
        <View style={styles.selectAllHeader}>
          <TouchableOpacity
            style={styles.selectAllButton}
            onPress={handleSelectAll}
            activeOpacity={0.7}>
            {selectAll ? (
              <CheckSquare size={16} color={colors.primary} />
            ) : (
              <Square size={16} color="#9ca3af" />
            )}
            <Text style={styles.selectAllText}>전체 선택</Text>
          </TouchableOpacity>
        </View>

        {/* 회원 리스트 */}
        <ScrollView
          style={styles.userList}
          contentContainerStyle={styles.userListContent}
          showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : users.length > 0 ? (
            users.map(user => <UserCard key={user.id} user={user} />)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>회원이 없습니다.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* 회원 관리 모달 */}
      <UserManagementModal
        visible={modalVisible}
        user={selectedUser}
        onClose={handleCloseModal}
        onUpdate={handleUpdateUser}
      />
    </View>
  );
}
