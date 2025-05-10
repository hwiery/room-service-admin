import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api';

// 인증 컨텍스트 생성
export const AuthContext = createContext(null);

/**
 * 인증 컨텍스트 제공자 컴포넌트
 * @param {Object} props - 컴포넌트 프롭스
 * @param {React.ReactNode} props.children - 자식 컴포넌트
 */
export const AuthProvider = ({ children }) => {
  // 현재 로그인한 사용자 정보
  const [currentUser, setCurrentUser] = useState(null);
  // 인증 확인 로딩 상태
  const [loading, setLoading] = useState(true);
  // 인증 오류
  const [error, setError] = useState(null);
  
  // 컴포넌트 마운트 시 로컬 스토리지에서 토큰을 확인하고 유효성 검증
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);
  
  /**
   * 토큰 유효성 검증 함수
   * @param {string} token - 인증 토큰
   */
  const verifyToken = async (token) => {
    try {
      authApi.setAuthHeader(token);
      const response = await authApi.verifyToken();
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error('토큰 검증 실패:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * 로그인 함수
   * @param {string} username - 사용자 ID
   * @param {string} password - 비밀번호
   * @returns {Promise} - 로그인 결과
   */
  const login = async (username, password) => {
    setError(null);
    try {
      const response = await authApi.login(username, password);
      const { token, user } = response.data;
      
      // 토큰 저장 및 사용자 정보 설정
      localStorage.setItem('authToken', token);
      authApi.setAuthHeader(token);
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      setError(
        error.response?.data?.message || 
        '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'
      );
      throw error;
    }
  };
  
  /**
   * 로그아웃 함수
   */
  const logout = () => {
    // 토큰 및 사용자 정보 제거
    localStorage.removeItem('authToken');
    authApi.removeAuthHeader();
    setCurrentUser(null);
  };
  
  // 컨텍스트에 제공할 값
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 