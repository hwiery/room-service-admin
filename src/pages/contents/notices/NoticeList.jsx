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

// 공지사항 상태 색상 정의
const statusColors = {
  published: 'success',
  draft: 'warning',
  archived: 'default'
};

// 목업 데이터
const mockNotices = [
  {
    id: 'NOTICE001',
    title: '서비스 이용약관 변경 안내',
    category: 'service',
    status: 'published',
    isImportant: true,
    viewCount: 1250,
    startDate: '2023-05-01T00:00:00',
    endDate: '2023-12-31T23:59:59',
    createdAt: '2023-04-25T10:30:00',
    updatedAt: '2023-04-28T14:20:00',
    createdBy: '관리자1',
    content: '안녕하세요. 서비스 이용약관이 다음과 같이 변경됩니다. 주요 변경사항은...'
  },
  {
    id: 'NOTICE002',
    title: '여름 성수기 예약 안내',
    category: 'reservation',
    status: 'published',
    isImportant: true,
    viewCount: 980,
    startDate: '2023-06-01T00:00:00',
    endDate: '2023-08-31T23:59:59',
    createdAt: '2023-05-20T09:15:00',
    updatedAt: '2023-05-20T09:15:00',
    createdBy: '관리자2',
    content: '안녕하세요. 2023년 여름 성수기 예약 관련 안내사항입니다. 성수기 기간은...'
  },
  {
    id: 'NOTICE003',
    title: '추석 연휴 고객센터 운영 안내',
    category: 'customerService',
    status: 'published',
    isImportant: false,
    viewCount: 452,
    startDate: '2023-09-15T00:00:00',
    endDate: '2023-09-30T23:59:59',
    createdAt: '2023-09-01T11:20:00',
    updatedAt: '2023-09-01T11:20:00',
    createdBy: '관리자1',
    content: '안녕하세요. 추석 연휴 기간 고객센터 운영 시간을 안내드립니다. 9월 28일부터...'
  },
  {
    id: 'NOTICE004',
    title: '시스템 점검 안내 (임시 저장)',
    category: 'system',
    status: 'draft',
    isImportant: false,
    viewCount: 0,
    startDate: '2023-10-15T00:00:00',
    endDate: '2023-10-15T06:00:00',
    createdAt: '2023-10-05T16:40:00',
    updatedAt: '2023-10-05T16:40:00',
    createdBy: '관리자3',
    content: '안녕하세요. 시스템 점검이 예정되어 있어 안내드립니다. 점검 시간 동안은 서비스 이용이...'
  },
  {
    id: 'NOTICE005',
    title: '개인정보처리방침 개정 안내',
    category: 'policy',
    status: 'published',
    isImportant: true,
    viewCount: 845,
    startDate: '2023-07-01T00:00:00',
    endDate: '2023-12-31T23:59:59',
    createdAt: '2023-06-15T13:25:00',
    updatedAt: '2023-06-16T09:10:00',
    createdBy: '관리자1',
    content: '안녕하세요. 개인정보처리방침이 다음과 같이 개정됩니다. 주요 변경사항은...'
  }
];

/**
 * 공지사항 목록 페이지 컴포넌트
 */
