import axios from '../utils/axios';

/**
 * 상품(숙소/객실) 관련 API 호출 함수들
 */
export const productApi = {
  /**
   * 숙소 목록 조회
   * @param {Object} params - 검색 매개변수 (페이지네이션, 필터링 등)
   * @returns {Promise} - API 응답
   */
  getAccommodations: (params) => {
    return axios.get('/api/accommodations', { params });
  },

  /**
   * 숙소 상세 조회
   * @param {string} id - 숙소 ID
   * @returns {Promise} - API 응답
   */
  getAccommodation: (id) => {
    return axios.get(`/api/accommodations/${id}`);
  },

  /**
   * 숙소 등록
   * @param {Object} data - 숙소 데이터
   * @returns {Promise} - API 응답
   */
  createAccommodation: (data) => {
    return axios.post('/api/accommodations', data);
  },

  /**
   * 숙소 수정
   * @param {string} id - 숙소 ID
   * @param {Object} data - 수정할 숙소 데이터
   * @returns {Promise} - API 응답
   */
  updateAccommodation: (id, data) => {
    return axios.put(`/api/accommodations/${id}`, data);
  },

  /**
   * 숙소 삭제
   * @param {string} id - 숙소 ID
   * @returns {Promise} - API 응답
   */
  deleteAccommodation: (id) => {
    return axios.delete(`/api/accommodations/${id}`);
  },

  /**
   * 객실 목록 조회
   * @param {string} accommodationId - 숙소 ID
   * @param {Object} params - 검색 매개변수
   * @returns {Promise} - API 응답
   */
  getRooms: (accommodationId, params) => {
    return axios.get(`/api/accommodations/${accommodationId}/rooms`, { params });
  },

  /**
   * 객실 상세 조회
   * @param {string} accommodationId - 숙소 ID
   * @param {string} roomId - 객실 ID
   * @returns {Promise} - API 응답
   */
  getRoom: (accommodationId, roomId) => {
    return axios.get(`/api/accommodations/${accommodationId}/rooms/${roomId}`);
  },

  /**
   * 객실 등록
   * @param {string} accommodationId - 숙소 ID
   * @param {Object} data - 객실 데이터
   * @returns {Promise} - API 응답
   */
  createRoom: (accommodationId, data) => {
    return axios.post(`/api/accommodations/${accommodationId}/rooms`, data);
  },

  /**
   * 객실 수정
   * @param {string} accommodationId - 숙소 ID
   * @param {string} roomId - 객실 ID
   * @param {Object} data - 수정할 객실 데이터
   * @returns {Promise} - API 응답
   */
  updateRoom: (accommodationId, roomId, data) => {
    return axios.put(`/api/accommodations/${accommodationId}/rooms/${roomId}`, data);
  },

  /**
   * 객실 삭제
   * @param {string} accommodationId - 숙소 ID
   * @param {string} roomId - 객실 ID
   * @returns {Promise} - API 응답
   */
  deleteRoom: (accommodationId, roomId) => {
    return axios.delete(`/api/accommodations/${accommodationId}/rooms/${roomId}`);
  },

  /**
   * 숙소 카테고리 목록 조회
   * @returns {Promise} - API 응답
   */
  getCategories: () => {
    return axios.get('/api/categories');
  },

  /**
   * 편의시설 목록 조회
   * @returns {Promise} - API 응답
   */
  getAmenities: () => {
    return axios.get('/api/amenities');
  },

  /**
   * 이미지 업로드
   * @param {FormData} formData - 이미지 폼 데이터
   * @returns {Promise} - API 응답
   */
  uploadImage: (formData) => {
    return axios.post('/api/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default productApi; 