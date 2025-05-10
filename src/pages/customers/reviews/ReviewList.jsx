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
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Rating,
  Select,
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
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
  VisibilityOff as VisibilityOffIcon,
  Comment as CommentIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { customerApi } from '../../../api/customerApi';

// 리뷰 상태 색상 정의
const statusColors = {
  published: 'success',
  hidden: 'default',
  reported: 'error',
  pending: 'warning'
};

// 목업 데이터
const mockReviews = [
  {
    id: 'R001',
    memberId: 'M002',
    memberName: '이영희',
    accommodationId: 'A001',
    accommodationName: '서울 그랜드 호텔',
    roomName: '디럭스 더블',
    reservationId: 'RES001',
    rating: 4.5,
    content: '전체적으로 만족스러웠습니다. 객실도 깨끗하고 직원분들도 친절했어요. 다만 조식이 좀 더 다양했으면 좋겠습니다.',
    status: 'published',
    createdAt: '2023-03-25T14:30:45',
    hasResponse: true,
    responseContent: '소중한 의견 감사합니다. 조식 메뉴 다양화에 대한 의견 참고하겠습니다.',
    responseCreatedAt: '2023-03-26T10:15:20',
    photos: ['review1_1.jpg', 'review1_2.jpg']
  },
  {
    id: 'R002',
    memberId: 'M003',
    memberName: '박지민',
    accommodationId: 'A002',
    accommodationName: '부산 씨사이드 리조트',
    roomName: '오션뷰 스위트',
    reservationId: 'RES002',
    rating: 2.0,
    content: '뷰는 좋았지만 청소 상태가 매우 불량했습니다. 화장실에 머리카락이 그대로 있었고, 침구에서는 이상한 냄새가 났습니다. 다시는 이용하지 않을 것 같네요.',
    status: 'hidden',
    createdAt: '2023-04-10T18:45:30',
    hasResponse: false,
    responseContent: null,
    responseCreatedAt: null,
    photos: []
  },
  {
    id: 'R003',
    memberId: 'M005',
    memberName: '정현우',
    accommodationId: 'A003',
    accommodationName: '제주 오션 파라다이스',
    roomName: '프리미엄 스위트',
    reservationId: 'RES003',
    rating: 5.0,
    content: '정말 최고의 숙소였습니다! 뷰가 환상적이고 룸 컨디션도 완벽했습니다. 특히 직원분들이 너무 친절해서 더욱 기분 좋은 여행이 되었어요. 다음에도 꼭 방문하겠습니다.',
    status: 'published',
    createdAt: '2023-05-05T20:10:15',
    hasResponse: true,
    responseContent: '좋은 평가 감사합니다. 다음 방문도 기대하겠습니다.',
    responseCreatedAt: '2023-05-06T09:30:40',
    photos: ['review3_1.jpg', 'review3_2.jpg', 'review3_3.jpg']
  },
  {
    id: 'R004',
    memberId: 'M001',
    memberName: '김철수',
    accommodationId: 'A001',
    accommodationName: '서울 그랜드 호텔',
    roomName: '스탠다드 트윈',
    reservationId: 'RES004',
    rating: 3.5,
    content: '가격 대비 괜찮은 숙소였습니다. 위치가 좋아서 교통이 편리했어요. 하지만 소음이 조금 있었습니다.',
    status: 'reported',
    createdAt: '2023-05-20T12:40:22',
    hasResponse: false,
    responseContent: null,
    responseCreatedAt: null,
    photos: ['review4_1.jpg']
  },
  {
    id: 'R005',
    memberId: 'M007',
    memberName: '윤준호',
    accommodationId: 'A004',
    accommodationName: '강원 마운틴 리조트',
    roomName: '마운틴뷰 디럭스',
    reservationId: 'RES005',
    rating: 4.0,
    content: '조용하고 자연 환경이 좋았습니다. 객실도 넓고 깨끗했어요. 다만 레스토랑 메뉴가 다양하지 않아 아쉬웠습니다.',
    status: 'pending',
    createdAt: '2023-06-01T16:20:10',
    hasResponse: false,
    responseContent: null,
    responseCreatedAt: null,
    photos: []
  }
];

/**
 * 리뷰 목록 페이지 컴포넌트
 */
