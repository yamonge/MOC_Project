import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft, Search, ChevronDown} from 'lucide-react-native';
import styles from '../../styles/screens/admin/ReportManagementStyles';
import {colors} from '../../styles/common';
import {
  getReportList,
  sendWarning,
  suspendUserByReport,
  deleteRecipeByReport,
  processRecipeReport,
} from '../../api/admin';
import SuspendDurationModal from '../../components/admin/SuspendDurationModal';
import ReportDetailModal from '../../components/admin/ReportDetailModal';

/**
 * 신고 관리 화면 (B안)
 * - 서버에서 "전체 목록" 1회 수신(fetchReports)
 * - 검색/필터는 프론트에서만 처리(applyFilters)
 * - 더미데이터 완전 제거
 */
export default function ReportManagementScreen({navigation}) {
  const [allReports, setAllReports] = useState([]); // ✅ 원본 전체
  const [reports, setReports] = useState([]); // ✅ 필터/검색 적용 결과
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportType, setSelectedReportType] = useState(''); // '', 'all', 'post', 'user'
  const [selectedType, setSelectedType] = useState(''); // '', 'all', 'noshow', 'abuse', 'fake'
  const [selectedStatus, setSelectedStatus] = useState(''); // '', 'all', 'pending', 'resolved'

  const [selectedReport, setSelectedReport] = useState(null);
  const [showDurationModal, setShowDurationModal] = useState(false);

  const [detailModal, setDetailModal] = useState({
    visible: false,
    report: null,
  });

  const [showReportTypeDropdown, setShowReportTypeDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // ✅ 화면 focus 시마다 서버에서 전체 목록 조회
  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, []),
  );

  // ✅ 필터 변경 시: 프론트에서만 필터 적용
  useEffect(() => {
    applyFilters();
  }, [selectedReportType, selectedType, selectedStatus]);

  /**
   * 서버에서 전체 목록 조회 (B안)
   * - 필터/검색 없이 전체를 가져온 뒤 allReports에 저장
   * - 현재 필터/검색 기준으로 즉시 reports에도 반영
   */
  const fetchReports = async () => {
    try {
      setLoading(true);

      const response = await getReportList({
        reportType: null,
        type: null,
        status: null,
        search: '',
      });
      const list = response?.reports || [];
      setAllReports(list);

      // 현재 필터/검색을 즉시 반영
      setReports(applyFiltersTo(list));
    } catch (error) {
      console.error('신고 목록 로드 실패:', error);
      setAllReports([]);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 필터/검색 적용(순수 함수)
   * @param {Array} baseList 원본 리스트
   */
  const applyFiltersTo = baseList => {
    let filtered = Array.isArray(baseList) ? baseList : [];

    // 필터 적용
    if (selectedReportType && selectedReportType !== 'all') {
      filtered = filtered.filter(r => r.reportType === selectedReportType);
    }
    if (selectedType && selectedType !== 'all') {
      filtered = filtered.filter(r => r.type === selectedType);
    }
    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(r => r.status === selectedStatus);
    }

    // 검색 적용(신고자/피신고자 닉네임)
    const q = (searchQuery || '').trim();
    if (q) {
      filtered = filtered.filter(r => {
        const reporter = r.reporter || '';
        const reported = r.reported || '';
        return reporter.includes(q) || reported.includes(q);
      });
    }

    return filtered;
  };

  /**
   * 현재 allReports에 대해 필터/검색 적용 후 reports 갱신
   */
  const applyFilters = () => {
    setReports(applyFiltersTo(allReports));
  };

  // 검색(엔터/아이콘) -> 프론트 필터만 적용
  const handleSearch = () => {
    applyFilters();
  };

  // 필터 변경
  const handleReportTypeFilterChange = reportType => {
    setSelectedReportType(reportType);
  };
  const handleTypeFilterChange = type => {
    setSelectedType(type);
  };
  const handleStatusFilterChange = status => {
    setSelectedStatus(status);
  };

  // 신고 상세보기 모달 열기/닫기
  const handleOpenDetailModal = report => {
    setDetailModal({visible: true, report});
  };
  const handleCloseDetailModal = () => {
    setDetailModal({visible: false, report: null});
  };

  // 경고 발송
  const handleSendWarning = async report => {
    Alert.alert(
      '경고 발송',
      `${report.reported} 회원에게 경고를 발송하시겠습니까?`,
      [
        {text: '취소', style: 'cancel'},
        {
          text: '발송',
          onPress: async () => {
            try {
              await sendWarning(report.originalId, {
                userId: report.reportedUserId,
                reason: report.description,
              });

              Alert.alert('완료', '경고가 발송되었습니다.');

              // ✅ 서버 데이터 최신화 (처리완료 상태 반영)
              await fetchReports();
            } catch (error) {
              console.error('경고 발송 실패:', error);
              Alert.alert('오류', '경고 발송에 실패했습니다.');
            }
          },
        },
      ],
    );
  };

  // 계정 정지 (기간 선택 모달 열기)
  const handleSuspendUser = report => {
    setSelectedReport(report);
    setShowDurationModal(true);
  };

  // 기간 선택 후 계정 정지
  const handleSuspendWithDuration = async duration => {
    if (!selectedReport) return;

    const durationText =
      duration === 'permanent' ? '영구 정지' : `${duration}일 정지`;

    Alert.alert(
      '계정 정지',
      `${selectedReport.reported} 회원을 ${durationText}하시겠습니까?`,
      [
        {text: '취소', style: 'cancel'},
        {
          text: '정지',
          style: 'destructive',
          onPress: async () => {
            try {
              await suspendUserByReport(selectedReport.originalId, {
                userId: selectedReport.reportedUserId,
                duration: duration === 'permanent' ? 999999 : duration,
                reason: selectedReport.description,
              });

              Alert.alert('완료', `계정이 ${durationText}되었습니다.`);
              setSelectedReport(null);

              // ✅ 서버 데이터 최신화 (처리완료 상태 반영)
              await fetchReports();
            } catch (error) {
              console.error('계정 정지 실패:', error);
              Alert.alert('오류', '계정 정지에 실패했습니다.');
            }
          },
        },
      ],
    );
  };

  // 게시글 삭제 (레시피 신고)
  const handleDeleteRecipe = report => {
    Alert.alert(
      '게시글 삭제',
      `"${report.reported}" 레시피를 삭제하시겠습니까?`,
      [
        {text: '취소', style: 'cancel'},
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipeByReport(report.recipeId);
              await processRecipeReport(report.originalId);
              Alert.alert('완료', '게시글이 삭제되었습니다.');

              // ✅ 서버 데이터 최신화
              await fetchReports();
            } catch (error) {
              console.error('게시글 삭제 실패:', error);
              Alert.alert('오류', '게시글 삭제에 실패했습니다.');
            }
          },
        },
      ],
    );
  };

  // 신고 유형 한글 변환
  const getTypeLabel = type => {
    switch (type) {
      case 'noshow':
      case 'no_show':
        return '노쇼';
      case 'abuse':
      case 'profanity':
        return '욕설';
      case 'fake':
      case 'fake_profile':
        return '허위';
      case 'fraud':
        return '사기';
      case 'inappropriate_behavior':
        return '부적절한 행동';
      case 'other':
        return '기타';
      default:
        return '기타';
    }
  };

  // 상태 한글 변환
  const getStatusLabel = status => {
    return status === 'pending' ? '미처리' : '처리완료';
  };

  // 출처 한글 변환
  const getSourceLabel = source => {
    return source === 'recipe_board' ? '레시피 게시판' : '같이 장보기';
  };

  // 커스텀 드롭다운 컴포넌트
  const CustomDropdown = ({
    value,
    placeholder,
    options,
    onSelect,
    visible,
    onToggle,
  }) => (
    <View style={styles.dropdownWrapper}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={onToggle}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.dropdownButtonText,
            !value && styles.dropdownPlaceholder,
          ]}>
          {value ? options.find(o => o.value === value)?.label : placeholder}
        </Text>
        <ChevronDown size={16} color="#4a5565" />
      </TouchableOpacity>

      {visible && (
        <View style={styles.dropdownMenu}>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dropdownItem,
                value === option.value && styles.dropdownItemActive,
              ]}
              onPress={() => {
                onSelect(option.value);
                onToggle();
              }}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.dropdownItemText,
                  value === option.value && styles.dropdownItemTextActive,
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  // 드롭다운 옵션 데이터
  const reportTypeOptions = [
    {label: '대상: 전체', value: 'all'},
    {label: '대상: 게시물', value: 'post'},
    {label: '대상: 사용자', value: 'user'},
  ];

  const typeOptions = [
    {label: '유형: 전체', value: 'all'},
    {label: '유형: 노쇼', value: 'noshow'},
    {label: '유형: 욕설', value: 'abuse'},
    {label: '유형: 허위', value: 'fake'},
  ];

  const statusOptions = [
    {label: '상태: 전체', value: 'all'},
    {label: '상태: 미처리', value: 'pending'},
    {label: '상태: 처리완료', value: 'resolved'},
  ];

  // 신고 카드 렌더링
  const ReportCard = ({report}) => {
    const typeColors = {
      noshow: {bg: '#ffedd4', text: '#ca3500'},
      abuse: {bg: '#ffe2e2', text: '#c10007'},
      fake: {bg: '#f3e8ff', text: '#8200db'},
    };

    const statusColors = {
      pending: {bg: '#fef9c2', text: '#a65f00'},
      resolved: {bg: '#dcfce7', text: '#008236'},
    };

    const sourceColors = {
      recipe_board: {bg: '#dbeafe', text: '#1e40af'},
      shopping_together: {bg: '#fce7f3', text: '#9f1239'},
    };

    const typeColor = typeColors[report.type] || typeColors.noshow;
    const statusColor = statusColors[report.status] || statusColors.pending;
    const sourceColor =
      sourceColors[report.source] || sourceColors.recipe_board;

    return (
      <TouchableOpacity
        style={styles.reportCard}
        onPress={() => handleOpenDetailModal(report)}
        activeOpacity={0.7}>
        {/* 상단: 유형, 상태, 출처, 날짜 */}
        <View style={styles.cardHeader}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, {backgroundColor: typeColor.bg}]}>
              <Text style={[styles.badgeText, {color: typeColor.text}]}>
                {getTypeLabel(report.type)}
              </Text>
            </View>
            <View style={[styles.badge, {backgroundColor: statusColor.bg}]}>
              <Text style={[styles.badgeText, {color: statusColor.text}]}>
                {getStatusLabel(report.status)}
              </Text>
            </View>
            <View style={[styles.badge, {backgroundColor: sourceColor.bg}]}>
              <Text style={[styles.badgeText, {color: sourceColor.text}]}>
                {getSourceLabel(report.source)}
              </Text>
            </View>
          </View>
          <Text style={styles.dateText}>{report.date}</Text>
        </View>

        {/* 중간: 신고자 → 피신고자 */}
        <View style={styles.cardContent}>
          <View style={styles.userRow}>
            <Text style={styles.labelText}>신고자:</Text>
            <Text style={styles.reporterText}>{report.reporter}</Text>
            <Text style={styles.arrowText}>→</Text>
            <Text style={styles.labelText}>
              {report.reportType === 'post' ? '레시피:' : '피신고자:'}
            </Text>
            <Text style={styles.reportedText} numberOfLines={1}>
              {report.reported}
            </Text>
          </View>
          <Text style={styles.descriptionText}>{report.description}</Text>
        </View>

        {/* 하단: 액션 버튼 */}
        {report.status === 'pending' && (
          <View style={styles.actionButtons}>
            {report.reportType === 'user' ? (
              // 유저 신고: 경고 발송 + 계정 정지
              <>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleSendWarning(report)}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#FAD15D', '#D09E10']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    angle={104.04}
                    style={styles.gradientButton}>
                    <Text style={styles.actionButtonText}>경고 발송</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleSuspendUser(report)}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#ED6F75', '#F60000']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    angle={166.1}
                    style={styles.gradientButton}>
                    <Text style={styles.actionButtonText}>계정 정지</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              // 레시피 신고: 게시글 삭제
              <TouchableOpacity
                style={[styles.actionButton, {flex: 1}]}
                onPress={() => handleDeleteRecipe(report)}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={['#ED6F75', '#F60000']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  angle={166.1}
                  style={styles.gradientButton}>
                  <Text style={styles.actionButtonText}>게시글 삭제</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        )}
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
        <Text style={styles.headerTitle}>신고 관리</Text>
      </View>

      {/* 검색 및 필터 영역 */}
      <View style={styles.searchSection}>
        {/* 검색 바 */}
        <View style={styles.searchBar}>
          <Search size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="신고자 또는 피신고자 검색"
            placeholderTextColor="rgba(10, 10, 10, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>

        {/* 필터 드롭다운 */}
        <View style={styles.filterDropdownRow}>
          <CustomDropdown
            value={selectedReportType}
            placeholder="대상"
            options={reportTypeOptions}
            onSelect={handleReportTypeFilterChange}
            visible={showReportTypeDropdown}
            onToggle={() => {
              setShowReportTypeDropdown(!showReportTypeDropdown);
              setShowTypeDropdown(false);
              setShowStatusDropdown(false);
            }}
          />

          <CustomDropdown
            value={selectedType}
            placeholder="유형"
            options={typeOptions}
            onSelect={handleTypeFilterChange}
            visible={showTypeDropdown}
            onToggle={() => {
              setShowTypeDropdown(!showTypeDropdown);
              setShowReportTypeDropdown(false);
              setShowStatusDropdown(false);
            }}
          />

          <CustomDropdown
            value={selectedStatus}
            placeholder="상태"
            options={statusOptions}
            onSelect={handleStatusFilterChange}
            visible={showStatusDropdown}
            onToggle={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowReportTypeDropdown(false);
              setShowTypeDropdown(false);
            }}
          />
        </View>
      </View>

      {/* 신고 리스트 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : reports.length > 0 ? (
          reports.map(report => <ReportCard key={report.id} report={report} />)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>신고 내역이 없습니다.</Text>
          </View>
        )}
      </ScrollView>

      {/* 정지 기간 선택 모달 */}
      <SuspendDurationModal
        visible={showDurationModal}
        userName={selectedReport?.reported}
        onClose={() => {
          setShowDurationModal(false);
          setSelectedReport(null);
        }}
        onSelect={handleSuspendWithDuration}
      />

      {/* 신고 상세보기 모달 */}
      <ReportDetailModal
        visible={detailModal.visible}
        report={detailModal.report}
        onClose={handleCloseDetailModal}
        getTypeLabel={getTypeLabel}
        getStatusLabel={getStatusLabel}
        getSourceLabel={getSourceLabel}
      />
    </View>
  );
}
