import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  LinearProgress, 
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Hotel as HotelIcon,
  EventNote as EventNoteIcon,
  AttachMoney as AttachMoneyIcon,
  Visibility as VisibilityIcon,
  Assignment as AssignmentIcon,
  WarningAmber as WarningAmberIcon
} from '@mui/icons-material';

// 임시 데이터 - 실제로는 API에서 가져와야 함
const mockData = {
  stats: {
    newReservations: 12,
    reservationRevenue: 2450000,
    newMembers: 5,
    pendingReviews: 8,
    reportedReviews: 2,
    inquiries: 3
  },
  recentReservations: [
    { id: 'R123456', accommodation: '서울 시그니처 호텔', customer: '김철수', date: '2023-05-10', status: '예약완료' },
    { id: 'R123457', accommodation: '부산 해변 리조트', customer: '이영희', date: '2023-05-10', status: '예약완료' },
    { id: 'R123458', accommodation: '제주 올레 펜션', customer: '박지민', date: '2023-05-09', status: '이용완료' },
    { id: 'R123459', accommodation: '강원도 힐링 캐빈', customer: '최동욱', date: '2023-05-09', status: '취소요청' }
  ],
  recentMembers: [
    { id: 'M123456', name: '한지연', joinDate: '2023-05-10', type: '일반회원' },
    { id: 'M123457', name: '정수민', joinDate: '2023-05-10', type: '일반회원' },
    { id: 'M123458', name: '강다희', joinDate: '2023-05-09', type: '소셜회원' }
  ],
  recentReviews: [
    { id: 'V123456', accommodation: '서울 시그니처 호텔', author: '박민수', rating: 4.5, status: '승인대기' },
    { id: 'V123457', accommodation: '부산 해변 리조트', author: '김영희', rating: 5.0, status: '승인대기' },
    { id: 'V123458', accommodation: '제주 올레 펜션', author: '이태호', rating: 3.0, status: '승인대기' }
  ],
  weeklyStats: {
    reservations: [8, 10, 12, 15, 11, 13, 12],
    revenue: [1200000, 1500000, 1800000, 2200000, 1600000, 1900000, 1750000],
    dates: ['05-04', '05-05', '05-06', '05-07', '05-08', '05-09', '05-10']
  }
};

// 상태 컬러 매핑
const getStatusColor = (status) => {
  switch(status) {
    case '예약완료': return 'success';
    case '이용완료': return 'info';
    case '취소요청': return 'warning';
    case '취소완료': return 'error';
    case '승인대기': return 'warning';
    default: return 'default';
  }
};

/**
 * 대시보드 페이지 컴포넌트
 */
const Dashboard = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  
  // 실제로는 API에서 데이터 로드
  useEffect(() => {
    // 실제로는 API 호출
    // const fetchData = async () => {
    //   try {
    //     const response = await dashboardApi.getSummary();
    //     setData(response.data);
    //   } catch (error) {
    //     console.error('대시보드 데이터 로드 실패:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchData();
    
    // 임시 데이터 로드
    setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // 로딩 중 표시
  if (isLoading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          대시보드 데이터를 불러오는 중입니다...
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        대시보드
      </Typography>
      
      {/* KPI 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 120,
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div">오늘 신규 예약</Typography>
              <EventNoteIcon />
            </Box>
            <Typography variant="h3" component="div" sx={{ mt: 2 }}>
              {data.stats.newReservations}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 120,
              backgroundColor: theme.palette.success.light,
              color: theme.palette.success.contrastText
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div">오늘 예약 매출</Typography>
              <AttachMoneyIcon />
            </Box>
            <Typography variant="h5" component="div" sx={{ mt: 2 }}>
              {data.stats.reservationRevenue.toLocaleString()}원
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 120,
              backgroundColor: theme.palette.info.light,
              color: theme.palette.info.contrastText
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div">오늘 신규 회원</Typography>
              <PersonIcon />
            </Box>
            <Typography variant="h3" component="div" sx={{ mt: 2 }}>
              {data.stats.newMembers}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 120,
              backgroundColor: theme.palette.warning.light,
              color: theme.palette.warning.contrastText
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div">승인 대기 리뷰</Typography>
              <VisibilityIcon />
            </Box>
            <Typography variant="h3" component="div" sx={{ mt: 2 }}>
              {data.stats.pendingReviews}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 120,
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.contrastText
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div">신고된 리뷰</Typography>
              <WarningAmberIcon />
            </Box>
            <Typography variant="h3" component="div" sx={{ mt: 2 }}>
              {data.stats.reportedReviews}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 120,
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.secondary.contrastText
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div">미답변 문의</Typography>
              <AssignmentIcon />
            </Box>
            <Typography variant="h3" component="div" sx={{ mt: 2 }}>
              {data.stats.inquiries}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* 최근 활동 카드 */}
      <Grid container spacing={3}>
        {/* 최근 예약 */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader 
              title="최근 예약" 
              titleTypographyProps={{ variant: 'h6' }}
              action={<Chip label="더보기" component="a" href="/reservations" clickable variant="outlined" size="small" />}
            />
            <CardContent sx={{ pt: 0 }}>
              <List>
                {data.recentReservations.map((reservation, index) => (
                  <React.Fragment key={reservation.id}>
                    <ListItem alignItems="flex-start" disablePadding sx={{ py: 1 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">
                              {reservation.accommodation}
                            </Typography>
                            <Chip 
                              label={reservation.status} 
                              size="small" 
                              color={getStatusColor(reservation.status)} 
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {reservation.customer}
                            </Typography>
                            {` — ${reservation.date}`}
                          </>
                        }
                      />
                    </ListItem>
                    {index < data.recentReservations.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 최근 가입 회원 */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader 
              title="최근 가입 회원" 
              titleTypographyProps={{ variant: 'h6' }}
              action={<Chip label="더보기" component="a" href="/customers/members" clickable variant="outlined" size="small" />}
            />
            <CardContent sx={{ pt: 0 }}>
              <List>
                {data.recentMembers.map((member, index) => (
                  <React.Fragment key={member.id}>
                    <ListItem alignItems="flex-start" disablePadding sx={{ py: 1 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">
                              {member.name}
                            </Typography>
                            <Chip 
                              label={member.type} 
                              size="small" 
                              color="default" 
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {member.id}
                            </Typography>
                            {` — ${member.joinDate} 가입`}
                          </>
                        }
                      />
                    </ListItem>
                    {index < data.recentMembers.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 승인 대기 리뷰 */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader 
              title="승인 대기 리뷰" 
              titleTypographyProps={{ variant: 'h6' }}
              action={<Chip label="더보기" component="a" href="/customers/reviews" clickable variant="outlined" size="small" />}
            />
            <CardContent sx={{ pt: 0 }}>
              <List>
                {data.recentReviews.map((review, index) => (
                  <React.Fragment key={review.id}>
                    <ListItem alignItems="flex-start" disablePadding sx={{ py: 1 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">
                              {review.accommodation}
                            </Typography>
                            <Chip 
                              label={`★ ${review.rating}`} 
                              size="small" 
                              color={review.rating >= 4 ? "success" : "warning"} 
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {review.author}
                            </Typography>
                            {` — ${review.status}`}
                          </>
                        }
                      />
                    </ListItem>
                    {index < data.recentReviews.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 