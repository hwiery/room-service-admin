import React, { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import routes from './routes';
import cdnConfig from './config/cdnConfig';
import { initSecurity } from './utils/security';

// React DevTools에서 CDN 설정 확인 가능하도록 설정
if (process.env.NODE_ENV !== 'production') {
  window.__CDN_CONFIG__ = cdnConfig;
}

// Theme settings
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#4791db',
      dark: '#115293',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
  },
  typography: {
    fontFamily: [
      '"Noto Sans KR"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  // Component style overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
});

// Create router
const router = createBrowserRouter(routes);

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 창이 포커스될 때 자동으로 다시 가져오지 않음
      retry: 1, // 실패 시 1번만 재시도
      staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 "신선"하게 유지 (캐시 사용)
      cacheTime: 10 * 60 * 1000, // 10분 동안 비활성 쿼리 결과를 메모리에 유지
    },
  },
});

/**
 * Application root component
 */
function App() {
  // 애플리케이션 시작 시 보안 초기화
  useEffect(() => {
    initSecurity();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 