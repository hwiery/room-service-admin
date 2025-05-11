import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Collapse
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HotelIcon from '@mui/icons-material/Hotel';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PeopleIcon from '@mui/icons-material/People';
import RateReviewIcon from '@mui/icons-material/RateReview';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import useAuth from '../../hooks/useAuth';

// 사이드바 너비
const DRAWER_WIDTH = 240;

/**
 * 네비게이션 항목 정의
 * @type {Array<Object>}
 */
const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: '대시보드',
    path: '/dashboard',
    icon: <DashboardIcon />,
    requiredRole: 'all'
  },
  {
    id: 'products',
    label: '상품 관리',
    icon: <HotelIcon />,
    requiredRole: 'admin',
    subItems: [
      {
        id: 'products-accommodations',
        label: '숙소 관리',
        path: '/products/accommodations',
        icon: <HotelIcon />,
        requiredRole: 'admin'
      },
      {
        id: 'products-rooms',
        label: '객실 관리',
        path: '/products/rooms',
        icon: <MeetingRoomIcon />,
        requiredRole: 'admin'
      },
      {
        id: 'products-categories',
        label: '분류 관리',
        path: '/products/categories',
        icon: <CategoryIcon />,
        requiredRole: 'admin'
      }
    ]
  },
  {
    id: 'reservations',
    label: '예약 관리',
    icon: <BookOnlineIcon />,
    requiredRole: 'admin',
    subItems: [
      {
        id: 'reservations-list',
        label: '예약 목록',
        path: '/reservations',
        icon: <ListAltIcon />,
        requiredRole: 'admin'
      },
      {
        id: 'reservations-calendar',
        label: '예약 달력',
        path: '/reservations/calendar',
        icon: <CalendarMonthIcon />,
        requiredRole: 'admin'
      },
      {
        id: 'reservations-dashboard',
        label: '통계 대시보드',
        path: '/reservations/dashboard',
        icon: <EqualizerIcon />,
        requiredRole: 'admin'
      }
    ]
  },
  {
    id: 'customers',
    label: '고객 관리',
    icon: <PeopleIcon />,
    requiredRole: 'admin',
    subItems: [
      {
        id: 'customers-members',
        label: '회원 관리',
        path: '/customers/members',
        requiredRole: 'admin'
      },
      {
        id: 'customers-reviews',
        label: '리뷰 관리',
        path: '/customers/reviews',
        icon: <RateReviewIcon />,
        requiredRole: 'admin'
      }
    ]
  },
  {
    id: 'contents',
    label: '콘텐츠 관리',
    icon: <FeaturedPlayListIcon />,
    requiredRole: 'admin',
    subItems: [
      {
        id: 'contents-main',
        label: '메인 페이지 관리',
        path: '/contents/main',
        requiredRole: 'admin'
      },
      {
        id: 'contents-notices',
        label: '공지사항 관리',
        path: '/contents/notices',
        requiredRole: 'admin'
      }
    ]
  },
  {
    id: 'reports',
    label: '데이터 분석',
    icon: <EqualizerIcon />,
    requiredRole: 'admin',
    subItems: [
      {
        id: 'reports-dashboard',
        label: '데이터 대시보드',
        path: '/reports/dashboard',
        requiredRole: 'admin'
      }
    ]
  },
  {
    id: 'settings',
    label: '시스템 설정',
    icon: <SettingsIcon />,
    requiredRole: 'superadmin',
    subItems: [
      {
        id: 'settings-general',
        label: '기본 설정',
        path: '/settings/general',
        requiredRole: 'superadmin'
      },
      {
        id: 'settings-payment',
        label: '결제 설정',
        path: '/settings/payment',
        requiredRole: 'superadmin'
      }
    ]
  }
];

/**
 * 사이드바 컴포넌트
 * @param {Object} props - 컴포넌트 프롭스
 * @param {boolean} props.open - 사이드바 열림 상태
 * @param {number} props.width - 사이드바 너비
 */
const Sidebar = ({ open, width = DRAWER_WIDTH }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // 하위 메뉴 열림 상태
  const [openSubMenus, setOpenSubMenus] = React.useState({});
  
  // 하위 메뉴 토글 처리
  const handleSubMenuToggle = (id) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // 현재 경로가 해당 메뉴 경로와 일치하는지 확인
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // 현재 경로가 해당 메뉴의 하위 메뉴 경로와 일치하는지 확인
  const isSubMenuActive = (subItems) => {
    if (!subItems) return false;
    return subItems.some(item => location.pathname === item.path);
  };
  
  // 메뉴 아이템 선택 처리
  const handleMenuItemClick = (path) => {
    navigate(path);
  };
  
  // 권한에 맞는 메뉴만 필터링 (임시 구현, 실제로는 권한 체계에 맞게 구현 필요)
  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (item.requiredRole === 'all') return true;
    // 실제 권한 체계 구현 필요
    return true; // 임시로 모든 메뉴 표시
  });
  
  // 사이드바 렌더링
  const drawer = (
    <>
      <Toolbar /> {/* 헤더와 같은 높이의 여백 */}
      <Box sx={{ overflow: 'auto' }}>
        <List component="nav">
          {filteredNavItems.map((item) => (
            <React.Fragment key={item.id}>
              {item.subItems ? (
                // 하위 메뉴가 있는 경우
                <>
                  <ListItemButton 
                    onClick={() => handleSubMenuToggle(item.id)}
                    selected={isSubMenuActive(item.subItems)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                    {openSubMenus[item.id] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openSubMenus[item.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map(subItem => (
                        <ListItemButton
                          key={subItem.id}
                          sx={{ pl: 4 }}
                          onClick={() => handleMenuItemClick(subItem.path)}
                          selected={isActive(subItem.path)}
                        >
                          <ListItemIcon>{subItem.icon}</ListItemIcon>
                          <ListItemText primary={subItem.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                // 하위 메뉴가 없는 경우
                <ListItemButton
                  onClick={() => handleMenuItemClick(item.path)}
                  selected={isActive(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )}
            </React.Fragment>
          ))}
        </List>
        <Divider />
      </Box>
    </>
  );
  
  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          transition: theme => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          width: open ? width : 0,
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar; 