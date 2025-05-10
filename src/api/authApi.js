import axios from '../utils/axios';

/**
 * 인증 관련 API 호출 함수들
 */
export const authApi = {
  /**
   * 로그인 요청
   * @param {string} username - 사용자 ID
   * @param {string} password - 비밀번호
   * @returns {Promise} - API 응답
   */
  login: (username, password) => {
    return axios.post('/api/auth/login', { username, password });
  },
  
  /**
   * 토큰 유효성 검증
   * @returns {Promise} - API 응답
   */
  verifyToken: () => {
    return axios.post('/api/auth/verify');
  },
  
  /**
   * 비밀번호 초기화 요청
   * @param {string} email - 이메일 주소
   * @returns {Promise} - API 응답
   */
  forgotPassword: (email) => {
    return axios.post('/api/auth/forgot-password', { email });
  },
  
  /**
   * 인증 헤더 설정
   * @param {string} token - 인증 토큰
   */
  setAuthHeader: (token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  /**
   * 인증 헤더 제거
   */
  removeAuthHeader: () => {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default authApi; 