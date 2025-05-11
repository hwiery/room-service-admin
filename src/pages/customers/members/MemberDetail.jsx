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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarMonth as CalendarIcon,
  VpnKey as VpnKeyIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { customerApi } from '../../../api/customerApi';

// 회원 상태 색상 정의
const statusColors = {
  active: 'success',
  inactive: 'default',
  blocked: 'error'
};

// 회원 등급 색상 정의
const tierColors = {
  standard: 'default',
  silver: 'primary',
  gold: 'warning',
  platinum: 'secondary'
};

// 목업 회원 데이터
const mockMemberDetails = {
  id: 'M002',
  name: '이영희',
  email: 'lee@example.com',
  phoneNumber: '010-9876-5432',
  status: 'active',
  tier: 'gold',
  registrationDate: '2022-08-20T09:15:22',
  lastLoginDate: '2023-05-28T16:40:55',
  reservationCount: 8,
  totalSpent: 1650000,
  address: {
    zipCode: '06134',
    address1: '서울특별시 강남구 테헤란로 123',
    address2: '201호'
  },
  birthdate: '1985-04-15',
  gender: 'female',
  marketing: true,
  notes: '자주 이용하는 VIP 고객입니다. 특별 혜택 제공 필요.'
};

// 목업 예약 이력 데이터
const mockReservationHistory = [
  {
    id: 'R001',
    accommodationName: '서울 그랜드 호텔',
    roomName: '디럭스 더블',
    checkInDate: '2023-01-15',
    checkOutDate: '2023-01-17',
    status: 'checked_out',
    totalPrice: 350000,
    createdAt: '2023-01-05T10:30:45'
  },
  {
    id: 'R002',
    accommodationName: '부산 씨사이드 리조트',
    roomName: '오션뷰 스위트',
    checkInDate: '2023-03-20',
    checkOutDate: '2023-03-25',
    status: 'checked_out',
    totalPrice: 750000,
    createdAt: '2023-02-28T14:22:36'
  },
  {
    id: 'R005',
    accommodationName: '강원 마운틴 리조트',
    roomName: '마운틴뷰 디럭스',
    checkInDate: '2023-06-22',
    checkOutDate: '2023-06-24',
    status: 'confirmed',
    totalPrice: 320000,
    createdAt: '2023-05-15T11:20:18'
  }
];

/**
 * 탭 패널 컴포넌트
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`member-tabpanel-${index}`}
      aria-labelledby={`member-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * 회원 상세 정보 페이지 컴포넌트
 */
