import axios from '../utils/axios';

/**
 * 고객 관리 관련 API 호출 함수들
 */
export const customerApi = {
  /**
   * 회원 목록 조회
   * @param {Object} params - 검색 매개변수 (페이지네이션, 필터링, 정렬 등)
   * @returns {Promise} - API 응답
   */
  getMembers: (params) => {
    return axios.get('/api/customers/members', { params });
  },

  /**
   * 회원 상세 조회
   * @param {string} id - 회원 ID
   * @returns {Promise} - API 응답
   */
  getMember: (id) => {
    return axios.get(`/api/customers/members/${id}`);
  },

  /**
   * 회원 정보 수정
   * @param {string} id - 회원 ID
   * @param {Object} data - 수정할 회원 정보
   * @returns {Promise} - API 응답
   */
  updateMember: (id, data) => {
    return axios.put(`/api/customers/members/${id}`, data);
  },

  /**
   * 회원 상태 변경
   * @param {string} id - 회원 ID
   * @param {string} status - 변경할 상태 (active, inactive, blocked 등)
   * @returns {Promise} - API 응답
   */
  updateMemberStatus: (id, status) => {
    return axios.put(`/api/customers/members/${id}/status`, { status });
  },

  /**
   * 회원 예약 이력 조회
   * @param {string} id - 회원 ID
   * @param {Object} params - 검색 매개변수
   * @returns {Promise} - API 응답
   */
  getMemberReservations: (id, params) => {
    return axios.get(`/api/customers/members/${id}/reservations`, { params });
  },

  /**
   * 리뷰 목록 조회
   * @param {Object} params - 검색 매개변수 (페이지네이션, 필터링, 정렬 등)
   * @returns {Promise} - API 응답
   */
  getReviews: (params) => {
    return axios.get('/api/customers/reviews', { params });
  },

  /**
   * 리뷰 상세 조회
   * @param {string} id - 리뷰 ID
   * @returns {Promise} - API 응답
   */
  getReview: (id) => {
    return axios.get(`/api/customers/reviews/${id}`);
  },

  /**
   * 리뷰 상태 변경
   * @param {string} id - 리뷰 ID
   * @param {string} status - 변경할 상태 (published, hidden 등)
   * @returns {Promise} - API 응답
   */
  updateReviewStatus: (id, status) => {
    return axios.put(`/api/customers/reviews/${id}/status`, { status });
  },

  /**
   * 리뷰 답변 작성
   * @param {string} id - 리뷰 ID
   * @param {string} response - 답변 내용
   * @returns {Promise} - API 응답
   */
  respondToReview: (id, response) => {
    return axios.post(`/api/customers/reviews/${id}/respond`, { response });
  },

  /**
   * 리뷰 통계 데이터 조회
   * @returns {Promise} - API 응답
   */
  getReviewStats: () => {
    return axios.get('/api/customers/reviews/stats');
  }
};

export default customerApi; 