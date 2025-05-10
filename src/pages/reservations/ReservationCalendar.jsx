import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import {
  format,
  addDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isWithinInterval,
  isBefore,
  isAfter,
  subMonths
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { reservationApi } from '../../api/reservationApi';
import { productApi } from '../../api';

// 목업 데이터
const mockAccommodations = [
  { id: 'acc1', name: '서울 그랜드 호텔' },
  { id: 'acc2', name: '부산 씨사이드 리조트' },
  { id: 'acc3', name: '제주 오션 파라다이스' },
  { id: 'acc4', name: '강원 마운틴 리조트' }
];

const mockCalendarData = [
  {
    id: 'R001',
    guestName: '김철수',
    accommodationId: 'acc1',
    accommodationName: '서울 그랜드 호텔',
    roomName: '디럭스 더블',
    checkInDate: '2023-06-15',
    checkOutDate: '2023-06-17',
    status: 'confirmed'
  },
  {
    id: 'R002',
    guestName: '이영희',
    accommodationId: 'acc2',
    accommodationName: '부산 씨사이드 리조트',
    roomName: '오션뷰 스위트',
    checkInDate: '2023-06-20',
    checkOutDate: '2023-06-25',
    status: 'pending'
  },
  {
    id: 'R003',
    guestName: '박지민',
    accommodationId: 'acc3',
    accommodationName: '제주 오션 파라다이스',
    roomName: '프리미엄 스위트',
    checkInDate: '2023-06-05',
    checkOutDate: '2023-06-08',
    status: 'checked_in'
  },
  {
    id: 'R004',
    guestName: '최서연',
    accommodationId: 'acc1',
    accommodationName: '서울 그랜드 호텔',
    roomName: '스탠다드 트윈',
    checkInDate: '2023-06-10',
    checkOutDate: '2023-06-12',
    status: 'cancelled'
  },
  {
    id: 'R005',
    guestName: '정현우',
    accommodationId: 'acc4',
    accommodationName: '강원 마운틴 리조트',
    roomName: '마운틴뷰 디럭스',
    checkInDate: '2023-06-22',
    checkOutDate: '2023-06-24',
    status: 'confirmed'
  },
  {
    id: 'R006',
    guestName: '강민준',
    accommodationId: 'acc3',
    accommodationName: '제주 오션 파라다이스',
    roomName: '스탠다드 더블',
    checkInDate: '2023-06-01',
    checkOutDate: '2023-06-03',
    status: 'checked_out'
  }
];

// 예약 상태 색상 정의
const statusColors = {
  pending: '#ffa726', // orange
  confirmed: '#29b6f6', // light blue
  checked_in: '#66bb6a', // green
  checked_out: '#bdbdbd', // grey
  cancelled: '#ef5350' // red
};

/**
 * 예약 달력 뷰 페이지 컴포넌트
 */
const ReservationCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAccommodation, setSelectedAccommodation] = useState('');
  const [accommodations, setAccommodations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 선택된 달의 날짜 배열 계산
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  // API에서 숙소 목록 가져오기
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await productApi.getAccommodations();
        // setAccommodations(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setAccommodations(mockAccommodations);
      } catch (error) {
        console.error('숙소 목록을 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchAccommodations();
  }, []);

  // API에서 예약 달력 데이터 가져오기
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        
        const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
        const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await reservationApi.getReservationsByDate(
        //   startDate,
        //   endDate,
        //   selectedAccommodation || null
        // );
        // setReservations(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          // 선택된 숙소에 따라 필터링
          let filteredReservations = [...mockCalendarData];
          
          if (selectedAccommodation) {
            filteredReservations = filteredReservations.filter(
              (reservation) => reservation.accommodationId === selectedAccommodation
            );
          }
          
          // 선택된 달에 해당하는 예약만 필터링
          filteredReservations = filteredReservations.filter((reservation) => {
            const checkIn = parseISO(reservation.checkInDate);
            const checkOut = parseISO(reservation.checkOutDate);
            
            // 해당 월에 체크인 또는 체크아웃이 있는 예약, 또는 해당 월 전에 체크인하고 해당 월 이후에 체크아웃하는 예약
            return (
              (isSameMonth(checkIn, currentDate) || isSameMonth(checkOut, currentDate)) ||
              (isBefore(checkIn, startOfMonth(currentDate)) && isAfter(checkOut, endOfMonth(currentDate)))
            );
          });
          
          setReservations(filteredReservations);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('예약 달력 데이터를 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentDate, selectedAccommodation]);

  // 같은 월인지 확인하는 함수
  const isSameMonth = (date1, date2) => {
    return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
  };

  // 특정 날짜의 예약 목록 가져오기
  const getReservationsForDay = (date) => {
    return reservations.filter((reservation) => {
      const checkIn = parseISO(reservation.checkInDate);
      const checkOut = parseISO(reservation.checkOutDate);
      
      return isWithinInterval(date, { start: checkIn, end: addDays(checkOut, -1) });
    });
  };

  // 날짜 포맷팅 함수
  const formatDate = (date, formatStr = 'yyyy년 MM월 dd일') => {
    return format(date, formatStr, { locale: ko });
  };

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // 오늘로 이동
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // 숙소 선택 변경 핸들러
  const handleAccommodationChange = (event) => {
    setSelectedAccommodation(event.target.value);
  };

  // 예약 클릭 핸들러
  const handleReservationClick = (reservationId) => {
    navigate(`/reservations/${reservationId}`);
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
          예약 달력
        </Typography>
        <Typography variant="body1" color="text.secondary">
          날짜별 예약 현황을 확인할 수 있습니다.
        </Typography>
      </Box>

      {/* 달력 컨트롤 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={handlePrevMonth}
                startIcon={<NavigateBeforeIcon />}
                sx={{ mr: 1 }}
              >
                이전
              </Button>
              <Typography variant="h6" sx={{ mx: 2 }}>
                {formatDate(currentDate, 'yyyy년 MM월')}
              </Typography>
              <Button
                onClick={handleNextMonth}
                endIcon={<NavigateNextIcon />}
                sx={{ ml: 1 }}
              >
                다음
              </Button>
              <Button
                onClick={handleToday}
                startIcon={<TodayIcon />}
                sx={{ ml: 2 }}
              >
                오늘
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>숙소 선택</InputLabel>
              <Select
                value={selectedAccommodation}
                onChange={handleAccommodationChange}
                label="숙소 선택"
              >
                <MenuItem value="">전체 숙소</MenuItem>
                {accommodations.map((accommodation) => (
                  <MenuItem key={accommodation.id} value={accommodation.id}>
                    {accommodation.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {/* 달력 영역 */}
      <Card>
        <Box sx={{ p: 2 }}>
          {/* 요일 헤더 */}
          <Grid container>
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <Grid item xs={12 / 7} key={index}>
                <Box
                  sx={{
                    p: 1,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    borderBottom: 1,
                    borderColor: 'divider',
                    color: index === 0 ? 'error.main' : index === 6 ? 'primary.main' : 'inherit'
                  }}
                >
                  {day}
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* 달력 그리드 */}
          <Grid container>
            {/* 이전 달의 날짜로 시작 위치 조정 */}
            {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, index) => (
              <Grid item xs={12 / 7} key={`prev-${index}`}>
                <Box
                  sx={{
                    height: 120,
                    p: 1,
                    bgcolor: 'grey.100',
                    border: 1,
                    borderColor: 'divider'
                  }}
                />
              </Grid>
            ))}

            {/* 현재 달의 날짜들 */}
            {daysInMonth.map((date, index) => {
              const dayReservations = getReservationsForDay(date);
              const isToday = isSameDay(date, new Date());

              return (
                <Grid item xs={12 / 7} key={index}>
                  <Box
                    sx={{
                      height: 120,
                      p: 1,
                      border: 1,
                      borderColor: 'divider',
                      bgcolor: isToday ? 'primary.light' : 'background.paper',
                      overflow: 'auto'
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isToday ? 'bold' : 'normal',
                        color: 
                          date.getDay() === 0 
                            ? 'error.main' 
                            : date.getDay() === 6 
                              ? 'primary.main' 
                              : 'inherit'
                      }}
                    >
                      {format(date, 'd')}
                    </Typography>

                    {/* 예약 표시 */}
                    {dayReservations.map((reservation) => {
                      const isCheckIn = isSameDay(parseISO(reservation.checkInDate), date);
                      const isCheckOut = isSameDay(parseISO(reservation.checkOutDate), date);

                      return (
                        <Tooltip
                          key={reservation.id}
                          title={`${reservation.guestName} - ${reservation.roomName} (${format(parseISO(reservation.checkInDate), 'MM/dd')} ~ ${format(parseISO(reservation.checkOutDate), 'MM/dd')})`}
                          arrow
                        >
                          <Box
                            onClick={() => handleReservationClick(reservation.id)}
                            sx={{
                              mt: 0.5,
                              p: 0.5,
                              borderRadius: 1,
                              bgcolor: statusColors[reservation.status],
                              color: 'white',
                              fontSize: '0.7rem',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              borderLeft: isCheckIn ? 3 : 0,
                              borderRight: isCheckOut ? 3 : 0,
                              borderColor: 'background.paper'
                            }}
                          >
                            {reservation.guestName}
                          </Box>
                        </Tooltip>
                      );
                    })}
                  </Box>
                </Grid>
              );
            })}

            {/* 다음 달의 날짜로 끝 위치 조정 */}
            {Array.from({ length: 6 - endOfMonth(currentDate).getDay() }).map((_, index) => (
              <Grid item xs={12 / 7} key={`next-${index}`}>
                <Box
                  sx={{
                    height: 120,
                    p: 1,
                    bgcolor: 'grey.100',
                    border: 1,
                    borderColor: 'divider'
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>

      {/* 범례 */}
      <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="subtitle2">범례:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 16, height: 16, mr: 1, bgcolor: statusColors.pending, borderRadius: 1 }} />
          <Typography variant="body2">대기</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 16, height: 16, mr: 1, bgcolor: statusColors.confirmed, borderRadius: 1 }} />
          <Typography variant="body2">확정</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 16, height: 16, mr: 1, bgcolor: statusColors.checked_in, borderRadius: 1 }} />
          <Typography variant="body2">체크인</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 16, height: 16, mr: 1, bgcolor: statusColors.checked_out, borderRadius: 1 }} />
          <Typography variant="body2">체크아웃</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 16, height: 16, mr: 1, bgcolor: statusColors.cancelled, borderRadius: 1 }} />
          <Typography variant="body2">취소</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ReservationCalendar; 