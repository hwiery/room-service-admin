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
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';

// 배너 상태 색상 정의
const statusColors = {
  active: 'success',
  scheduled: 'info',
  ended: 'default',
  draft: 'warning'
};

// 목업 데이터
const mockBanners = [
  {
    id: 'BANNER001',
    title: '여름 시즌 특별 할인',
    type: 'main',
    position: 'top',
    startDate: '2023-07-01T00:00:00',
    endDate: '2023-08-31T23:59:59',
    linkUrl: '/promotions/summer2023',
    status: 'active',
    createdAt: '2023-06-15T10:30:00',
    updatedAt: '2023-06-15T10:30:00',
    createdBy: '관리자1',
    priority: 1,
    imagePath: '/images/banners/summer_sale.jpg',
    description: '모든 숙소 최대 30% 할인 이벤트'
  },
  {
    id: 'BANNER002',
    title: '가을 여행 기획전',
    type: 'main',
    position: 'middle',
    startDate: '2023-09-01T00:00:00',
    endDate: '2023-10-31T23:59:59',
    linkUrl: '/promotions/autumn2023',
    status: 'scheduled',
    createdAt: '2023-06-20T14:20:00',
    updatedAt: '2023-06-22T09:15:00',
    createdBy: '관리자2',
    priority: 2,
    imagePath: '/images/banners/autumn_travel.jpg',
    description: '가을 단풍 명소 특별 패키지'
  },
  {
    id: 'BANNER003',
    title: '봄 시즌 프로모션',
    type: 'sub',
    position: 'side',
    startDate: '2023-03-01T00:00:00',
    endDate: '2023-05-31T23:59:59',
    linkUrl: '/promotions/spring2023',
    status: 'ended',
    createdAt: '2023-02-10T11:45:00',
    updatedAt: '2023-05-31T23:59:59',
    createdBy: '관리자1',
    priority: 3,
    imagePath: '/images/banners/spring_promotion.jpg',
    description: '봄 시즌 특별 할인 및 패키지'
  },
  {
    id: 'BANNER004',
    title: '겨울 시즌 프로모션 (초안)',
    type: 'popup',
    position: 'center',
    startDate: '2023-12-01T00:00:00',
    endDate: '2024-02-28T23:59:59',
    linkUrl: '/promotions/winter2023',
    status: 'draft',
    createdAt: '2023-06-25T15:30:00',
    updatedAt: '2023-06-25T15:30:00',
    createdBy: '관리자3',
    priority: 4,
    imagePath: '/images/banners/winter_draft.jpg',
    description: '겨울 스키 시즌 특별 프로모션'
  },
  {
    id: 'BANNER005',
    title: '명절 특별 프로모션',
    type: 'main',
    position: 'top',
    startDate: '2023-09-28T00:00:00',
    endDate: '2023-10-03T23:59:59',
    linkUrl: '/promotions/holiday2023',
    status: 'scheduled',
    createdAt: '2023-06-30T09:10:00',
    updatedAt: '2023-06-30T09:10:00',
    createdBy: '관리자1',
    priority: 1,
    imagePath: '/images/banners/holiday_special.jpg',
    description: '한가위 맞이 전 객실 특별 할인'
  }
];

/**
 * 배너 목록 페이지 컴포넌트
 */
