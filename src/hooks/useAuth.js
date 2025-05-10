import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * 인증 컨텍스트를 사용하기 위한 커스텀 훅
 * @returns {Object} 인증 컨텍스트 값
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth; 