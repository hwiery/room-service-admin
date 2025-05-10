import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import useAuth from '../../hooks/useAuth';

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * @param {Object} props
 * @param {string} [props.redirectTo='/login'] - 인증되지 않은 사용자를 리디렉션할 경로
 */
const ProtectedRoute = ({ redirectTo = '/login' }) => {
  const { currentUser, loading } = useAuth();
  
  // 로딩 중일 때 표시할 화면
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          인증 정보를 확인하는 중입니다...
        </Typography>
      </Box>
    );
  }
  
  // 인증되지 않은 경우 리디렉션
  if (!currentUser) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // 인증된 경우 자식 라우트 렌더링
  return <Outlet />;
};

export default ProtectedRoute; 