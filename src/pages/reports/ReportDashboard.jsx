import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { 
  Chart as ChartJS, 
  ArcElement, 
  LineElement, 
  BarElement, 
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend 
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Chart.js 컴포넌트 등록
ChartJS.register(
  ArcElement, 
  LineElement, 
  BarElement, 
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

/**
 * 탭 패널 컴포넌트
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * 데이터 대시보드 페이지 컴포넌트
 */
const ReportDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [period, setPeriod] = useState('month');
  const [dashboardData, setDashboardData] = useState({
    salesData: [],
    reservationData: [],
    occupancyData: [],
    channelData: [],
    userStats: {
      totalUsers: 0,
      newUsers: 0,
      activeUsers: 0
    },
    financialStats: {
      totalRevenue: 0,
      avgOrderValue: 0,
      refundRate: 0
    }
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 대시보드 데이터 로드 (목업)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await api.getDashboardData(period);
        // setDashboardData(response.data);
        
        // 목업 데이터
        setTimeout(() => {
          const mockData = generateMockData(period);
          setDashboardData(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('대시보드 데이터를 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
        showSnackbar('데이터를 불러올 수 없습니다', 'error');
      }
    };

    fetchDashboardData();
  }, [period]);

  // 기간 변경 핸들러
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 스낵바 표시 함수
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // 스낵바 닫기 핸들러
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 목업 데이터 생성 함수
  const generateMockData = (period) => {
    // 매출 데이터
    const salesData = {
      labels: period === 'week' 
        ? ['월', '화', '수', '목', '금', '토', '일']
        : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'].slice(0, period === 'quarter' ? 4 : 12),
      datasets: [
        {
          label: '매출',
          data: period === 'week'
            ? [320000, 420000, 380000, 450000, 650000, 720000, 540000]
            : period === 'quarter'
              ? [4500000, 5200000, 4800000, 6300000]
              : [1800000, 2100000, 3500000, 2800000, 3200000, 4500000, 5800000, 5200000, 4300000, 3800000, 4200000, 5500000],
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        }
      ]
    };

    // 예약 데이터
    const reservationData = {
      labels: period === 'week' 
        ? ['월', '화', '수', '목', '금', '토', '일']
        : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'].slice(0, period === 'quarter' ? 4 : 12),
      datasets: [
        {
          label: '예약 건수',
          data: period === 'week'
            ? [12, 19, 15, 22, 28, 35, 25]
            : period === 'quarter'
              ? [110, 135, 128, 158]
              : [35, 42, 85, 62, 75, 98, 112, 105, 88, 72, 83, 105],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }
      ]
    };

    // 객실 점유율
    const occupancyData = {
      labels: ['스탠다드', '디럭스', '슈페리어', '스위트'],
      datasets: [
        {
          label: '객실 점유율',
          data: [65, 78, 85, 55],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    // 판매 채널별 예약 비율
    const channelData = {
      labels: ['자사 웹사이트', '모바일 앱', '여행사', '야놀자', '여기어때', '기타'],
      datasets: [
        {
          label: '예약 채널 비율',
          data: [35, 25, 15, 10, 10, 5],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return {
      salesData,
      reservationData,
      occupancyData,
      channelData,
      userStats: {
        totalUsers: 8750,
        newUsers: 342,
        activeUsers: 2150
      },
      financialStats: {
        totalRevenue: period === 'week' ? 3480000 : period === 'quarter' ? 20800000 : 46700000,
        avgOrderValue: 385000,
        refundRate: 2.5
      }
    };
  };

  // 숫자 포맷팅 함수
  const formatNumber = (number) => {
    return new Intl.NumberFormat('ko-KR').format(number);
  };

  // 금액 포맷팅 함수
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  return (
    <Container maxWidth="lg">
      {loading && <LinearProgress />}
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          데이터 대시보드
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          주요 KPI 및 성과 지표를 확인합니다.
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="매출 정보" />
          <Tab label="예약 정보" />
          <Tab label="고객 정보" />
        </Tabs>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>기간</InputLabel>
          <Select
            value={period}
            onChange={handlePeriodChange}
            label="기간"
          >
            <MenuItem value="week">최근 7일</MenuItem>
            <MenuItem value="month">최근 12개월</MenuItem>
            <MenuItem value="quarter">최근 4분기</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* 매출 정보 탭 */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  총 매출
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {formatCurrency(dashboardData.financialStats.totalRevenue)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  평균 주문 금액
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {formatCurrency(dashboardData.financialStats.avgOrderValue)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  환불율
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {dashboardData.financialStats.refundRate}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardHeader title="매출 추이" />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Line 
                    data={dashboardData.salesData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="채널별 예약 비율" />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Pie 
                    data={dashboardData.channelData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="객실 타입별 점유율" />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Pie 
                    data={dashboardData.occupancyData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* 예약 정보 탭 */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="예약 추이" />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Bar 
                    data={dashboardData.reservationData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* 고객 정보 탭 */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  총 회원 수
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {formatNumber(dashboardData.userStats.totalUsers)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  신규 회원
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {formatNumber(dashboardData.userStats.newUsers)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  활성 회원
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {formatNumber(dashboardData.userStats.activeUsers)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* 알림 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReportDashboard; 