import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CalendarMonth as CalendarIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, parseISO, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';
import { reservationApi } from '../../api/reservationApi';

// 예약 상태 색상 정의
const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  checked_in: 'success',
  checked_out: 'default',
  cancelled: 'error'
};

// 예약 상태 한글 표시
const statusLabels = {
  pending: '대기',
  confirmed: '확정',
  checked_in: '체크인',
  checked_out: '체크아웃',
  cancelled: '취소'
};

// 목업 데이터
const mockReservations = [
  {
    id: 'R001',
    guestName: '김철수',
    accommodationName: '서울 그랜드 호텔',
    roomName: '디럭스 더블',
    checkInDate: '2023-06-15',
    checkOutDate: '2023-06-17',
    status: 'confirmed',
    totalPrice: 350000,
    paymentStatus: 'paid',
    createdAt: '2023-05-10T10:30:45',
    guestCount: 2,
    contactNumber: '010-1234-5678',
    guestEmail: 'kim@example.com'
  },
  {
    id: 'R002',
    guestName: '이영희',
    accommodationName: '부산 씨사이드 리조트',
    roomName: '오션뷰 스위트',
    checkInDate: '2023-06-20',
    checkOutDate: '2023-06-25',
    status: 'pending',
    totalPrice: 750000,
    paymentStatus: 'awaiting',
    createdAt: '2023-05-11T14:22:36',
    guestCount: 3,
    contactNumber: '010-9876-5432',
    guestEmail: 'lee@example.com'
  },
  {
    id: 'R003',
    guestName: '박지민',
    accommodationName: '제주 오션 파라다이스',
    roomName: '프리미엄 스위트',
    checkInDate: '2023-06-05',
    checkOutDate: '2023-06-08',
    status: 'checked_in',
    totalPrice: 680000,
    paymentStatus: 'paid',
    createdAt: '2023-05-01T09:15:22',
    guestCount: 4,
    contactNumber: '010-5555-1234',
    guestEmail: 'park@example.com'
  },
  {
    id: 'R004',
    guestName: '최서연',
    accommodationName: '서울 그랜드 호텔',
    roomName: '스탠다드 트윈',
    checkInDate: '2023-06-10',
    checkOutDate: '2023-06-12',
    status: 'cancelled',
    totalPrice: 240000,
    paymentStatus: 'refunded',
    createdAt: '2023-04-28T16:40:55',
    guestCount: 2,
    contactNumber: '010-2222-3333',
    guestEmail: 'choi@example.com'
  },
  {
    id: 'R005',
    guestName: '정현우',
    accommodationName: '강원 마운틴 리조트',
    roomName: '마운틴뷰 디럭스',
    checkInDate: '2023-06-22',
    checkOutDate: '2023-06-24',
    status: 'confirmed',
    totalPrice: 320000,
    paymentStatus: 'paid',
    createdAt: '2023-05-15T11:20:18',
    guestCount: 2,
    contactNumber: '010-7777-8888',
    guestEmail: 'jung@example.com'
  },
  {
    id: 'R006',
    guestName: '강민준',
    accommodationName: '제주 오션 파라다이스',
    roomName: '스탠다드 더블',
    checkInDate: '2023-06-01',
    checkOutDate: '2023-06-03',
    status: 'checked_out',
    totalPrice: 280000,
    paymentStatus: 'paid',
    createdAt: '2023-04-20T08:35:47',
    guestCount: 2,
    contactNumber: '010-4444-9999',
    guestEmail: 'kang@example.com'
  }
];

/**
 * 예약 목록 페이지 컴포넌트
 */
