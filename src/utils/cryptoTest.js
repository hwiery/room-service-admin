import { encrypt, decrypt } from './crypto';
import { 
  encryptPersonalInfo, 
  decryptPersonalInfo, 
  maskPersonalInfo,
  maskEmail,
  maskPhoneNumber
} from './privacy';

/**
 * 암호화 기능 테스트 유틸리티
 * 개발 환경에서만 사용하세요.
 */

// 테스트 데이터
const testData = {
  simple: '안녕하세요, 이것은 테스트입니다.',
  object: {
    id: 1,
    name: '홍길동',
    secret: '매우 중요한 정보'
  },
  member: {
    id: 'USR001',
    name: '김철수',
    email: 'kim@example.com',
    phoneNumber: '010-1234-5678',
    idNumber: '880101-1234567',
    address: '서울시 강남구 테헤란로 123 456호',
    creditCardNumber: '1234-5678-9012-3456'
  }
};

/**
 * 기본 암호화/복호화 테스트
 */
export const testBasicCrypto = () => {
  console.log('=== 기본 암호화/복호화 테스트 ===');
  
  // 문자열 테스트
  const encryptedString = encrypt(testData.simple);
  console.log('원본 문자열:', testData.simple);
  console.log('암호화된 문자열:', encryptedString);
  console.log('복호화된 문자열:', decrypt(encryptedString));
  console.log('일치 여부:', testData.simple === decrypt(encryptedString));
  
  // 객체 테스트
  const encryptedObject = encrypt(testData.object);
  console.log('\n원본 객체:', testData.object);
  console.log('암호화된 객체(문자열):', encryptedObject);
  console.log('복호화된 객체:', decrypt(encryptedObject));
  console.log('일치 여부:', JSON.stringify(testData.object) === JSON.stringify(decrypt(encryptedObject)));
  
  return {
    encryptedString,
    decryptedString: decrypt(encryptedString),
    encryptedObject,
    decryptedObject: decrypt(encryptedObject)
  };
};

/**
 * 개인정보 보호 테스트
 */
export const testPrivacyUtils = () => {
  console.log('\n=== 개인정보 보호 테스트 ===');
  
  // 이메일 마스킹 테스트
  console.log('원본 이메일:', testData.member.email);
  console.log('마스킹된 이메일:', maskEmail(testData.member.email));
  
  // 전화번호 마스킹 테스트
  console.log('\n원본 전화번호:', testData.member.phoneNumber);
  console.log('마스킹된 전화번호:', maskPhoneNumber(testData.member.phoneNumber));
  
  // 전체 회원 정보 마스킹 테스트
  console.log('\n원본 회원 정보:', testData.member);
  console.log('마스킹된 회원 정보:', maskPersonalInfo(testData.member));
  
  // 회원 정보 암호화/복호화 테스트
  const encryptedMember = encryptPersonalInfo(testData.member);
  const decryptedMember = decryptPersonalInfo(encryptedMember);
  
  console.log('\n암호화된 회원 정보:', encryptedMember);
  console.log('복호화된 회원 정보:', decryptedMember);
  
  return {
    masked: maskPersonalInfo(testData.member),
    encrypted: encryptedMember,
    decrypted: decryptedMember
  };
};

/**
 * 모든 테스트 실행
 */
export const runAllTests = () => {
  // 기본 암호화 테스트
  const basicResults = testBasicCrypto();
  
  // 개인정보 보호 테스트
  const privacyResults = testPrivacyUtils();
  
  return {
    basicResults,
    privacyResults
  };
}; 