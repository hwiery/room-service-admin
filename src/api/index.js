import authApi from './authApi';
import productApi from './productApi';
import reservationApi from './reservationApi';
import customerApi from './customerApi';
import { encrypt, decrypt } from '../utils/crypto';

// API 호출 시 민감한 데이터 암호화/복호화 처리를 위한 유틸리티
export const secureApi = {
  encrypt,
  decrypt
};

// API 모듈 통합 내보내기
export { 
  authApi,
  productApi,
  reservationApi,
  customerApi
};

// 추후 더 많은 API 모듈이 추가될 수 있음 (예: reservationApi, customerApi 등) 