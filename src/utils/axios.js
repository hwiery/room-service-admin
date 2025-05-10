import axios from 'axios';

// API 기본 URL 설정 (개발/운영 환경에 따라 달라질 수 있음)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// 모의 사용자 데이터
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: '관리자',
    role: 'admin',
    email: 'admin@example.com',
  }
];

// Axios 인스턴스 생성
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 요청 타임아웃 10초
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 모의 API 응답 처리
const mockApiResponse = (config) => {
  // 개발 중에는 API 호출을 가로채서 모의 응답 반환
  const { url, method, data } = config;
  
  // 로그인 요청 처리
  if (url === '/api/auth/login' && method === 'post') {
    // data 객체 안전하게 파싱하기
    let requestData = {};
    try {
      requestData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.error('데이터 파싱 오류:', e);
    }
    
    const { username, password } = requestData;
    const user = mockUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
      return Promise.resolve({
        data: {
          token: 'mock-token-' + Date.now(),
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            email: user.email
          }
        }
      });
    } else {
      return Promise.reject({
        response: {
          status: 401,
          data: {
            message: '아이디 또는 비밀번호가 올바르지 않습니다.'
          }
        }
      });
    }
  }
  
  // 토큰 검증 요청 처리
  if (url === '/api/auth/verify' && method === 'post') {
    const authHeader = config.headers.Authorization;
    
    if (authHeader && authHeader.startsWith('Bearer mock-token-')) {
      return Promise.resolve({
        data: {
          user: {
            id: 1,
            username: 'admin',
            name: '관리자',
            role: 'admin',
            email: 'admin@example.com'
          }
        }
      });
    } else {
      return Promise.reject({
        response: {
          status: 401,
          data: {
            message: '인증이 만료되었거나 유효하지 않습니다.'
          }
        }
      });
    }
  }
  
  // 그 외 요청은 실제 API 호출 진행
  return false;
};

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    // 모의 API 응답 확인
    const mockResponse = mockApiResponse(config);
    if (mockResponse) {
      return {
        ...config,
        adapter: () => mockResponse
      };
    }
    
    // 요청 전에 처리할 로직
    // 예: 로깅, 요청 헤더 수정 등
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    return response;
  },
  (error) => {
    // 오류 응답 처리
    if (error.response) {
      // 서버가 응답을 반환한 경우
      const { status } = error.response;

      if (status === 401) {
        // 인증 오류 처리
        // localStorage.removeItem('authToken');
        // window.location.href = '/login';
      } else if (status === 403) {
        // 권한 오류 처리
      } else if (status === 500) {
        // 서버 오류 처리
      }
    } else if (error.request) {
      // 요청은 전송되었으나 응답이 없는 경우
      console.error('서버와의 연결이 되지 않습니다.');
    } else {
      // 요청 설정 중 오류가 발생한 경우
      console.error('요청 설정 중 오류가 발생했습니다.', error.message);
    }

    return Promise.reject(error);
  }
);

export default instance; 