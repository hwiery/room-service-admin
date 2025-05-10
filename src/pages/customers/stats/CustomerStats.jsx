import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { format, parseISO, getMonth, getYear, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { customerApi } from '../../../api/customerApi';

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
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

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

// 목업 데이터 - 월별 회원 가입 통계
const mockSignupStats = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
  data: [25, 36, 42, 38, 51, 45]
};

// 목업 데이터 - 회원 등급 분포
const mockTierDistribution = {
  labels: ['일반', '실버', '골드', '플래티넘'],
  data: [65, 20, 10, 5],
  backgroundColor: ['#bdbdbd', '#42a5f5', '#ffa726', '#ab47bc']
};

// 목업 데이터 - 연령대 분포
const mockAgeDistribution = {
  labels: ['10대', '20대', '30대', '40대', '50대', '60대 이상'],
  data: [5, 25, 40, 20, 8, 2],
  backgroundColor: ['#4fc3f7', '#7986cb', '#4db6ac', '#81c784', '#fff176', '#ffb74d']
};

// 목업 데이터 - 성별 분포
const mockGenderDistribution = {
  labels: ['여성', '남성', '기타/미입력'],
  data: [48, 47, 5],
  backgroundColor: ['#f48fb1', '#90caf9', '#e0e0e0']
};

// 목업 데이터 - 회원 활동 지표
const mockActivityStats = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
  loginCount: [120, 150, 180, 200, 230, 210],
  reservationCount: [45, 60, 75, 90, 100, 95],
  reviewCount: [20, 25, 30, 35, 45, 40]
};

// 목업 데이터 - 지역별 회원 분포
const mockRegionDistribution = {
  labels: ['서울', '부산', '인천', '대구', '광주', '대전', '울산', '경기', '기타'],
  data: [35, 12, 8, 7, 5, 4, 3, 15, 11],
  backgroundColor: [
    '#ef5350', '#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', 
    '#26c6da', '#ffee58', '#8d6e63', '#bdbdbd'
  ]
};

/**
 * 고객 통계 페이지 컴포넌트
 */
