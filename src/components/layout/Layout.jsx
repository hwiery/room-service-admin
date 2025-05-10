import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * 어드민 기본 레이아웃 컴포넌트
 * 헤더, 사이드바, 메인 콘텐츠 영역을 포함
 */
const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // 사이드바 열림 상태 관리
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* 헤더 */}
      <Header toggleSidebar={toggleSidebar} />
      
      {/* 사이드바 */}
      <Sidebar open={sidebarOpen} />
      
      {/* 메인 콘텐츠 영역 */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? 240 : 0}px)` },
          transition: theme => theme.transitions.create(['width']),
          overflow: 'auto'
        }}
      >
        <Toolbar /> {/* 헤더와 같은 높이의 여백 */}
        <Outlet /> {/* 라우팅된 페이지 렌더링 */}
      </Box>
    </Box>
  );
};

export default Layout; 