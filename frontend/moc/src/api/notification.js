import api from './axiosConfig';
import {format} from 'date-fns';
import {normalizeImageUrl} from '../utils/imageUrlHelper';

const toDateText = ts => {
  if (!ts) return '';
  const d = new Date(ts);
  return isNaN(d.getTime()) ? '' : format(d, 'yyyy.MM.dd');
};

/**
 * 공지사항 관련 API
 */

const mapListItem = dto => ({
  id: dto.noticeId,
  title: dto.title,
  imageUrl: normalizeImageUrl(dto.imageUrl), // 이미지 URL 변환 추가
  isPinned: !!dto.pinned,
  createdAt: toDateText(dto.createdDate),
});

const mapDetail = dto => ({
  id: dto.noticeId,
  title: dto.title,
  content: dto.content,
  imageUrl: normalizeImageUrl(dto.imageUrl), // 이미지 URL 변환 추가
  isPinned: !!dto.pinned,
  createdAt: toDateText(dto.createdDate),
});


  /**
   * 공지사항 목록 조회
   * 백엔드: GET /api/notifications
   */
  export const notificationAPI = {
  async getNotifications(params = {}) {
    const list = await api.get('/notifications', {params}); // ✅ 여기서 list는 이미 data
    return Array.isArray(list) ? list.map(mapListItem) : [];
  },

  /**
   * 공지사항 상세 조회
   * 백엔드: GET /api/notifications/:id
   */
  async getNotificationDetail(noticeId) {
    const dto = await api.get(`/notifications/${noticeId}`); // ✅ dto는 이미 data
    return mapDetail(dto);
  },
};