const NoticeList = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
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
    isImportant: ''
  });

  // API에서 공지사항 목록 가져오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const params = {
        //   page: page + 1,
        //   limit: rowsPerPage,
        //   search: searchQuery,
        //   ...filters
        // };
        // const response = await contentsApi.getNotices(params);
        // setNotices(response.data.items);
        // setTotalCount(response.data.totalCount);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          // 검색 및 필터링 처리
          let filteredData = [...mockNotices];
          
          // 검색어 필터링
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredData = filteredData.filter(
              (notice) =>
                notice.id.toLowerCase().includes(query) ||
                notice.title.toLowerCase().includes(query) ||
                notice.content.toLowerCase().includes(query)
            );
          }
          
          // 상태 필터링
          if (filters.status) {
            filteredData = filteredData.filter(
              (notice) => notice.status === filters.status
            );
          }
          
          // 카테고리 필터링
          if (filters.category) {
            filteredData = filteredData.filter(
              (notice) => notice.category === filters.category
            );
          }
          
          // 중요 공지 필터링
          if (filters.isImportant !== '') {
            const isImportant = filters.isImportant === 'true';
            filteredData = filteredData.filter(
              (notice) => notice.isImportant === isImportant
            );
          }
          
          // 페이지네이션 적용
          const start = page * rowsPerPage;
          const paginatedData = filteredData.slice(start, start + rowsPerPage);
          
          setNotices(paginatedData);
          setTotalCount(filteredData.length);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('공지사항 목록을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchNotices();
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
      isImportant: ''
    });
    setSearchQuery('');
  };

  // 상세 페이지로 이동
  const handleViewNotice = (id) => {
    navigate(`/contents/notices/${id}`);
  };

  // 수정 페이지로 이동
  const handleEditNotice = (id) => {
    navigate(`/contents/notices/${id}/edit`);
  };

  // 등록 페이지로 이동
  const handleCreateNotice = () => {
    navigate('/contents/notices/new');
  };

  // 공지사항 삭제 처리
  const handleDeleteNotice = async (id) => {
    if (window.confirm('이 공지사항을 정말 삭제하시겠습니까?')) {
      try {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // await contentsApi.deleteNotice(id);
        
        // 임시 로직 (백엔드 구현 전까지)
        setTimeout(() => {
          const updatedNotices = notices.filter(
            (notice) => notice.id !== id
          );
          setNotices(updatedNotices);
          alert('공지사항이 삭제되었습니다.');
        }, 500);
      } catch (error) {
        console.error('공지사항 삭제 중 오류 발생:', error);
        alert('공지사항 삭제 중 오류가 발생했습니다.');
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

  // 공지사항 상태 표시 텍스트
  const getStatusLabel = (status) => {
    const statusLabels = {
      published: '게시중',
      draft: '임시저장',
      archived: '보관됨'
    };
    return statusLabels[status] || status;
  };

  // 공지사항 카테고리 표시 텍스트
  const getCategoryLabel = (category) => {
    const categoryLabels = {
      service: '서비스 안내',
      reservation: '예약 안내',
      customerService: '고객센터',
      system: '시스템',
      policy: '정책/약관',
      event: '이벤트'
    };
    return categoryLabels[category] || category;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          공지사항 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          서비스 공지사항, 정책 및 이용 안내 관리
        </Typography>
      </Box>

      {/* 검색 및 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="공지사항 제목, 내용으로 검색"
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
              onClick={handleCreateNotice}
            >
              공지사항 등록
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
                    <MenuItem value="service">서비스 안내</MenuItem>
                    <MenuItem value="reservation">예약 안내</MenuItem>
                    <MenuItem value="customerService">고객센터</MenuItem>
                    <MenuItem value="system">시스템</MenuItem>
                    <MenuItem value="policy">정책/약관</MenuItem>
                    <MenuItem value="event">이벤트</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>중요 공지</InputLabel>
                  <Select
                    value={filters.isImportant}
                    onChange={(e) => handleFilterChange('isImportant', e.target.value)}
                    label="중요 공지"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="true">중요</MenuItem>
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

      {/* 공지사항 목록 테이블 */}
      <Card>
        {loading && <LinearProgress />}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>카테고리</TableCell>
                <TableCell>게시 기간</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>조회수</TableCell>
                <TableCell>등록일</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <TableRow key={notice.id} hover>
                    <TableCell>{notice.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {notice.isImportant && (
                          <Chip
                            label="중요"
                            color="error"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                        )}
                        <Typography variant="body2" fontWeight="medium">
                          {notice.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{getCategoryLabel(notice.category)}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(notice.startDate)}
                      </Typography>
                      <Typography variant="body2">
                        ~ {formatDate(notice.endDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(notice.status)}
                        color={statusColors[notice.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{notice.viewCount.toLocaleString()}</TableCell>
                    <TableCell>{formatDate(notice.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="상세보기">
                          <IconButton
                            size="small"
                            onClick={() => handleViewNotice(notice.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="수정">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditNotice(notice.id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="삭제">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteNotice(notice.id)}
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
                      공지사항 데이터가 없습니다.
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

export default NoticeList; 