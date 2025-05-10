import { Navigate } from 'react-router-dom';

// 레이아웃
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// 인증 페이지
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';

// 대시보드
import Dashboard from './pages/dashboard/Dashboard';

// 오류 페이지
import NotFound from './pages/notFound/NotFound';

// 숙소 관리 페이지
import AccommodationList from './pages/products/accommodations/AccommodationList';
import AccommodationDetail from './pages/products/accommodations/AccommodationDetail';
import AccommodationNew from './pages/products/accommodations/AccommodationNew';
import AccommodationEdit from './pages/products/accommodations/AccommodationEdit';

// 카테고리 관리 페이지
import CategoryList from './pages/products/categories/CategoryList';

// 편의시설 관리 페이지
import AmenityList from './pages/products/amenities/AmenityList';

// 취소/환불 규정 관리 페이지
import CancellationPolicyList from './pages/products/policies/CancellationPolicyList';

// 예약 관리 페이지
import ReservationList from './pages/reservations/ReservationList';
import ReservationDetail from './pages/reservations/ReservationDetail';
import ReservationCalendar from './pages/reservations/ReservationCalendar';
import ReservationDashboard from './pages/reservations/ReservationDashboard';

// 고객 관리 페이지
import MemberList from './pages/customers/members/MemberList';
import MemberDetail from './pages/customers/members/MemberDetail';
import BlacklistManager from './pages/customers/members/BlacklistManager';
import ReviewList from './pages/customers/reviews/ReviewList';
import PrivacyManager from './pages/customers/privacy/PrivacyManager';
import CustomerStats from './pages/customers/stats/CustomerStats';

// 프로모션 관리 페이지
import PromotionList from './pages/contents/promotions/PromotionList';
import PromotionDetail from './pages/contents/promotions/PromotionDetail';
import PromotionNew from './pages/contents/promotions/PromotionNew';
import PromotionEdit from './pages/contents/promotions/PromotionEdit';

/**
 * 애플리케이션 라우트 정의
 */
const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          // 추후 구현 예정인 라우트들
          {
            path: 'products',
            children: [
              {
                path: '',
                element: <Navigate to="/products/accommodations" replace />,
              },
              {
                path: 'accommodations',
                children: [
                  {
                    path: '',
                    element: <AccommodationList />,
                  },
                  {
                    path: 'new',
                    element: <AccommodationNew />,
                  },
                  {
                    path: ':id',
                    element: <AccommodationDetail />,
                  },
                  {
                    path: ':id/edit',
                    element: <AccommodationEdit />,
                  }
                ],
              },
              {
                path: 'rooms',
                element: <div>객실 관리 페이지</div>,
              },
              {
                path: 'categories',
                element: <CategoryList />,
              },
              {
                path: 'amenities',
                element: <AmenityList />,
              },
              {
                path: 'policies',
                element: <CancellationPolicyList />,
              },
            ],
          },
          {
            path: 'reservations',
            children: [
              {
                path: '',
                element: <ReservationList />,
              },
              {
                path: 'calendar',
                element: <ReservationCalendar />,
              },
              {
                path: 'dashboard',
                element: <ReservationDashboard />,
              },
              {
                path: ':id',
                element: <ReservationDetail />,
              },
            ],
          },
          {
            path: 'customers',
            children: [
              {
                path: '',
                element: <Navigate to="/customers/members" replace />,
              },
              {
                path: 'members',
                element: <MemberList />,
              },
              {
                path: 'members/blacklist',
                element: <BlacklistManager />,
              },
              {
                path: 'privacy',
                element: <PrivacyManager />,
              },
              {
                path: 'members/stats',
                element: <CustomerStats />,
              },
              {
                path: 'members/:id',
                element: <MemberDetail />,
              },
              {
                path: 'reviews',
                element: <ReviewList />,
              },
            ],
          },
          {
            path: 'contents',
            children: [
              {
                path: '',
                element: <Navigate to="/contents/promotions" replace />,
              },
              {
                path: 'promotions',
                element: <PromotionList />,
              },
              {
                path: 'promotions/new',
                element: <PromotionNew />,
              },
              {
                path: 'promotions/:id',
                element: <PromotionDetail />,
              },
              {
                path: 'promotions/:id/edit',
                element: <PromotionEdit />,
              },
              {
                path: 'main',
                element: <div>메인 페이지 관리</div>,
              },
              {
                path: 'notices',
                element: <div>공지사항 관리</div>,
              },
            ],
          },
          {
            path: 'settings',
            element: <div>시스템 설정 페이지</div>,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes; 