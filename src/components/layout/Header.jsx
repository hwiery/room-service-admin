import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem, 
  Avatar, 
  Tooltip 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from '../../hooks/useAuth';

/**
 * 어드민 헤더 컴포넌트
 * @param {Object} props - 컴포넌트 프롭스
 * @param {Function} props.toggleSidebar - 사이드바 토글 함수
 */
const Header = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  // 프로필 메뉴 열기
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // 프로필 메뉴 닫기
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  // 로그아웃 처리
  const handleLogout = () => {
    handleCloseMenu();
    logout();
  };
  
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* 사이드바 토글 버튼 */}
        <IconButton
          color="inherit"
          aria-label="사이드바 열기"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* 로고 */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ABC 숙소 예약 서비스 어드민
        </Typography>
        
        {/* 프로필 메뉴 */}
        <Box>
          <Tooltip title="설정 열기">
            <IconButton onClick={handleOpenMenu} color="inherit">
              {currentUser?.profileImage ? (
                <Avatar 
                  src={currentUser.profileImage} 
                  alt={currentUser.name} 
                  sx={{ width: 32, height: 32 }} 
                />
              ) : (
                <AccountCircleIcon />
              )}
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem disabled sx={{ opacity: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {currentUser?.name || '사용자'}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              로그아웃
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 