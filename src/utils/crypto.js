/**
 * 데이터 암호화/복호화 유틸리티
 * - 민감한 데이터 암호화에 사용
 * - localStorage 저장 시 암호화 처리
 * - API 통신 데이터 암호화
 */

// 암호화 키 (환경 변수로 관리하는 것이 더 안전함)
const CRYPTO_KEY = 'room-service-admin-secret-key';

/**
 * 데이터 암호화 함수
 * @param {any} data - 암호화할 데이터
 * @returns {string} 암호화된 문자열
 */
export const encrypt = (data) => {
  try {
    if (!data) return '';
    
    // 객체나 배열인 경우 JSON 문자열로 변환
    const text = typeof data === 'object' ? JSON.stringify(data) : String(data);
    
    // 간단한 XOR 암호화 구현 (실제 서비스에서는 더 강력한 알고리즘 사용 필요)
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ CRYPTO_KEY.charCodeAt(i % CRYPTO_KEY.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    // Base64 인코딩하여 반환
    return btoa(encrypted);
  } catch (error) {
    console.error('암호화 오류:', error);
    return '';
  }
};

/**
 * 데이터 복호화 함수
 * @param {string} encryptedText - 암호화된 문자열
 * @returns {any} 복호화된 데이터
 */
export const decrypt = (encryptedText) => {
  try {
    if (!encryptedText) return null;
    
    // Base64 디코딩
    const base64Decoded = atob(encryptedText);
    
    // XOR 복호화
    let decrypted = '';
    for (let i = 0; i < base64Decoded.length; i++) {
      const charCode = base64Decoded.charCodeAt(i) ^ CRYPTO_KEY.charCodeAt(i % CRYPTO_KEY.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    // JSON 파싱 시도 (객체/배열인 경우)
    try {
      return JSON.parse(decrypted);
    } catch {
      // JSON이 아닌 경우 문자열 그대로 반환
      return decrypted;
    }
  } catch (error) {
    console.error('복호화 오류:', error);
    return null;
  }
};

/**
 * 로컬 스토리지에 암호화하여 저장
 * @param {string} key - 저장 키
 * @param {any} value - 저장할 값
 */
export const secureStorage = {
  // 저장
  setItem: (key, value) => {
    const encrypted = encrypt(value);
    localStorage.setItem(key, encrypted);
  },
  
  // 조회
  getItem: (key) => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decrypt(encrypted);
  },
  
  // 삭제
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
  
  // 모두 삭제
  clear: () => {
    localStorage.clear();
  }
}; 