const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [editData, setEditData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // API에서 회원 상세 정보 가져오기
  useEffect(() => {
    const fetchMemberDetail = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await customerApi.getMember(id);
        // setMember(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          setMember({ 
            ...mockMemberDetails,
            id // 실제 URL의 ID 사용
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('회원 상세 정보를 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
        showSnackbar('회원 정보를 불러올 수 없습니다', 'error');
      }
    };

    const fetchReservationHistory = async () => {
      try {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await customerApi.getMemberReservations(id);
        // setReservations(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          setReservations(mockReservationHistory);
        }, 700);
      } catch (error) {
        console.error('예약 이력을 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchMemberDetail();
    fetchReservationHistory();
  }, [id]);

  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
    if (member) {
      setNewStatus(member.status);
      setStatusDialogOpen(true);
    }
  };

  // 상태 변경 다이얼로그 닫기 핸들러
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  // 편집 다이얼로그 열기 핸들러
  const handleOpenEditDialog = () => {
    if (member) {
      setEditData({
        name: member.name,
        email: member.email,
        phoneNumber: member.phoneNumber,
        tier: member.tier,
        notes: member.notes || ''
      });
      setEditDialogOpen(true);
    }
  };

  // 편집 다이얼로그 닫기 핸들러
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  // 상태 변경 핸들러
  const handleStatusChange = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await customerApi.updateMemberStatus(id, newStatus);
      
      // 백엔드 구현 전까지 목업 처리
      console.log(`회원 상태 변경: ${id}, ${newStatus}`);
      
      // 클라이언트 측 상태 업데이트
      setMember(prev => ({ ...prev, status: newStatus }));
      
      setStatusDialogOpen(false);
      showSnackbar('회원 상태가 변경되었습니다');
    } catch (error) {
      console.error('회원 상태 변경 중 오류가 발생했습니다:', error);
      showSnackbar('회원 상태 변경 실패', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 회원 정보 편집 핸들러
  const handleEditMember = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await customerApi.updateMember(id, editData);
      
      // 백엔드 구현 전까지 목업 처리
      console.log(`회원 정보 수정: ${id}`, editData);
      
      // 클라이언트 측 상태 업데이트
      setMember(prev => ({ ...prev, ...editData }));
      
      setEditDialogOpen(false);
      showSnackbar('회원 정보가 수정되었습니다');
    } catch (error) {
      console.error('회원 정보 수정 중 오류가 발생했습니다:', error);
      showSnackbar('회원 정보 수정 실패', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 회원 등급 표시 텍스트
  const getTierLabel = (tier) => {
    const tierLabels = {
      standard: '일반',
      silver: '실버',
      gold: '골드',
      platinum: '플래티넘'
    };
    return tierLabels[tier] || tier;
  };

  // 회원 상태 표시 텍스트
  const getStatusLabel = (status) => {
    const statusLabels = {
      active: '활성',
      inactive: '비활성',
      blocked: '차단'
    };
    return statusLabels[status] || status;
  };

  // 예약 상태 표시 텍스트
  const getReservationStatusLabel = (status) => {
    const statusLabels = {
      pending: '대기',
      confirmed: '확정',
      checked_in: '체크인',
      checked_out: '체크아웃',
      cancelled: '취소'
    };
    return statusLabels[status] || status;
  };

  // 예약 상태 색상
  const getReservationStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      checked_in: 'success',
      checked_out: 'default',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  // 예약 상세 페이지로 이동
  const handleViewReservation = (reservationId) => {
    navigate(`/reservations/${reservationId}`);
  };

  if (loading && !member) {
    return (
      <Container maxWidth="lg">
        <LinearProgress />
        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h6">회원 정보를 불러오는 중...</Typography>
        </Box>
      </Container>
    );
  }

  if (!member) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            회원 정보를 찾을 수 없습니다.
          </Typography>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/customers/members')}
            sx={{ mt: 2 }}
          >
            회원 목록으로 돌아가기
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
          onClick={() => navigate('/customers/members')}
          sx={{ mb: 2 }}
        >
          목록으로 돌아가기
        </Button>
        
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              회원 상세 정보
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {member.id} - {member.name}
            </Typography>
          </Box>
          
          <Box>
            <Chip
              label={getStatusLabel(member.status)}
              color={statusColors[member.status]}
              sx={{ mr: 1 }}
            />
            <Chip
              label={getTierLabel(member.tier)}
              color={tierColors[member.tier]}
              variant="outlined"
            />
          </Box>
        </Stack>
      </Box>
      
      {/* 상단 작업 버튼 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleOpenEditDialog}
            >
              정보 수정
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color={member.status === 'active' ? 'error' : 'success'}
              startIcon={member.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
              onClick={handleOpenStatusDialog}
            >
              {member.status === 'active' ? '차단하기' : member.status === 'blocked' ? '차단 해제' : '활성화'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* 탭 영역 */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="기본 정보" />
            <Tab label="예약 이력" />
          </Tabs>
        </Box>
        
        {/* 기본 정보 탭 */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    기본 정보
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>
                          이메일
                        </Typography>
                        <Typography variant="body1">
                          {member.email}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>
                          전화번호
                        </Typography>
                        <Typography variant="body1">
                          {member.phoneNumber}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>
                          가입일
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(member.registrationDate)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <VpnKeyIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>
                          마지막 로그인
                        </Typography>
                        <Typography variant="body1">
                          {formatDateTime(member.lastLoginDate)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    주소 정보
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {member.address ? (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        우편번호
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {member.address.zipCode}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        주소
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {member.address.address1}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        상세주소
                      </Typography>
                      <Typography variant="body1">
                        {member.address.address2}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      등록된 주소 정보가 없습니다.
                    </Typography>
                  )}
                </CardContent>
              </Card>
              
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    추가 정보
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      생년월일
                    </Typography>
                    <Typography variant="body1">
                      {member.birthdate ? formatDate(member.birthdate) : '미등록'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      성별
                    </Typography>
                    <Typography variant="body1">
                      {member.gender === 'male' ? '남성' : 
                       member.gender === 'female' ? '여성' : '미등록'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      마케팅 수신 동의
                    </Typography>
                    <Typography variant="body1">
                      {member.marketing ? '동의' : '미동의'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    관리자 메모
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="body1">
                    {member.notes || '등록된 메모가 없습니다.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* 예약 이력 탭 */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            총 예약 {member.reservationCount}건, 총 사용액 {formatPrice(member.totalSpent)}
          </Typography>
          
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>예약번호</TableCell>
                    <TableCell>숙소/객실</TableCell>
                    <TableCell>체크인</TableCell>
                    <TableCell>체크아웃</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>금액</TableCell>
                    <TableCell>예약일</TableCell>
                    <TableCell align="right">작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservations.length > 0 ? (
                    reservations.map((reservation) => (
                      <TableRow key={reservation.id} hover>
                        <TableCell>{reservation.id}</TableCell>
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
                            label={getReservationStatusLabel(reservation.status)}
                            color={getReservationStatusColor(reservation.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatPrice(reservation.totalPrice)}</TableCell>
                        <TableCell>{formatDate(reservation.createdAt)}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="예약 상세">
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
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          예약 이력이 없습니다.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </TabPanel>
      </Paper>
      
      {/* 상태 변경 다이얼로그 */}
      <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog}>
        <DialogTitle>회원 상태 변경</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {member.name} 회원의 상태를 변경합니다.
          </DialogContentText>
          <FormControl fullWidth>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="active">활성</MenuItem>
              <MenuItem value="inactive">비활성</MenuItem>
              <MenuItem value="blocked">차단</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>취소</Button>
          <Button onClick={handleStatusChange} color="primary">
            변경
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 회원 정보 편집 다이얼로그 */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>회원 정보 수정</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="이름"
                value={editData.name || ''}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="이메일"
                value={editData.email || ''}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="전화번호"
                value={editData.phoneNumber || ''}
                onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>회원 등급</InputLabel>
                <Select
                  value={editData.tier || ''}
                  onChange={(e) => setEditData({ ...editData, tier: e.target.value })}
                  label="회원 등급"
                >
                  <MenuItem value="standard">일반</MenuItem>
                  <MenuItem value="silver">실버</MenuItem>
                  <MenuItem value="gold">골드</MenuItem>
                  <MenuItem value="platinum">플래티넘</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="관리자 메모"
                value={editData.notes || ''}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>취소</Button>
          <Button onClick={handleEditMember} color="primary">
            저장
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

export default MemberDetail; 