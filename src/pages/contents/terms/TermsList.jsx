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

// 이용약관 상태 색상 정의
const statusColors = {
  published: 'success',
  draft: 'warning',
  archived: 'default'
};

// 목업 데이터
const mockTerms = [
  {
    id: 'TERMS001',
    title: '서비스 이용약관',
    category: 'service',
    version: '1.2',
    status: 'published',
    isRequired: true,
    effectiveDate: '2023-01-01T00:00:00',
    createdAt: '2022-12-15T10:30:00',
    updatedAt: '2022-12-20T14:20:00',
    createdBy: '관리자1',
    content: '제1조 (목적)\n본 약관은 서비스 이용에 관한 조건과 절차를 규정함을 목적으로 합니다.\n\n제2조 (정의)...'
  },
  {
    id: 'TERMS002',
    title: '개인정보 처리방침',
    category: 'privacy',
    version: '2.1',
    status: 'published',
    isRequired: true,
    effectiveDate: '2023-03-01T00:00:00',
    createdAt: '2023-02-10T09:15:00',
    updatedAt: '2023-02-15T11:20:00',
    createdBy: '관리자2',
    content: '제1조 (개인정보 수집 항목)\n회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.\n\n제2조 (개인정보 수집 목적)...'
  },
  {
    id: 'TERMS003',
    title: '위치기반 서비스 이용약관',
    category: 'location',
    version: '1.0',
    status: 'published',
    isRequired: false,
    effectiveDate: '2023-02-01T00:00:00',
    createdAt: '2023-01-15T11:30:00',
    updatedAt: '2023-01-15T11:30:00',
    createdBy: '관리자1',
    content: '제1조 (목적)\n본 약관은 위치기반 서비스 이용에 관한 조건과 절차를 규정함을 목적으로 합니다.\n\n제2조 (정의)...'
  },
  {
    id: 'TERMS004',
    title: '마케팅 정보 수신 동의',
    category: 'marketing',
    version: '1.1',
    status: 'published',
    isRequired: false,
    effectiveDate: '2023-01-15T00:00:00',
    createdAt: '2022-12-20T14:40:00',
    updatedAt: '2023-01-05T10:20:00',
    createdBy: '관리자3',
    content: '제1조 (목적)\n본 약관은 마케팅 정보 수신에 관한 동의 사항을 규정함을 목적으로 합니다.\n\n제2조 (마케팅 정보의 범위)...'
  },
  {
    id: 'TERMS005',
    title: '서비스 이용약관 개정안 (임시저장)',
    category: 'service',
    version: '1.3',
    status: 'draft',
    isRequired: true,
    effectiveDate: '2023-06-01T00:00:00',
    createdAt: '2023-05-10T15:30:00',
    updatedAt: '2023-05-10T15:30:00',
    createdBy: '관리자1',
    content: '제1조 (목적)\n본 약관은 서비스 이용에 관한 조건과 절차를 규정함을 목적으로 합니다.\n\n제2조 (정의)...'
  }
];

/**
 * 이용약관 목록 페이지 컴포넌트
 */