const BannerList = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // 검색 및 필터링 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: ''
  });

  // API에서 배너 목록 가져오기
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const params = {
        //   page: page + 1,
        //   limit: rowsPerPage,
        //   search: searchQuery,
        //   ...filters
        // };
        // const response = await contentsApi.getBanners(params);
        // setBanners(response.data.items);
        // setTotalCount(response.data.totalCount);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          // 검색 및 필터링 처리
          let filteredData = [...mockBanners];
          
          // 검색어 필터링
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredData = filteredData.filter(
              (banner) =>
                banner.id.toLowerCase().includes(query) ||
                banner.title.toLowerCase().includes(query) ||
                banner.description.toLowerCase().includes(query)
            );
          }
          
          // 상태 필터링
          if (filters.status) {
            filteredData = filteredData.filter(
              (banner) => banner.status === filters.status
            );
          }
          
          // 타입 필터링
          if (filters.type) {
            filteredData = filteredData.filter(
              (banner) => banner.type === filters.type
            );
          }
          
          // 페이지네이션 적용
          const start = page * rowsPerPage;
          const paginatedData = filteredData.slice(start, start + rowsPerPage);
          
          setBanners(paginatedData);
          setTotalCount(filteredData.length);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('배너 목록을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchBanners();
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
      type: ''
    });
    setSearchQuery('');
  };

  // 상세 페이지로 이동
  const handleViewBanner = (id) => {
    navigate(`/contents/banners/${id}`);
  };

  // 수정 페이지로 이동
  const handleEditBanner = (id) => {
    navigate(`/contents/banners/${id}/edit`);
  };

  // 등록 페이지로 이동
  const handleCreateBanner = () => {
    navigate('/contents/banners/new');
  };

  // 배너 삭제 처리
  const handleDeleteBanner = async (id) => {
    if (window.confirm('이 배너를 정말 삭제하시겠습니까?')) {
      try {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // await contentsApi.deleteBanner(id);
        
        // 임시 로직 (백엔드 구현 전까지)
        setTimeout(() => {
          const updatedBanners = banners.filter(
            (banner) => banner.id !== id
          );
          setBanners(updatedBanners);
          alert('배너가 삭제되었습니다.');
        }, 500);
      } catch (error) {
        console.error('배너 삭제 중 오류 발생:', error);
        alert('배너 삭제 중 오류가 발생했습니다.');
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

  // 배너 상태 계산 함수
  const calculateStatus = (banner) => {
    const now = new Date();
    const startDate = parseISO(banner.startDate);
    const endDate = parseISO(banner.endDate);
    
    if (banner.status === 'draft') {
      return 'draft';
    } else if (isBefore(now, startDate)) {
      return 'scheduled';
    } else if (isAfter(now, endDate)) {
      return 'ended';
    } else {
      return 'active';
    }
  };

  // 배너 상태 표시 텍스트
  const getStatusLabel = (status) => {
    const statusLabels = {
      active: '진행중',
      scheduled: '예정됨',
      ended: '종료됨',
      draft: '초안'
    };
    return statusLabels[status] || status;
  };

  // 배너 타입 표시 텍스트
  const getTypeLabel = (type) => {
    const typeLabels = {
      main: '메인',
      sub: '서브',
      popup: '팝업'
    };
    return typeLabels[type] || type;
  };

  // 배너 위치 표시 텍스트
  const getPositionLabel = (position) => {
    const positionLabels = {
      top: '상단',
      middle: '중단',
      bottom: '하단',
      side: '사이드',
      center: '중앙'
    };
    return positionLabels[position] || position;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          배너 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          메인 페이지 및 기타 페이지에 노출되는 배너 관리
        </Typography>
      </Box>

      {/* 검색 및 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="배너 ID, 제목, 설명으로 검색"
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
              onClick={handleCreateBanner}
            >
              배너 등록
            </Button>
          </Grid>
          
          {filterOpen && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>상태</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="상태"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="active">진행중</MenuItem>
                    <MenuItem value="scheduled">예정됨</MenuItem>
                    <MenuItem value="ended">종료됨</MenuItem>
                    <MenuItem value="draft">초안</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>타입</InputLabel>
                  <Select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    label="타입"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="main">메인</MenuItem>
                    <MenuItem value="sub">서브</MenuItem>
                    <MenuItem value="popup">팝업</MenuItem>
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

      {/* 배너 목록 테이블 */}
      <Card>
        {loading && <LinearProgress />}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>배너 ID</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>타입</TableCell>
                <TableCell>위치</TableCell>
                <TableCell>기간</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>우선순위</TableCell>
                <TableCell>등록일</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {banners.length > 0 ? (
                banners.map((banner) => {
                  // 현재 상태 계산
                  const currentStatus = calculateStatus(banner);
                  
                  return (
                    <TableRow key={banner.id} hover>
                      <TableCell>{banner.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {banner.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {banner.description.length > 50
                            ? `${banner.description.substring(0, 50)}...`
                            : banner.description}
                        </Typography>
                      </TableCell>
                      <TableCell>{getTypeLabel(banner.type)}</TableCell>
                      <TableCell>{getPositionLabel(banner.position)}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(banner.startDate)}
                        </Typography>
                        <Typography variant="body2">
                          ~ {formatDate(banner.endDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(currentStatus)}
                          color={statusColors[currentStatus]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{banner.priority}</TableCell>
                      <TableCell>{formatDate(banner.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Tooltip title="상세보기">
                            <IconButton
                              size="small"
                              onClick={() => handleViewBanner(banner.id)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="수정">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditBanner(banner.id)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="삭제">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteBanner(banner.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : !loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      배너 데이터가 없습니다.
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

export default BannerList; 