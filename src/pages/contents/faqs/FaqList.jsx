import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

// 목업 데이터
const mockFaqs = [
  {
    id: 'FAQ001',
    question: '예약 취소는 어떻게 하나요?',
    answer: '예약 취소는 예약 상세 페이지에서 취소 버튼을 통해 가능합니다. 취소 수수료는 취소 시점에 따라 다르며, 자세한 사항은 각 숙소의 취소 정책을 참고해 주세요.',
    category: 'reservation',
    status: 'published',
    viewCount: 1530,
    isPopular: true,
    createdAt: '2023-04-10T10:30:00',
    updatedAt: '2023-04-12T15:45:00',
    createdBy: '관리자1',
    order: 1
  },
  {
    id: 'FAQ002',
    question: '결제 방법은 어떤 것이 있나요?',
    answer: '신용카드, 체크카드, 계좌이체, 네이버페이, 카카오페이, 페이코 등 다양한 결제 방법을 지원합니다. 결제 시 원하시는 방법을 선택해 주세요.',
    category: 'payment',
    status: 'published',
    viewCount: 1280,
    isPopular: true,
    createdAt: '2023-04-15T11:20:00',
    updatedAt: '2023-04-15T11:20:00',
    createdBy: '관리자2',
    order: 2
  },
  {
    id: 'FAQ003',
    question: '예약 확인은 어디서 할 수 있나요?',
    answer: '로그인 후 마이페이지 > 예약 내역에서 확인하실 수 있습니다. 예약 확인 이메일도 예약 시 입력하신 이메일로 발송됩니다.',
    category: 'reservation',
    status: 'published',
    viewCount: 980,
    isPopular: true,
    createdAt: '2023-04-18T09:15:00',
    updatedAt: '2023-04-18T09:15:00',
    createdBy: '관리자1',
    order: 3
  },
  {
    id: 'FAQ004',
    question: '미성년자도 예약이 가능한가요?',
    answer: '미성년자의 경우 법적 보호자의 동의가 필요합니다. 일부 숙소는 미성년자 예약에 제한이 있을 수 있으니 사전에 확인해 주세요.',
    category: 'reservation',
    status: 'published',
    viewCount: 740,
    isPopular: false,
    createdAt: '2023-04-20T14:30:00',
    updatedAt: '2023-04-22T10:10:00',
    createdBy: '관리자3',
    order: 4
  },
  {
    id: 'FAQ005',
    question: '예약 영수증은 어떻게 발급받나요?',
    answer: '마이페이지 > 예약 내역 > 해당 예약 상세 페이지에서 영수증 발급 버튼을 통해 발급받으실 수 있습니다. 추가로 세금계산서가 필요하신 경우 고객센터로 문의해 주세요.',
    category: 'payment',
    status: 'draft',
    viewCount: 0,
    isPopular: false,
    createdAt: '2023-05-02T16:45:00',
    updatedAt: '2023-05-02T16:45:00',
    createdBy: '관리자2',
    order: 5
  }
];

// FAQ 상태 색상 정의
const statusColors = {
  published: 'success',
  draft: 'warning',
  archived: 'default'
};

/**
 * FAQ 목록 페이지 컴포넌트
 */