const TermsList = () => {
  const navigate = useNavigate();
  const [terms, setTerms] = useState([]);
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
    isRequired: ''
  });

  // API에서 이용약관 목록 가져오기
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const params = {
        //   page: page + 1,
        //   limit: rowsPerPage,
        //   search: searchQuery,
        //   ...filters
        // };
        // const response = await contentsApi.getTerms(params);
        // setTerms(response.data.items);
        // setTotalCount(response.data.totalCount);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          // 검색 및 필터링 처리
          let filteredData = [...mockTerms];
          
          // 검색어 필터링
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredData = filteredData.filter(
              (term) =>
                term.id.toLowerCase().includes(query) ||
                term.title.toLowerCase().includes(query) ||
                term.content.toLowerCase().includes(query)
            );
          }
          
          // 상태 필터링
          if (filters.status) {
            filteredData = filteredData.filter(
              (term) => term.status === filters.status
            );
          }
          
          // 카테고리 필터링
          if (filters.category) {
            filteredData = filteredData.filter(
              (term) => term.category === filters.category
            );
          }
          
          // 필수 동의 필터링
          if (filters.isRequired !== '') {
            const isRequired = filters.isRequired === 'true';
            filteredData = filteredData.filter(
              (term) => term.isRequired === isRequired
            );
          }
          
          // 페이지네이션 적용
          const start = page * rowsPerPage;
          const paginatedData = filteredData.slice(start, start + rowsPerPage);
          
          setTerms(paginatedData);
          setTotalCount(filteredData.length);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('이용약관 목록을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchTerms();
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
      isRequired: ''
    });
    setSearchQuery('');
  };

  // 상세 페이지로 이동
  const handleViewTerm = (id) => {
    navigate(`/contents/terms/${id}`);
  };

  // 수정 페이지로 이동
  const handleEditTerm = (id) => {
    navigate(`/contents/terms/${id}/edit`);
  };

  // 등록 페이지로 이동
  const handleCreateTerm = () => {
    navigate('/contents/terms/new');
  };

  // 이용약관 삭제 처리
  const handleDeleteTerm = async (id) => {
    if (window.confirm('이 이용약관을 정말 삭제하시겠습니까?')) {
      try {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // await contentsApi.deleteTerm(id);
        
        // 임시 로직 (백엔드 구현 전까지)
        setTimeout(() => {
          const updatedTerms = terms.filter(
            (term) => term.id !== id
          );
          setTerms(updatedTerms);
          alert('이용약관이 삭제되었습니다.');
        }, 500);
      } catch (error) {
        console.error('이용약관 삭제 중 오류 발생:', error);
        alert('이용약관 삭제 중 오류가 발생했습니다.');
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

  // 이용약관 상태 표시 텍스트
  const getStatusLabel = (status) => {
    const statusLabels = {
      published: '게시중',
      draft: '임시저장',
      archived: '보관됨'
    };
    return statusLabels[status] || status;
  };

  // 이용약관 카테고리 표시 텍스트
  const getCategoryLabel = (category) => {
    const categoryLabels = {
      service: '서비스 이용약관',
      privacy: '개인정보 처리방침',
      location: '위치기반 서비스',
      marketing: '마케팅 정보 수신',
      payment: '결제 및 환불',
      thirdParty: '제3자 제공'
    };
    return categoryLabels[category] || category;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          이용약관 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          서비스 이용약관, 개인정보 처리방침 등 정책 문서 관리
        </Typography>
      </Box>

      {/* 검색 및 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="약관 제목, 내용으로 검색"
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
              onClick={handleCreateTerm}
            >
              이용약관 등록
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
                    <MenuItem value="service">서비스 이용약관</MenuItem>
                    <MenuItem value="privacy">개인정보 처리방침</MenuItem>
                    <MenuItem value="location">위치기반 서비스</MenuItem>
                    <MenuItem value="marketing">마케팅 정보 수신</MenuItem>
                    <MenuItem value="payment">결제 및 환불</MenuItem>
                    <MenuItem value="thirdParty">제3자 제공</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>필수 동의</InputLabel>
                  <Select
                    value={filters.isRequired}
                    onChange={(e) => handleFilterChange('isRequired', e.target.value)}
                    label="필수 동의"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="true">필수</MenuItem>
                    <MenuItem value="false">선택</MenuItem>
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

      {/* 이용약관 목록 테이블 */}
      <Card>
        {loading && <LinearProgress />}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>카테고리</TableCell>
                <TableCell>버전</TableCell>
                <TableCell>시행일</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>등록일</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {terms.length > 0 ? (
                terms.map((term) => (
                  <TableRow key={term.id} hover>
                    <TableCell>{term.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {term.isRequired && (
                          <Chip
                            label="필수"
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                        )}
                        <Typography variant="body2" fontWeight="medium">
                          {term.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{getCategoryLabel(term.category)}</TableCell>
                    <TableCell>v{term.version}</TableCell>
                    <TableCell>{formatDate(term.effectiveDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(term.status)}
                        color={statusColors[term.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(term.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="상세보기">
                          <IconButton
                            size="small"
                            onClick={() => handleViewTerm(term.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="수정">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditTerm(term.id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="삭제">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteTerm(term.id)}
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
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      이용약관 데이터가 없습니다.
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

export default TermsList; 