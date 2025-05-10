import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography,
  Divider,
  TextField,
  TableCell
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  EventNote as EventNoteIcon,
  Person as PersonIcon,
  Hotel as HotelIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { reservationApi } from '../../api/reservationApi';

// Chart.js import
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// 목업 데이터 - 월별 통계
const mockMonthlyStats = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
  reservations: [42, 65, 73, 58, 82, 91],
  revenue: [5600000, 8700000, 9500000, 7600000, 10800000, 12500000],
  occupancyRates: [65, 72, 78, 68, 85, 92]
};

// 목업 데이터 - 예약 상태 분포
const mockStatusDistribution = {
  labels: ['확정', '체크인', '체크아웃', '취소', '대기'],
  data: [45, 15, 25, 10, 5],
  backgroundColor: ['#29b6f6', '#66bb6a', '#bdbdbd', '#ef5350', '#ffa726']
};

// 목업 데이터 - 숙소별 매출
const mockAccommodationRevenue = {
  labels: ['서울 그랜드 호텔', '부산 씨사이드 리조트', '제주 오션 파라다이스', '강원 마운틴 리조트'],
  data: [35, 25, 30, 10],
  backgroundColor: ['#42a5f5', '#26c6da', '#66bb6a', '#ffa726']
};

// 목업 데이터 - 오늘의 요약
const mockTodaySummary = {
  todayCheckIns: 12,
  todayCheckOuts: 8,
  todayNewReservations: 15,
  todayRevenue: 2800000,
  todayCancellations: 2,
  upcomingCheckIns: 24
};

/**
 * 예약 통계 대시보드 페이지 컴포넌트
 */
const ReservationDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [startDate, setStartDate] = useState(startOfMonth(subMonths(new Date(), 5)));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [statsData, setStatsData] = useState(null);
  const [todaySummary, setTodaySummary] = useState(null);
  const [statusDistribution, setStatusDistribution] = useState(null);
  const [accommodationRevenue, setAccommodationRevenue] = useState(null);

  // API에서 통계 데이터 가져오기
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await reservationApi.getReservationStats(
        //   period,
        //   format(startDate, 'yyyy-MM-dd'),
        //   format(endDate, 'yyyy-MM-dd')
        // );
        // setStatsData(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          setStatsData(mockMonthlyStats);
          setTodaySummary(mockTodaySummary);
          setStatusDistribution(mockStatusDistribution);
          setAccommodationRevenue(mockAccommodationRevenue);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('통계 데이터를 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [period, startDate, endDate]);

  // 기간 선택 변경 핸들러
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  // 숫자 포맷팅 함수
  const formatNumber = (number) => {
    return new Intl.NumberFormat('ko-KR').format(number);
  };

  // 월별 예약 및 매출 차트 데이터
  const monthlyChartData = {
    labels: statsData?.labels || [],
    datasets: [
      {
        label: '예약 건수',
        data: statsData?.reservations || [],
        borderColor: '#42a5f5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        yAxisID: 'y'
      },
      {
        label: '매출 (백만원)',
        data: statsData?.revenue ? statsData.revenue.map(val => val / 1000000) : [],
        borderColor: '#66bb6a',
        backgroundColor: 'rgba(102, 187, 106, 0.2)',
        yAxisID: 'y1'
      }
    ]
  };

  // 월별 예약 및 매출 차트 옵션
  const monthlyChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: '월별 예약 및 매출 추이'
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: '예약 건수'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: '매출 (백만원)'
        }
      }
    }
  };

  // 객실 점유율 차트 데이터
  const occupancyChartData = {
    labels: statsData?.labels || [],
    datasets: [
      {
        label: '객실 점유율 (%)',
        data: statsData?.occupancyRates || [],
        backgroundColor: '#ff7043',
        borderColor: '#ff5722',
        borderWidth: 1
      }
    ]
  };

  // 객실 점유율 차트 옵션
  const occupancyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: '월별 객실 점유율'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: '점유율 (%)'
        }
      }
    }
  };

  // 예약 상태 분포 차트 데이터
  const statusChartData = {
    labels: statusDistribution?.labels || [],
    datasets: [
      {
        data: statusDistribution?.data || [],
        backgroundColor: statusDistribution?.backgroundColor || [],
        borderWidth: 1
      }
    ]
  };

  // 예약 상태 분포 차트 옵션
  const statusChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: '예약 상태 분포'
      }
    }
  };

  // 숙소별 매출 차트 데이터
  const accommodationChartData = {
    labels: accommodationRevenue?.labels || [],
    datasets: [
      {
        data: accommodationRevenue?.data || [],
        backgroundColor: accommodationRevenue?.backgroundColor || [],
        borderWidth: 1
      }
    ]
  };

  // 숙소별 매출 차트 옵션
  const accommodationChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: '숙소별 매출 비중 (%)'
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/reservations')}
          sx={{ mb: 2 }}
        >
          목록으로 돌아가기
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          예약 통계 대시보드
        </Typography>
      </Box>

      {/* 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>기간 선택</InputLabel>
              <Select
                value={period}
                onChange={handlePeriodChange}
                label="기간 선택"
              >
                <MenuItem value="daily">일별</MenuItem>
                <MenuItem value="weekly">주별</MenuItem>
                <MenuItem value="monthly">월별</MenuItem>
                <MenuItem value="yearly">연별</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
              <DatePicker
                label="시작일"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                inputFormat="yyyy-MM-dd"
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
              <DatePicker
                label="종료일"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                inputFormat="yyyy-MM-dd"
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {/* 오늘의 요약 카드 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventNoteIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">체크인/체크아웃</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">오늘 체크인</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatNumber(todaySummary?.todayCheckIns || 0)}건
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">오늘 체크아웃</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatNumber(todaySummary?.todayCheckOuts || 0)}건
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">다가오는 체크인</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatNumber(todaySummary?.upcomingCheckIns || 0)}건
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">예약 현황</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">신규 예약</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatNumber(todaySummary?.todayNewReservations || 0)}건
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">취소</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatNumber(todaySummary?.todayCancellations || 0)}건
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">매출 현황</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">오늘 매출</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatPrice(todaySummary?.todayRevenue || 0)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 차트 영역 */}
      <Grid container spacing={3}>
        {/* 월별 예약 및 매출 차트 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Line data={monthlyChartData} options={monthlyChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 객실 점유율 차트 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Bar data={occupancyChartData} options={occupancyChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 예약 상태 분포 파이 차트 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Pie data={statusChartData} options={statusChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 숙소별 매출 파이 차트 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Pie data={accommodationChartData} options={accommodationChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReservationDashboard; 