const FaqList = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // 검색 및 필터링 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    isPopular: ''
  });

  // API에서 FAQ 목록 가져오기
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const params = {
        //   page: page + 1,
        //   limit: rowsPerPage,
        //   search: searchQuery,
        //   ...filters
        // };
        // const response = await contentsApi.getFaqs(params);
        // setFaqs(response.data.items);
        // setTotalCount(response.data.totalCount);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          // 검색 및 필터링 처리
          let filteredData = [...mockFaqs];
          
          // 검색어 필터링
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredData = filteredData.filter(
              (faq) =>
                faq.id.toLowerCase().includes(query) ||
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query)
            );
          }
          
          // 상태 필터링
          if (filters.status) {
            filteredData = filteredData.filter(
              (faq) => faq.status === filters.status
            );
          }
          
          // 카테고리 필터링
          if (filters.category) {
            filteredData = filteredData.filter(
              (faq) => faq.category === filters.category
            );
          }
          
          // 인기 FAQ 필터링
          if (filters.isPopular !== '') {
            const isPopular = filters.isPopular === 'true';
            filteredData = filteredData.filter(
              (faq) => faq.isPopular === isPopular
            );
          }
          
          // 페이지네이션 적용
          const start = page * rowsPerPage;
          const paginatedData = filteredData.slice(start, start + rowsPerPage);
          
          setFaqs(paginatedData);
          setTotalCount(filteredData.length);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('FAQ 목록을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [page, rowsPerPage, searchQuery, filters]);

  // 페이지 변경 핸들러
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 행 개수 변경 핸들러
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // 필터 초기화 핸들러
  const handleClearFilters = () => {
    setFilters({
      status: '',
      category: '',
      isPopular: ''
    });
    setSearchQuery('');
  };

  // 상세 페이지로 이동
  const handleViewFaq = (id) => {
    navigate(`/contents/faqs/${id}`);
  };

  // 수정 페이지로 이동
  const handleEditFaq = (id) => {
    navigate(`/contents/faqs/${id}/edit`);
  };

  // 등록 페이지로 이동
  const handleCreateFaq = () => {
    navigate('/contents/faqs/new');
  };

  // FAQ 삭제 처리
  const handleDeleteFaq = async (id) => {
    if (window.confirm('이 FAQ를 정말 삭제하시겠습니까?')) {
      try {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // await contentsApi.deleteFaq(id);
        
        // 임시 로직 (백엔드 구현 전까지)
        setTimeout(() => {
          const updatedFaqs = faqs.filter(
            (faq) => faq.id !== id
          );
          setFaqs(updatedFaqs);
          alert('FAQ가 삭제되었습니다.');
        }, 500);
      } catch (error) {
        console.error('FAQ 삭제 중 오류 발생:', error);
        alert('FAQ 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return dateString;
    }
  };

  // FAQ 상태 표시 텍스트
  const getStatusLabel = (status) => {
    const statusLabels = {
      published: '게시중',
      draft: '임시저장',
      archived: '보관됨'
    };
    return statusLabels[status] || status;
  };

  // FAQ 카테고리 표시 텍스트
  const getCategoryLabel = (category) => {
    const categoryLabels = {
      reservation: '예약',
      payment: '결제',
      accommodation: '숙소',
      account: '계정',
      service: '서비스',
      other: '기타'
    };
    return categoryLabels[category] || category;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          FAQ 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          자주 묻는 질문 관리 및 카테고리별 정리
        </Typography>
      </Box>

      {/* 검색 및 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="질문 또는 답변으로 검색"
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
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateFaq}
            >
              FAQ 등록
            </Button>
          </Grid>
          
          {filterOpen && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>상태</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="상태"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="published">게시중</MenuItem>
                    <MenuItem value="draft">임시저장</MenuItem>
                    <MenuItem value="archived">보관됨</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>카테고리</InputLabel>
                  <Select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    label="카테고리"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="reservation">예약</MenuItem>
                    <MenuItem value="payment">결제</MenuItem>
                    <MenuItem value="accommodation">숙소</MenuItem>
                    <MenuItem value="account">계정</MenuItem>
                    <MenuItem value="service">서비스</MenuItem>
                    <MenuItem value="other">기타</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>인기 FAQ</InputLabel>
                  <Select
                    value={filters.isPopular}
                    onChange={(e) => handleFilterChange('isPopular', e.target.value)}
                    label="인기 FAQ"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="true">인기</MenuItem>
                    <MenuItem value="false">일반</MenuItem>
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

      {/* FAQ 목록 테이블 */}
      <Card>
        {loading && <LinearProgress />}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="80">순서</TableCell>
                <TableCell>질문</TableCell>
                <TableCell>카테고리</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>조회수</TableCell>
                <TableCell>등록일</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {faqs.length > 0 ? (
                faqs.map((faq) => (
                  <TableRow key={faq.id} hover>
                    <TableCell>{faq.order}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {faq.isPopular && (
                          <Chip
                            label="인기"
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                        )}
                        <Typography variant="body2" fontWeight="medium">
                          {faq.question}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{getCategoryLabel(faq.category)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(faq.status)}
                        color={statusColors[faq.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{faq.viewCount.toLocaleString()}</TableCell>
                    <TableCell>{formatDate(faq.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="상세보기">
                          <IconButton
                            size="small"
                            onClick={() => handleViewFaq(faq.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="수정">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditFaq(faq.id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="삭제">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteFaq(faq.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : !loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      FAQ 데이터가 없습니다.
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

export default FaqList; 