/**
 * 보안 유틸리티
 * - XSS 방어
 * - CSRF 방어
 * - 입력값 검증
 */
import axios from 'axios';

/**
 * HTML 특수 문자 이스케이프 처리
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
export const escapeHtml = (text) => {
  if (!text) return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * HTML 특수 문자 이스케이프 해제
 * @param {string} html - 이스케이프 해제할 HTML
 * @returns {string} 원본 텍스트
 */
export const unescapeHtml = (html) => {
  if (!html) return '';
  
  const map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'"
  };
  
  return html.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, (m) => map[m]);
};

/**
 * URL 안전하게 인코딩
 * @param {string} url - 인코딩할 URL
 * @returns {string} 인코딩된 URL
 */
export const safeEncodeUrl = (url) => {
  if (!url) return '';
  return encodeURIComponent(url);
};

/**
 * CSRF 토큰 설정
 * 백엔드에서 제공하는 CSRF 토큰을 전역 Axios 인스턴스에 설정
 */
export const setupCSRFProtection = () => {
  // CSRF 토큰 가져오기 (백엔드 API에서 제공)
  const getCsrfToken = async () => {
    try {
      // 실제 구현 시에는 백엔드에서 CSRF 토큰을 제공하는 API 호출
      // const response = await axios.get('/api/csrf-token');
      // return response.data.token;
      
      // 개발 단계에서는 모의 토큰 반환
      return 'mock-csrf-token-' + Date.now();
    } catch (error) {
      console.error('CSRF 토큰을 가져오는 중 오류 발생:', error);
      return null;
    }
  };
  
  // 모든 HTTP 요청에 CSRF 토큰 추가
  axios.interceptors.request.use(async (config) => {
    // POST, PUT, DELETE, PATCH 요청에만 CSRF 토큰 적용
    if (['post', 'put', 'delete', 'patch'].includes(config.method)) {
      const token = await getCsrfToken();
      if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
      }
    }
    return config;
  });
};

/**
 * 입력값 검증 (XSS 방어)
 * @param {string} input - 검증할 입력값
 * @param {Object} options - 검증 옵션
 * @returns {boolean} 안전한 입력값 여부
 */
export const validateInput = (input, options = {}) => {
  if (!input) return true;
  
  // 위험한 문자열 패턴 (스크립트 태그, 자바스크립트 URL 등)
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+=/gi,
    /data:/gi
  ];
  
  // 옵션에 따라 추가 패턴 적용
  if (options.allowHtml !== true) {
    dangerousPatterns.push(/<\/?[a-z][\s\S]*>/gi);
  }
  
  // 패턴 검사
  return !dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * 안전한 HTML 생성 (React에서 dangerouslySetInnerHTML 사용 시)
 * @param {string} html - 원본 HTML
 * @returns {Object} dangerouslySetInnerHTML 객체
 */
export const createSafeHtml = (html) => {
  // DOMPurify 같은 라이브러리를 사용하는 것이 더 안전합니다
  // 실제 프로덕션에서는 DOMPurify 사용을 권장
  
  // 간단한 XSS 필터링 (기본적인 보호만 제공)
  const sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/data:/gi, '');
  
  return { __html: sanitized };
};

/**
 * 컨텐츠 보안 정책 위반 기록
 * @param {Object} event - CSP 위반 이벤트
 */
export const setupCSPReporting = () => {
  document.addEventListener('securitypolicyviolation', (event) => {
    // CSP 위반 보고 (실제 구현 시 백엔드 API로 전송)
    console.warn('CSP 위반 발생:', {
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      originalPolicy: event.originalPolicy
    });
  });
};

/**
 * 입력값 살균 처리 (XSS 방어)
 * @param {string} input - 살균 처리할 입력값
 * @returns {string} 살균 처리된 입력값
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  
  // 기본적인 XSS 방어 처리
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#x60;')
    .replace(/\$/g, '&#036;');
};

/**
 * 보안 초기화 함수
 * 애플리케이션 시작 시 한 번 호출
 */
export const initSecurity = () => {
  // CSRF 보호 설정
  setupCSRFProtection();
  
  // CSP 위반 보고 설정
  setupCSPReporting();
  
  // 기타 보안 설정
  // ...
}; 