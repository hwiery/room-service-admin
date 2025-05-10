import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * 페이지를 찾을 수 없을 때 표시할 404 페이지 컴포넌트
 */
const NotFound = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 3,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'warning.main', mb: 4 }} />
        
        <Typography variant="h1" sx={{ mb: 2 }}>
          404
        </Typography>
        
        <Typography variant="h4" color="text.secondary" sx={{ mb: 3 }}>
          페이지를 찾을 수 없습니다
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          요청하신 페이지가 삭제되었거나, 주소가 변경되었거나, 일시적으로 사용할 수 없습니다.
        </Typography>
        
        <Button
          component={RouterLink}
          to="/dashboard"
          variant="contained"
          size="large"
        >
          대시보드로 돌아가기
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound; 