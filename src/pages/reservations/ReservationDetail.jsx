import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Money as MoneyIcon,
  Event as EventIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { reservationApi } from '../../api/reservationApi';

// 예약 상태 색상 및 라벨 정의
const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  checked_in: 'success',
  checked_out: 'default',
  cancelled: 'error'
};

const statusLabels = {
  pending: '대기',
  confirmed: '확정',
  checked_in: '체크인',
  checked_out: '체크아웃',
  cancelled: '취소'
};

// 결제 상태 색상 및 라벨 정의
const paymentStatusColors = {
  paid: 'success',
  awaiting: 'warning',
  refunded: 'error'
};

const paymentStatusLabels = {
  paid: '결제 완료',
  awaiting: '결제 대기',
  refunded: '환불 완료'
};

// 목업 데이터
const mockReservationDetails = {
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
  guestEmail: 'kim@example.com',
  specialRequests: '늦은 체크인 예정입니다. 저녁 8시경 도착할 예정입니다.',
  paymentMethod: '신용카드',
  cancellationPolicy: '체크인 3일 전까지 무료 취소 가능',
  roomDetails: {
    roomType: '디럭스 더블',
    bedType: '퀸 사이즈 더블 베드 1개',
    maxOccupancy: 2,
    amenities: ['에어컨', '무료 와이파이', '미니바', '욕실용품']
  },
  priceBreakdown: [
    { description: '객실 요금 (2박)', amount: 320000 },
    { description: '부가세 (10%)', amount: 32000 },
    { description: '조식 추가', amount: 30000 },
    { description: '할인', amount: -32000 }
  ]
};

/**
 * 예약 상세 정보 페이지 컴포넌트
 */
const ReservationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // API에서 예약 상세 정보 가져오기
  useEffect(() => {
    const fetchReservationDetail = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await reservationApi.getReservation(id);
        // setReservation(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          setReservation({ 
            ...mockReservationDetails,
            id // 실제 URL의 ID 사용
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('예약 상세 정보를 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
        showSnackbar('예약 정보를 불러올 수 없습니다', 'error');
      }
    };

    fetchReservationDetail();
  }, [id]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'yyyy년 MM월 dd일');
    } catch (error) {
      return dateString;
    }
  };

  // 시간 포맷팅 함수
  const formatDateTime = (dateTimeString) => {
    try {
      return format(parseISO(dateTimeString), 'yyyy년 MM월 dd일 HH:mm');
    } catch (error) {
      return dateTimeString;
    }
  };

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
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

  // 상태 변경 다이얼로그 열기 핸들러
  const handleOpenStatusDialog = () => {
    setNewStatus(reservation.status);
    setStatusDialogOpen(true);
  };

  // 상태 변경 다이얼로그 닫기 핸들러
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  // 상태 변경 핸들러
  const handleStatusChange = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await reservationApi.updateReservationStatus(id, newStatus);
      
      // 백엔드 구현 전까지 목업 처리
      console.log(`예약 상태 변경: ${id}, ${newStatus}`);
      
      // 클라이언트 측 상태 업데이트
      setReservation(prev => ({ ...prev, status: newStatus }));
      
      setStatusDialogOpen(false);
      showSnackbar('예약 상태가 변경되었습니다');
    } catch (error) {
      console.error('예약 상태 변경 중 오류가 발생했습니다:', error);
      showSnackbar('예약 상태 변경 실패', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 체크인 처리 핸들러
  const handleCheckIn = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await reservationApi.checkIn(id);
      
      // 백엔드 구현 전까지 목업 처리
      console.log(`예약 체크인: ${id}`);
      
      // 클라이언트 측 상태 업데이트
      setReservation(prev => ({ ...prev, status: 'checked_in' }));
      
      showSnackbar('체크인 처리가 완료되었습니다');
    } catch (error) {
      console.error('체크인 처리 중 오류가 발생했습니다:', error);
      showSnackbar('체크인 처리 실패', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 체크아웃 처리 핸들러
  const handleCheckOut = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await reservationApi.checkOut(id);
      
      // 백엔드 구현 전까지 목업 처리
      console.log(`예약 체크아웃: ${id}`);
      
      // 클라이언트 측 상태 업데이트
      setReservation(prev => ({ ...prev, status: 'checked_out' }));
      
      showSnackbar('체크아웃 처리가 완료되었습니다');
    } catch (error) {
      console.error('체크아웃 처리 중 오류가 발생했습니다:', error);
      showSnackbar('체크아웃 처리 실패', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 취소 다이얼로그 열기 핸들러
  const handleOpenCancelDialog = () => {
    setCancelReason('');
    setCancelDialogOpen(true);
  };

  // 취소 다이얼로그 닫기 핸들러
  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
  };

  // 예약 취소 핸들러
  const handleCancelReservation = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await reservationApi.cancelReservation(id, { reason: cancelReason });
      
      // 백엔드 구현 전까지 목업 처리
      console.log(`예약 취소: ${id}, 사유: ${cancelReason}`);
      
      // 클라이언트 측 상태 업데이트
      setReservation(prev => ({ 
        ...prev, 
        status: 'cancelled',
        paymentStatus: 'refunded'
      }));
      
      setCancelDialogOpen(false);
      showSnackbar('예약이 취소되었습니다');
    } catch (error) {
      console.error('예약 취소 중 오류가 발생했습니다:', error);
      showSnackbar('예약 취소 실패', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 상태에 따른 가능한 액션 결정
  const getAvailableActions = () => {
    if (!reservation) return [];
    
    switch (reservation.status) {
      case 'pending':
        return [
          {
            label: '예약 확정',
            color: 'success',
            onClick: () => {
              setNewStatus('confirmed');
              setStatusDialogOpen(true);
            }
          },
          {
            label: '예약 취소',
            color: 'error',
            onClick: handleOpenCancelDialog
          }
        ];
      case 'confirmed':
        return [
          {
            label: '체크인',
            color: 'primary',
            onClick: handleCheckIn
          },
          {
            label: '예약 취소',
            color: 'error',
            onClick: handleOpenCancelDialog
          }
        ];
      case 'checked_in':
        return [
          {
            label: '체크아웃',
            color: 'primary',
            onClick: handleCheckOut
          }
        ];
      default:
        return [];
    }
  };

  if (loading && !reservation) {
    return (
      <Container maxWidth="lg">
        <LinearProgress />
        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h6">예약 정보를 불러오는 중...</Typography>
        </Box>
      </Container>
    );
  }

  if (!reservation) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            예약 정보를 찾을 수 없습니다.
          </Typography>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/reservations')}
            sx={{ mt: 2 }}
          >
            예약 목록으로 돌아가기
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {loading && <LinearProgress />}
      
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/reservations')}
          sx={{ mb: 2 }}
        >
          목록으로 돌아가기
        </Button>
        
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              예약 상세 정보
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              예약번호: {reservation.id}
            </Typography>
          </Box>
          
          <Chip
            label={statusLabels[reservation.status]}
            color={statusColors[reservation.status]}
          />
        </Stack>
      </Box>
      
      <Grid container spacing={3}>
        {/* 예약 요약 카드 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                예약 요약
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    숙소명
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {reservation.accommodationName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    객실 유형
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {reservation.roomName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    체크인
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {formatDate(reservation.checkInDate)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    체크아웃
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {formatDate(reservation.checkOutDate)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    인원 수
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {reservation.guestCount}명
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    예약 일시
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {formatDateTime(reservation.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    취소 정책
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {reservation.cancellationPolicy}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* 객실 상세 정보 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                객실 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    객실 유형
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {reservation.roomDetails.roomType}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    침대 유형
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {reservation.roomDetails.bedType}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    편의시설
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {reservation.roomDetails.amenities.map((amenity, index) => (
                      <Chip
                        key={index}
                        label={amenity}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 고객 정보 및 결제 정보 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                고객 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    성명
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {reservation.guestName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    연락처
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {reservation.contactNumber}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    이메일
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {reservation.guestEmail}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    특별 요청사항
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {reservation.specialRequests || '없음'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* 결제 정보 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                결제 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    결제 상태
                  </Typography>
                  <Chip
                    label={paymentStatusLabels[reservation.paymentStatus]}
                    color={paymentStatusColors[reservation.paymentStatus]}
                    size="small"
                    sx={{ mt: 0.5, mb: 1 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    결제 방법
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {reservation.paymentMethod}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    요금 상세
                  </Typography>
                  <Box sx={{ mt: 1, mb: 2 }}>
                    {reservation.priceBreakdown.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 0.5
                        }}
                      >
                        <Typography variant="body2">{item.description}</Typography>
                        <Typography variant="body2">
                          {formatPrice(item.amount)}
                        </Typography>
                      </Box>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 'bold'
                      }}
                    >
                      <Typography variant="body1">총액</Typography>
                      <Typography variant="body1">
                        {formatPrice(reservation.totalPrice)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 관리 액션 버튼 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {getAvailableActions().map((action, index) => (
                <Button
                  key={index}
                  variant="contained"
                  color={action.color}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
              
              {reservation.status !== 'cancelled' && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleOpenStatusDialog}
                >
                  상태 변경
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* 상태 변경 다이얼로그 */}
      <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog}>
        <DialogTitle>예약 상태 변경</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            예약 상태를 변경합니다.
          </DialogContentText>
          <Select
            fullWidth
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <MenuItem value="pending">대기</MenuItem>
            <MenuItem value="confirmed">확정</MenuItem>
            <MenuItem value="checked_in">체크인</MenuItem>
            <MenuItem value="checked_out">체크아웃</MenuItem>
            <MenuItem value="cancelled">취소</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>취소</Button>
          <Button onClick={handleStatusChange} color="primary">
            변경
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 예약 취소 다이얼로그 */}
      <Dialog open={cancelDialogOpen} onClose={handleCloseCancelDialog}>
        <DialogTitle>예약 취소</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            정말로 이 예약을 취소하시겠습니까? 취소된 예약은 복구할 수 없습니다.
          </DialogContentText>
          <TextField
            fullWidth
            label="취소 사유"
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>취소</Button>
          <Button onClick={handleCancelReservation} color="error">
            예약 취소
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default ReservationDetail; 