const CustomerStats = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState(null);

  // API에서 통계 데이터 가져오기
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await customerApi.getCustomerStats(period, format(currentDate, 'yyyy-MM'));
        // setStats(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          // 간단한 목업 데이터로 통계 데이터 설정
          setStats({
            signupStats: mockSignupStats,
            tierDistribution: mockTierDistribution,
            ageDistribution: mockAgeDistribution,
            genderDistribution: mockGenderDistribution,
            activityStats: mockActivityStats,
            regionDistribution: mockRegionDistribution
          });
          
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('통계 데이터를 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [period, currentDate]);

  // 이전 기간으로 이동
  const handlePrevPeriod = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // 다음 기간으로 이동
  const handleNextPeriod = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // 현재 기간으로 이동
  const handleCurrentPeriod = () => {
    setCurrentDate(new Date());
  };

  // 기간 타입 변경 핸들러
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  // 현재 기간 표시 텍스트
  const getPeriodText = () => {
    const year = getYear(currentDate);
    const month = getMonth(currentDate) + 1;
    
    switch (period) {
      case 'monthly':
        return `${year}년 ${month}월`;
      case 'quarterly':
        const quarter = Math.floor((month - 1) / 3) + 1;
        return `${year}년 ${quarter}분기`;
      case 'yearly':
        return `${year}년`;
      default:
        return `${year}년 ${month}월`;
    }
  };

  // 회원 가입 추이 차트 데이터
  const signupChartData = {
    labels: stats?.signupStats.labels || [],
    datasets: [
      {
        label: '신규 가입자',
        data: stats?.signupStats.data || [],
        fill: false,
        borderColor: '#42a5f5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        tension: 0.1
      }
    ]
  };

  // 회원 가입 추이 차트 옵션
  const signupChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: '월별 회원 가입 추이'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '가입자 수'
        }
      }
    }
  };

  // 회원 활동 차트 데이터
  const activityChartData = {
    labels: stats?.activityStats.labels || [],
    datasets: [
      {
        label: '로그인 수',
        data: stats?.activityStats.loginCount || [],
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        borderColor: '#42a5f5',
        borderWidth: 1
      },
      {
        label: '예약 수',
        data: stats?.activityStats.reservationCount || [],
        backgroundColor: 'rgba(102, 187, 106, 0.2)',
        borderColor: '#66bb6a',
        borderWidth: 1
      },
      {
        label: '리뷰 수',
        data: stats?.activityStats.reviewCount || [],
        backgroundColor: 'rgba(255, 167, 38, 0.2)',
        borderColor: '#ffa726',
        borderWidth: 1
      }
    ]
  };

  // 회원 활동 차트 옵션
  const activityChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: '월별 회원 활동 통계'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '활동 수'
        }
      }
    }
  };

  // 회원 등급 분포 차트 데이터
  const tierChartData = {
    labels: stats?.tierDistribution.labels || [],
    datasets: [
      {
        data: stats?.tierDistribution.data || [],
        backgroundColor: stats?.tierDistribution.backgroundColor || [],
        borderWidth: 1
      }
    ]
  };

  // 회원 등급 분포 차트 옵션
  const tierChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: '회원 등급 분포'
      }
    }
  };

  // 연령대 분포 차트 데이터
  const ageChartData = {
    labels: stats?.ageDistribution.labels || [],
    datasets: [
      {
        data: stats?.ageDistribution.data || [],
        backgroundColor: stats?.ageDistribution.backgroundColor || [],
        borderWidth: 1
      }
    ]
  };

  // 연령대 분포 차트 옵션
  const ageChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: '연령대별 분포'
      }
    }
  };

  // 성별 분포 차트 데이터
  const genderChartData = {
    labels: stats?.genderDistribution.labels || [],
    datasets: [
      {
        data: stats?.genderDistribution.data || [],
        backgroundColor: stats?.genderDistribution.backgroundColor || [],
        borderWidth: 1
      }
    ]
  };

  // 성별 분포 차트 옵션
  const genderChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: '성별 분포'
      }
    }
  };

  // 지역별 분포 차트 데이터
  const regionChartData = {
    labels: stats?.regionDistribution.labels || [],
    datasets: [
      {
        data: stats?.regionDistribution.data || [],
        backgroundColor: stats?.regionDistribution.backgroundColor || [],
        borderWidth: 1
      }
    ]
  };

  // 지역별 분포 차트 옵션
  const regionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: '지역별 회원 분포'
      }
    }
  };

  return (
    <Container maxWidth="lg">
      {loading && <LinearProgress />}
      
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/customers/members')}
          sx={{ mb: 2 }}
        >
          회원 목록으로 돌아가기
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          고객 통계 분석
        </Typography>
      </Box>

      {/* 기간 선택 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={handlePrevPeriod}
                startIcon={<NavigateBeforeIcon />}
                sx={{ mr: 1 }}
              >
                이전
              </Button>
              <Typography variant="h6" sx={{ mx: 2 }}>
                {getPeriodText()}
              </Typography>
              <Button
                onClick={handleNextPeriod}
                endIcon={<NavigateNextIcon />}
                sx={{ ml: 1 }}
              >
                다음
              </Button>
              <Button
                onClick={handleCurrentPeriod}
                startIcon={<TodayIcon />}
                sx={{ ml: 2 }}
              >
                현재
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>기간 단위</InputLabel>
              <Select
                value={period}
                onChange={handlePeriodChange}
                label="기간 단위"
              >
                <MenuItem value="monthly">월별</MenuItem>
                <MenuItem value="quarterly">분기별</MenuItem>
                <MenuItem value="yearly">연도별</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* 회원 가입 추이 */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Line data={signupChartData} options={signupChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 회원 활동 통계 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Bar data={activityChartData} options={activityChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 회원 등급 분포 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Doughnut data={tierChartData} options={tierChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 지역별 회원 분포 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Pie data={regionChartData} options={regionChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 연령대 분포 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Bar data={ageChartData} options={ageChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 성별 분포 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Pie data={genderChartData} options={genderChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerStats; 