const ReservationList = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // 검색 및 필터링 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    startDate: null,
    endDate: null,
    paymentStatus: ''
  });

  // API에서 예약 목록 가져오기
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const params = {
        //   page: page + 1,
        //   limit: rowsPerPage,
        //   search: searchQuery,
        //   ...filters
        // };
        // const response = await reservationApi.getReservations(params);
        // setReservations(response.data.items);
        // setTotalCount(response.data.totalCount);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          // 검색 및 필터링 처리
          let filteredData = [...mockReservations];
          
          // 검색어 필터링
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredData = filteredData.filter(
              (reservation) =>
                reservation.id.toLowerCase().includes(query) ||
                reservation.guestName.toLowerCase().includes(query) ||
                reservation.accommodationName.toLowerCase().includes(query) ||
                reservation.roomName.toLowerCase().includes(query)
            );
          }
          
          // 상태 필터링
          if (filters.status) {
            filteredData = filteredData.filter(
              (reservation) => reservation.status === filters.status
            );
          }
          
          // 결제 상태 필터링
          if (filters.paymentStatus) {
            filteredData = filteredData.filter(
              (reservation) => reservation.paymentStatus === filters.paymentStatus
            );
          }
          
          // 날짜 필터링
          if (filters.startDate) {
            filteredData = filteredData.filter(
              (reservation) => new Date(reservation.checkInDate) >= new Date(filters.startDate)
            );
          }
          
          if (filters.endDate) {
            filteredData = filteredData.filter(
              (reservation) => new Date(reservation.checkOutDate) <= new Date(filters.endDate)
            );
          }
          
          // 페이지네이션 적용
          const start = page * rowsPerPage;
          const paginatedData = filteredData.slice(start, start + rowsPerPage);
          
          setReservations(paginatedData);
          setTotalCount(filteredData.length);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('예약 목록을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, [page, rowsPerPage, searchQuery, filters]);

  // 페이지 변경 핸들러
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 페이지당 행 수 변경 핸들러
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };

  // 필터 초기화 핸들러
  const handleClearFilters = () => {
    setFilters({
      status: '',
      startDate: null,
      endDate: null,
      paymentStatus: ''
    });
    setPage(0);
  };

  // 예약 상세 페이지 이동 핸들러
  const handleViewReservation = (id) => {
    navigate(`/reservations/${id}`);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    try {
      if (!dateString) return '';
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      if (!isValid(date)) return dateString;
      return format(date, 'yyyy-MM-dd');
    } catch (error) {
      return dateString;
    }
  };

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          예약 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          예약 목록 조회 및 관리
        </Typography>
      </Box>

      {/* 검색 및 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="예약번호, 고객명, 숙소명으로 검색"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant={filterOpen ? "contained" : "outlined"}
              startIcon={<FilterIcon />}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              필터
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<CalendarIcon />}
              onClick={() => navigate('/reservations/calendar')}
            >
              달력 보기
            </Button>
          </Grid>
          
          {filterOpen && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>예약 상태</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="예약 상태"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="pending">대기</MenuItem>
                    <MenuItem value="confirmed">확정</MenuItem>
                    <MenuItem value="checked_in">체크인</MenuItem>
                    <MenuItem value="checked_out">체크아웃</MenuItem>
                    <MenuItem value="cancelled">취소</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>결제 상태</InputLabel>
                  <Select
                    value={filters.paymentStatus}
                    onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                    label="결제 상태"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="paid">결제 완료</MenuItem>
                    <MenuItem value="awaiting">결제 대기</MenuItem>
                    <MenuItem value="refunded">환불 완료</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
                  <DatePicker
                    label="체크인 시작일"
                    value={filters.startDate}
                    onChange={(date) => handleFilterChange('startDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    inputFormat="yyyy-MM-dd"
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
                  <DatePicker
                    label="체크아웃 종료일"
                    value={filters.endDate}
                    onChange={(date) => handleFilterChange('endDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    inputFormat="yyyy-MM-dd"
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="text"
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                  >
                    필터 초기화
                  </Button>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* 예약 목록 테이블 */}
      <Card>
        {loading && <LinearProgress />}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>예약번호</TableCell>
                <TableCell>고객명</TableCell>
                <TableCell>숙소/객실</TableCell>
                <TableCell>체크인</TableCell>
                <TableCell>체크아웃</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>금액</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <TableRow key={reservation.id} hover>
                    <TableCell>{reservation.id}</TableCell>
                    <TableCell>{reservation.guestName}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{reservation.accommodationName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reservation.roomName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(reservation.checkInDate)}</TableCell>
                    <TableCell>{formatDate(reservation.checkOutDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[reservation.status]}
                        color={statusColors[reservation.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatPrice(reservation.totalPrice)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="상세보기">
                        <IconButton
                          size="small"
                          onClick={() => handleViewReservation(reservation.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : !loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      예약 데이터가 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="페이지당 행 수:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      </Card>
    </Container>
  );
};

export default ReservationList; 