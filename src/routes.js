import React, { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

// 레이아웃
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// 로딩 컴포넌트
import { Box, CircularProgress, Typography } from '@mui/material';

// 즉시 로드되는 컴포넌트
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import NotFound from './pages/notFound/NotFound';

// 지연 로딩 컴포넌트
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));

// 숙소 관리 페이지
const AccommodationList = lazy(() => import('./pages/products/accommodations/AccommodationList'));
const AccommodationDetail = lazy(() => import('./pages/products/accommodations/AccommodationDetail'));
const AccommodationNew = lazy(() => import('./pages/products/accommodations/AccommodationNew'));
const AccommodationEdit = lazy(() => import('./pages/products/accommodations/AccommodationEdit'));

// 카테고리 관리 페이지
const CategoryList = lazy(() => import('./pages/products/categories/CategoryList'));

// 편의시설 관리 페이지
const AmenityList = lazy(() => import('./pages/products/amenities/AmenityList'));

// 취소/환불 규정 관리 페이지
const CancellationPolicyList = lazy(() => import('./pages/products/policies/CancellationPolicyList'));

// 예약 관리 페이지
const ReservationList = lazy(() => import('./pages/reservations/ReservationList'));
const ReservationDetail = lazy(() => import('./pages/reservations/ReservationDetail'));
const ReservationCalendar = lazy(() => import('./pages/reservations/ReservationCalendar'));
const ReservationDashboard = lazy(() => import('./pages/reservations/ReservationDashboard'));

// 고객 관리 페이지
const MemberList = lazy(() => import('./pages/customers/members/MemberList'));
const MemberDetail = lazy(() => import('./pages/customers/members/MemberDetail'));
const BlacklistManager = lazy(() => import('./pages/customers/members/BlacklistManager'));
const ReviewList = lazy(() => import('./pages/customers/reviews/ReviewList'));
const PrivacyManager = lazy(() => import('./pages/customers/privacy/PrivacyManager'));
const CustomerStats = lazy(() => import('./pages/customers/stats/CustomerStats'));

// 프로모션 관리 페이지
const PromotionList = lazy(() => import('./pages/contents/promotions/PromotionList'));
const PromotionDetail = lazy(() => import('./pages/contents/promotions/PromotionDetail'));
const PromotionNew = lazy(() => import('./pages/contents/promotions/PromotionNew'));
const PromotionEdit = lazy(() => import('./pages/contents/promotions/PromotionEdit'));

// 시스템 설정 페이지
const GeneralSettings = lazy(() => import('./pages/settings/GeneralSettings'));
const PaymentSettings = lazy(() => import('./pages/settings/PaymentSettings'));

// 리포트 페이지
const ReportDashboard = lazy(() => import('./pages/reports/ReportDashboard'));

// 로딩 표시 컴포넌트
const LoadingComponent = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
    }}
  >
    <CircularProgress size={60} sx={{ mb: 3 }} />
    <Typography variant="h6" color="text.secondary">
      컴포넌트를 불러오는 중...
    </Typography>
  </Box>
);

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
            element: (
              <Suspense fallback={<LoadingComponent />}>
                <Dashboard />
              </Suspense>
            ),
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
                    element: (
                      <Suspense fallback={<LoadingComponent />}>
                        <AccommodationList />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'new',
                    element: (
                      <Suspense fallback={<LoadingComponent />}>
                        <AccommodationNew />
                      </Suspense>
                    ),
                  },
                  {
                    path: ':id',
                    element: (
                      <Suspense fallback={<LoadingComponent />}>
                        <AccommodationDetail />
                      </Suspense>
                    ),
                  },
                  {
                    path: ':id/edit',
                    element: (
                      <Suspense fallback={<LoadingComponent />}>
                        <AccommodationEdit />
                      </Suspense>
                    ),
                  }
                ],
              },
              {
                path: 'rooms',
                element: <div>객실 관리 페이지</div>,
              },
              {
                path: 'categories',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <CategoryList />
                  </Suspense>
                ),
              },
              {
                path: 'amenities',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <AmenityList />
                  </Suspense>
                ),
              },
              {
                path: 'policies',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <CancellationPolicyList />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: 'reservations',
            children: [
              {
                path: '',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <ReservationList />
                  </Suspense>
                ),
              },
              {
                path: 'calendar',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <ReservationCalendar />
                  </Suspense>
                ),
              },
              {
                path: 'dashboard',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <ReservationDashboard />
                  </Suspense>
                ),
              },
              {
                path: ':id',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <ReservationDetail />
                  </Suspense>
                ),
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
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <MemberList />
                  </Suspense>
                ),
              },
              {
                path: 'members/blacklist',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <BlacklistManager />
                  </Suspense>
                ),
              },
              {
                path: 'privacy',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <PrivacyManager />
                  </Suspense>
                ),
              },
              {
                path: 'members/stats',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <CustomerStats />
                  </Suspense>
                ),
              },
              {
                path: 'members/:id',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <MemberDetail />
                  </Suspense>
                ),
              },
              {
                path: 'reviews',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <ReviewList />
                  </Suspense>
                ),
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
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <PromotionList />
                  </Suspense>
                ),
              },
              {
                path: 'promotions/new',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <PromotionNew />
                  </Suspense>
                ),
              },
              {
                path: 'promotions/:id',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <PromotionDetail />
                  </Suspense>
                ),
              },
              {
                path: 'promotions/:id/edit',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <PromotionEdit />
                  </Suspense>
                ),
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
            children: [
              {
                path: '',
                element: <Navigate to="/settings/general" replace />,
              },
              {
                path: 'general',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <GeneralSettings />
                  </Suspense>
                ),
              },
              {
                path: 'payment',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <PaymentSettings />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: 'reports',
            children: [
              {
                path: '',
                element: <Navigate to="/reports/dashboard" replace />,
              },
              {
                path: 'dashboard',
                element: (
                  <Suspense fallback={<LoadingComponent />}>
                    <ReportDashboard />
                  </Suspense>
                ),
              },
            ],
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