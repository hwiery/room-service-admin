import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  DeleteOutline as DeleteOutlineIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { customerApi } from '../../../api/customerApi';

// 목업 데이터 - 차단된 회원 목록
const mockBlockedMembers = [
  {
    id: 'M004',
    name: '최서연',
    email: 'choi@example.com',
    phoneNumber: '010-2222-3333',
    status: 'blocked',
    tier: 'standard',
    registrationDate: '2023-02-28T08:30:51',
    lastLoginDate: '2023-04-15T17:45:12',
    blockReason: '불법 활동 의심',
    blockedAt: '2023-05-10T09:30:00',
    blockedBy: '관리자1'
  },
  {
    id: 'M007',
    name: '윤준호',
    email: 'yoon@example.com',
    phoneNumber: '010-5678-1234',
    status: 'blocked',
    tier: 'silver',
    registrationDate: '2022-09-12T11:20:35',
    lastLoginDate: '2023-03-22T14:30:45',
    blockReason: '결제 사기 시도',
    blockedAt: '2023-03-25T16:40:20',
    blockedBy: '관리자2'
  },
  {
    id: 'M012',
    name: '한미영',
    email: 'han@example.com',
    phoneNumber: '010-9999-8888',
    status: 'blocked',
    tier: 'standard',
    registrationDate: '2022-11-05T15:40:22',
    lastLoginDate: '2023-05-18T09:15:30',
    blockReason: '악의적인 리뷰 작성',
    blockedAt: '2023-05-19T10:25:30',
    blockedBy: '관리자1'
  }
];

/**
 * 고객 블랙리스트 관리 페이지 컴포넌트
 */
const BlacklistManager = () => {
  const navigate = useNavigate();
  const [blockedMembers, setBlockedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // API에서 차단된 회원 목록 가져오기
  useEffect(() => {
    const fetchBlockedMembers = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const params = {
        //   page: page + 1,
        //   limit: rowsPerPage,
        //   search: searchQuery,
        //   status: 'blocked'
        // };
        // const response = await customerApi.getMembers(params);
        // setBlockedMembers(response.data.items);
        // setTotalCount(response.data.totalCount);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          // 검색어 필터링
          let filteredData = [...mockBlockedMembers];
          
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredData = filteredData.filter(
              (member) =>
                member.id.toLowerCase().includes(query) ||
                member.name.toLowerCase().includes(query) ||
                member.email.toLowerCase().includes(query) ||
                member.phoneNumber.includes(query) ||
                member.blockReason.toLowerCase().includes(query)
            );
          }
          
          // 페이지네이션 적용
          const start = page * rowsPerPage;
          const paginatedData = filteredData.slice(start, start + rowsPerPage);
          
          setBlockedMembers(paginatedData);
          setTotalCount(filteredData.length);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('차단된 회원 목록을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchBlockedMembers();
  }, [page, rowsPerPage, searchQuery]);

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

  // 차단 해제 다이얼로그 열기 핸들러
  const handleOpenUnblockDialog = (id) => {
    setSelectedMemberId(id);
    setUnblockDialogOpen(true);
  };

  // 차단 해제 다이얼로그 닫기 핸들러
  const handleCloseUnblockDialog = () => {
    setUnblockDialogOpen(false);
    setSelectedMemberId(null);
  };

  // 회원 차단 해제 핸들러
  const handleUnblockMember = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await customerApi.updateMemberStatus(selectedMemberId, 'active');
      
      // 백엔드 구현 전까지 목업 처리
      console.log(`회원 차단 해제: ${selectedMemberId}`);
      
      // 클라이언트 측 상태 업데이트
      setBlockedMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== selectedMemberId)
      );
      
      showSnackbar('회원 차단이 해제되었습니다');
      setUnblockDialogOpen(false);
      setSelectedMemberId(null);
      setLoading(false);
    } catch (error) {
      console.error('회원 차단 해제 중 오류가 발생했습니다:', error);
      showSnackbar('회원 차단 해제 실패', 'error');
      setLoading(false);
    }
  };

  // 회원 상세 페이지 이동 핸들러
  const handleViewMember = (id) => {
    navigate(`/customers/members/${id}`);
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

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/customers/members')}
          sx={{ mb: 2 }}
        >
          회원 목록으로 돌아가기
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          고객 블랙리스트 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          차단된 회원 목록 조회 및 관리
        </Typography>
      </Box>

      {/* 검색 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              placeholder="회원번호, 이름, 이메일, 전화번호, 차단 사유로 검색"
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
        </Grid>
      </Paper>

      {/* 차단된 회원 목록 테이블 */}
      <Card>
        {loading && <LinearProgress />}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>회원번호</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell>연락처</TableCell>
                <TableCell>차단 사유</TableCell>
                <TableCell>차단 일시</TableCell>
                <TableCell>차단한 관리자</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blockedMembers.length > 0 ? (
                blockedMembers.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phoneNumber}</TableCell>
                    <TableCell>{member.blockReason}</TableCell>
                    <TableCell>{formatDate(member.blockedAt)}</TableCell>
                    <TableCell>{member.blockedBy}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="차단 해제">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleOpenUnblockDialog(member.id)}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="상세보기">
                          <IconButton
                            size="small"
                            onClick={() => handleViewMember(member.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : !loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      차단된 회원이 없습니다.
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

      {/* 차단 해제 다이얼로그 */}
      <Dialog open={unblockDialogOpen} onClose={handleCloseUnblockDialog}>
        <DialogTitle>회원 차단 해제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            이 회원의 차단을 해제하시겠습니까? 해제 후 회원은 정상적으로 서비스를 이용할 수 있습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUnblockDialog}>취소</Button>
          <Button onClick={handleUnblockMember} color="success">
            차단 해제
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

export default BlacklistManager; 