const ReviewList = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // 검색 및 필터링 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    rating: '',
    hasResponse: ''
  });

  // 다이얼로그 상태
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseContent, setResponseContent] = useState('');
  
  // 알림 상태
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // API에서 리뷰 목록 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const params = {
        //   page: page + 1,
        //   limit: rowsPerPage,
        //   search: searchQuery,
        //   ...filters
        // };
        // const response = await customerApi.getReviews(params);
        // setReviews(response.data.items);
        // setTotalCount(response.data.totalCount);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          // 검색 및 필터링 처리
          let filteredData = [...mockReviews];
          
          // 검색어 필터링
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredData = filteredData.filter(
              (review) =>
                review.memberName.toLowerCase().includes(query) ||
                review.accommodationName.toLowerCase().includes(query) ||
                review.content.toLowerCase().includes(query)
            );
          }
          
          // 상태 필터링
          if (filters.status) {
            filteredData = filteredData.filter(
              (review) => review.status === filters.status
            );
          }
          
          // 평점 필터링
          if (filters.rating) {
            const rating = parseFloat(filters.rating);
            filteredData = filteredData.filter(
              (review) => {
                if (filters.rating === '5') {
                  return review.rating === 5;
                } else {
                  return Math.floor(review.rating) === rating;
                }
              }
            );
          }
          
          // 답변 여부 필터링
          if (filters.hasResponse !== '') {
            const hasResponse = filters.hasResponse === 'true';
            filteredData = filteredData.filter(
              (review) => review.hasResponse === hasResponse
            );
          }
          
          // 페이지네이션 적용
          const start = page * rowsPerPage;
          const paginatedData = filteredData.slice(start, start + rowsPerPage);
          
          setReviews(paginatedData);
          setTotalCount(filteredData.length);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('리뷰 목록을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchReviews();
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
      rating: '',
      hasResponse: ''
    });
    setPage(0);
  };

  // 상태 변경 다이얼로그 열기
  const handleOpenStatusDialog = (review) => {
    setSelectedReview(review);
    setNewStatus(review.status);
    setStatusDialogOpen(true);
  };

  // 상태 변경 다이얼로그 닫기
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedReview(null);
  };

  // 답변 다이얼로그 열기
  const handleOpenResponseDialog = (review) => {
    setSelectedReview(review);
    setResponseContent(review.responseContent || '');
    setResponseDialogOpen(true);
  };

  // 답변 다이얼로그 닫기
  const handleCloseResponseDialog = () => {
    setResponseDialogOpen(false);
    setSelectedReview(null);
    setResponseContent('');
  };

  // 리뷰 상태 변경 핸들러
  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await customerApi.updateReviewStatus(selectedReview.id, newStatus);
      
      // 백엔드 구현 전까지 목업 처리
      console.log(`리뷰 상태 변경: ${selectedReview.id}, ${newStatus}`);
      
      // 클라이언트 측 상태 업데이트
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === selectedReview.id ? { ...review, status: newStatus } : review
        )
      );
      
      showSnackbar('리뷰 상태가 변경되었습니다');
      handleCloseStatusDialog();
    } catch (error) {
      console.error('리뷰 상태 변경 중 오류가 발생했습니다:', error);
      showSnackbar('리뷰 상태 변경 실패', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 리뷰 답변 저장 핸들러
  const handleSaveResponse = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await customerApi.respondToReview(selectedReview.id, responseContent);
      
      // 백엔드 구현 전까지 목업 처리
      console.log(`리뷰 답변 저장: ${selectedReview.id}, ${responseContent}`);
      
      // 클라이언트 측 상태 업데이트
      const now = new Date().toISOString();
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === selectedReview.id ? {
            ...review,
            hasResponse: true,
            responseContent: responseContent,
            responseCreatedAt: now
          } : review
        )
      );
      
      showSnackbar('리뷰 답변이 저장되었습니다');
      handleCloseResponseDialog();
    } catch (error) {
      console.error('리뷰 답변 저장 중 오류가 발생했습니다:', error);
      showSnackbar('리뷰 답변 저장 실패', 'error');
    } finally {
      setLoading(false);
    }
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

  // 리뷰 상태 텍스트 가져오기
  const getStatusLabel = (status) => {
    const statusLabels = {
      published: '공개',
      hidden: '숨김',
      reported: '신고됨',
      pending: '검토중'
    };
    return statusLabels[status] || status;
  };

  // 리뷰 상세 페이지로 이동
  const handleViewReview = (id) => {
    navigate(`/customers/reviews/${id}`);
  };

  // 내용 요약 함수
  const summarizeContent = (content, maxLength = 100) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          리뷰 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          고객 리뷰 조회 및 관리
        </Typography>
      </Box>

      {/* 검색 및 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="고객명, 숙소명, 리뷰 내용으로 검색"
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
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant={filterOpen ? "contained" : "outlined"}
              startIcon={<FilterIcon />}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              필터
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => navigate('/customers/reviews/stats')}
            >
              리뷰 통계
            </Button>
          </Grid>
          
          {filterOpen && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>리뷰 상태</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="리뷰 상태"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="published">공개</MenuItem>
                    <MenuItem value="hidden">숨김</MenuItem>
                    <MenuItem value="reported">신고됨</MenuItem>
                    <MenuItem value="pending">검토중</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>평점</InputLabel>
                  <Select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    label="평점"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="5">5점</MenuItem>
                    <MenuItem value="4">4점대</MenuItem>
                    <MenuItem value="3">3점대</MenuItem>
                    <MenuItem value="2">2점대</MenuItem>
                    <MenuItem value="1">1점대</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>답변 여부</InputLabel>
                  <Select
                    value={filters.hasResponse}
                    onChange={(e) => handleFilterChange('hasResponse', e.target.value)}
                    label="답변 여부"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="true">답변 완료</MenuItem>
                    <MenuItem value="false">미답변</MenuItem>
                  </Select>
                </FormControl>
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

      {/* 리뷰 목록 테이블 */}
      <Card>
        {loading && <LinearProgress />}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>작성자</TableCell>
                <TableCell>숙소/객실</TableCell>
                <TableCell>평점</TableCell>
                <TableCell>리뷰 내용</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>작성일</TableCell>
                <TableCell>답변</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <TableRow key={review.id} hover>
                    <TableCell>{review.id}</TableCell>
                    <TableCell>{review.memberName}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{review.accommodationName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.roomName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={review.rating} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({review.rating})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {summarizeContent(review.content)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(review.status)}
                        color={statusColors[review.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(review.createdAt)}</TableCell>
                    <TableCell>
                      {review.hasResponse ? (
                        <Chip
                          label="답변 완료"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          label="미답변"
                          color="default"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="상태 변경">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenStatusDialog(review)}
                          >
                            {review.status === 'published' ? (
                              <VisibilityOffIcon fontSize="small" />
                            ) : (
                              <VisibilityIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="답변 작성">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenResponseDialog(review)}
                          >
                            <CommentIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="상세보기">
                          <IconButton
                            size="small"
                            onClick={() => handleViewReview(review.id)}
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
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      리뷰 데이터가 없습니다.
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

      {/* 상태 변경 다이얼로그 */}
      <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog}>
        <DialogTitle>리뷰 상태 변경</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            이 리뷰의 상태를 변경합니다.
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>상태</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="상태"
            >
              <MenuItem value="published">공개</MenuItem>
              <MenuItem value="hidden">숨김</MenuItem>
              <MenuItem value="reported">신고됨</MenuItem>
              <MenuItem value="pending">검토중</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>취소</Button>
          <Button onClick={handleUpdateStatus} color="primary">
            변경
          </Button>
        </DialogActions>
      </Dialog>

      {/* 답변 작성 다이얼로그 */}
      <Dialog open={responseDialogOpen} onClose={handleCloseResponseDialog} maxWidth="md" fullWidth>
        <DialogTitle>리뷰 답변 작성</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              원본 리뷰
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {selectedReview?.memberName}
                </Typography>
                <Rating value={selectedReview?.rating || 0} precision={0.5} readOnly size="small" />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  ({formatDate(selectedReview?.createdAt || '')})
                </Typography>
              </Box>
              <Typography variant="body1">
                {selectedReview?.content}
              </Typography>
            </Paper>
          </Box>
          
          <TextField
            fullWidth
            label="답변 내용"
            multiline
            rows={4}
            value={responseContent}
            onChange={(e) => setResponseContent(e.target.value)}
            placeholder="리뷰에 대한 답변을 작성해주세요."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResponseDialog}>취소</Button>
          <Button
            onClick={handleSaveResponse}
            color="primary"
            disabled={!responseContent.trim()}
          >
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

export default ReviewList; 