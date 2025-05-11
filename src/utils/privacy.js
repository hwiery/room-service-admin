import { encrypt, decrypt } from './crypto';

/**
 * 개인정보 보호 유틸리티
 * 민감한 개인정보를 처리하기 위한 함수 모음
 */

/**
 * 이메일 주소 마스킹 처리
 * @param {string} email - 원본 이메일 주소
 * @returns {string} 마스킹된 이메일 주소
 */
export const maskEmail = (email) => {
  if (!email) return '';
  
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  
  const [username, domain] = parts;
  let masked = username.substring(0, Math.min(2, username.length));
  masked += '*'.repeat(Math.max(1, username.length - 2));
  
  return `${masked}@${domain}`;
};

/**
 * 전화번호 마스킹 처리
 * @param {string} phone - 원본 전화번호
 * @returns {string} 마스킹된 전화번호
 */
export const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // 숫자만 추출
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length < 7) return phone;
  
  // 뒷자리 4개를 제외하고 마스킹
  const visibleLen = 4;
  const maskedLen = numbers.length - visibleLen;
  const masked = '*'.repeat(maskedLen) + numbers.substring(maskedLen);
  
  // 형식에 맞게 반환 (예: ***-***-1234)
  if (numbers.length === 10) {
    return `${masked.substring(0, 3)}-${masked.substring(3, 6)}-${masked.substring(6)}`;
  }
  return `${masked.substring(0, 3)}-${masked.substring(3, 7)}-${masked.substring(7)}`;
};

/**
 * 주민등록번호 마스킹 처리
 * @param {string} idNumber - 원본 주민등록번호
 * @returns {string} 마스킹된 주민등록번호
 */
export const maskIdNumber = (idNumber) => {
  if (!idNumber) return '';
  
  // 숫자와 하이픈만 추출
  const cleaned = idNumber.replace(/[^\d-]/g, '');
  const parts = cleaned.split('-');
  
  if (parts.length === 2) {
    return `${parts[0]}-${'*'.repeat(parts[1].length)}`;
  }
  
  if (cleaned.length >= 7) {
    return `${cleaned.substring(0, 6)}-${'*'.repeat(cleaned.length - 6)}`;
  }
  
  return cleaned;
};

/**
 * 주소 마스킹 처리
 * @param {string} address - 원본 주소
 * @returns {string} 마스킹된 주소
 */
export const maskAddress = (address) => {
  if (!address) return '';
  
  // 주소를 공백으로 분리
  const parts = address.split(' ');
  if (parts.length <= 2) return address;
  
  // 도로명/지번 이후 부분 마스킹
  const maskedParts = [...parts.slice(0, 3), '***'];
  return maskedParts.join(' ');
};

/**
 * 개인정보 암호화 처리
 * @param {Object} memberData - 회원 개인정보 객체
 * @returns {Object} 암호화된 개인정보 객체
 */
export const encryptPersonalInfo = (memberData) => {
  if (!memberData) return null;
  
  // 암호화할 필드 목록
  const fieldsToEncrypt = [
    'email', 'phoneNumber', 'idNumber', 
    'address', 'creditCardNumber', 'passportNumber'
  ];
  
  // 복사본 생성
  const encryptedData = { ...memberData };
  
  // 해당 필드만 암호화
  fieldsToEncrypt.forEach(field => {
    if (encryptedData[field]) {
      encryptedData[field] = encrypt(encryptedData[field]);
    }
  });
  
  return encryptedData;
};

/**
 * 개인정보 복호화 처리
 * @param {Object} encryptedData - 암호화된 회원 개인정보 객체
 * @returns {Object} 복호화된 개인정보 객체
 */
export const decryptPersonalInfo = (encryptedData) => {
  if (!encryptedData) return null;
  
  // 복호화할 필드 목록
  const fieldsToDecrypt = [
    'email', 'phoneNumber', 'idNumber', 
    'address', 'creditCardNumber', 'passportNumber'
  ];
  
  // 복사본 생성
  const decryptedData = { ...encryptedData };
  
  // 해당 필드만 복호화
  fieldsToDecrypt.forEach(field => {
    if (decryptedData[field]) {
      try {
        decryptedData[field] = decrypt(decryptedData[field]);
      } catch (error) {
        console.error(`필드 복호화 실패 (${field}):`, error);
        // 복호화 실패 시 원본 값 유지
      }
    }
  });
  
  return decryptedData;
};

/**
 * 개인정보를 마스킹 처리
 * @param {Object} memberData - 회원 개인정보 객체
 * @returns {Object} 마스킹된 개인정보 객체
 */
export const maskPersonalInfo = (memberData) => {
  if (!memberData) return null;
  
  // 복사본 생성
  const maskedData = { ...memberData };
  
  // 각 필드별 마스킹 처리
  if (maskedData.email) {
    maskedData.email = maskEmail(maskedData.email);
  }
  
  if (maskedData.phoneNumber) {
    maskedData.phoneNumber = maskPhoneNumber(maskedData.phoneNumber);
  }
  
  if (maskedData.idNumber) {
    maskedData.idNumber = maskIdNumber(maskedData.idNumber);
  }
  
  if (maskedData.address) {
    maskedData.address = maskAddress(maskedData.address);
  }
  
  // 신용카드 번호 마스킹 (앞 6자리, 뒤 4자리 제외 마스킹)
  if (maskedData.creditCardNumber) {
    const cleaned = maskedData.creditCardNumber.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      const firstPart = cleaned.substring(0, 6);
      const lastPart = cleaned.substring(cleaned.length - 4);
      const middle = '*'.repeat(cleaned.length - 10);
      maskedData.creditCardNumber = `${firstPart}${middle}${lastPart}`;
    }
  }
  
  return maskedData;
}; 