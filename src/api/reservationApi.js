import axios from '../utils/axios';

/**
 * 예약 관리 관련 API 호출 함수들
 */
export const reservationApi = {
  /**
   * 예약 목록 조회
   * @param {Object} params - 검색 매개변수 (페이지네이션, 필터링, 정렬 등)
   * @returns {Promise} - API 응답
   */
  getReservations: (params) => {
    return axios.get('/api/reservations', { params });
  },

  /**
   * 예약 상세 조회
   * @param {string} id - 예약 ID
   * @returns {Promise} - API 응답
   */
  getReservation: (id) => {
    return axios.get(`/api/reservations/${id}`);
  },

  /**
   * 예약 상태 변경
   * @param {string} id - 예약 ID
   * @param {string} status - 변경할 상태 (confirmed, checked_in, checked_out, cancelled 등)
   * @param {Object} data - 추가 정보 (취소 사유 등)
   * @returns {Promise} - API 응답
   */
  updateReservationStatus: (id, status, data = {}) => {
    return axios.put(`/api/reservations/${id}/status`, { status, ...data });
  },

  /**
   * 예약 취소
   * @param {string} id - 예약 ID
   * @param {Object} cancellationData - 취소 정보 (사유, 환불 정보 등)
   * @returns {Promise} - API 응답
   */
  cancelReservation: (id, cancellationData) => {
    return axios.post(`/api/reservations/${id}/cancel`, cancellationData);
  },

  /**
   * 체크인 처리
   * @param {string} id - 예약 ID
   * @param {Object} checkInData - 체크인 정보
   * @returns {Promise} - API 응답
   */
  checkIn: (id, checkInData = {}) => {
    return axios.post(`/api/reservations/${id}/check-in`, checkInData);
  },

  /**
   * 체크아웃 처리
   * @param {string} id - 예약 ID
   * @param {Object} checkOutData - 체크아웃 정보
   * @returns {Promise} - API 응답
   */
  checkOut: (id, checkOutData = {}) => {
    return axios.post(`/api/reservations/${id}/check-out`, checkOutData);
  },

  /**
   * 날짜별 예약 조회 (달력 뷰용)
   * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
   * @param {string} endDate - 종료 날짜 (YYYY-MM-DD)
   * @param {string} accommodationId - 숙소 ID (선택적)
   * @returns {Promise} - API 응답
   */
  getReservationsByDate: (startDate, endDate, accommodationId = null) => {
    const params = { startDate, endDate };
    if (accommodationId) {
      params.accommodationId = accommodationId;
    }
    return axios.get(`/api/reservations/calendar`, { params });
  },

  /**
   * 예약 통계 데이터 조회
   * @param {string} period - 기간 (daily, weekly, monthly, yearly)
   * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
   * @param {string} endDate - 종료 날짜 (YYYY-MM-DD)
   * @returns {Promise} - API 응답
   */
  getReservationStats: (period, startDate, endDate) => {
    return axios.get(`/api/reservations/stats`, {
      params: { period, startDate, endDate }
    });
  }
};

export default reservationApi; 