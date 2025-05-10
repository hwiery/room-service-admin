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

// 프로모션 상태 색상 정의
const statusColors = {
  active: 'success',
  scheduled: 'info',
  ended: 'default',
  draft: 'warning'
};

// 목업 데이터
const mockPromotions = [
  {
    id: 'PROMO001',
    title: '여름 특가 프로모션',
    type: 'discount',
    discountRate: 15,
    startDate: '2023-07-01T00:00:00',
    endDate: '2023-08-31T23:59:59',
    targetAccommodations: ['ALL'],
    status: 'active',
    createdAt: '2023-06-15T10:30:00',
    updatedAt: '2023-06-15T10:30:00',
    createdBy: '관리자1',
    priority: 1,
    thumbnail: '/images/promotions/summer_special.jpg',
    description: '뜨거운 여름, 시원한 할인! 모든 숙소 15% 할인 이벤트'
  },
  {
    id: 'PROMO002',
    title: '얼리버드 예약 할인',
    type: 'discount',
    discountRate: 20,
    startDate: '2023-09-01T00:00:00',
    endDate: '2023-10-31T23:59:59',
    targetAccommodations: ['A001', 'A003', 'A005'],
    status: 'scheduled',
    createdAt: '2023-06-20T14:20:00',
    updatedAt: '2023-06-22T09:15:00',
    createdBy: '관리자2',
    priority: 2,
    thumbnail: '/images/promotions/early_bird.jpg',
    description: '30일 이전 예약 시 20% 특별 할인'
  },
  {
    id: 'PROMO003',
    title: '봄 시즌 특별 패키지',
    type: 'package',
    discountRate: null,
    startDate: '2023-03-01T00:00:00',
    endDate: '2023-05-31T23:59:59',
    targetAccommodations: ['A002', 'A004'],
    status: 'ended',
    createdAt: '2023-02-10T11:45:00',
    updatedAt: '2023-05-31T23:59:59',
    createdBy: '관리자1',
    priority: 3,
    thumbnail: '/images/promotions/spring_package.jpg',
    description: '봄 시즌 특별 패키지 - 조식 무료 제공 및 관광지 입장권 포함'
  },
  {
    id: 'PROMO004',
    title: '겨울 패키지 (초안)',
    type: 'package',
    discountRate: 10,
    startDate: '2023-12-01T00:00:00',
    endDate: '2024-02-28T23:59:59',
    targetAccommodations: ['A001', 'A002', 'A003', 'A004', 'A005'],
    status: 'draft',
    createdAt: '2023-06-25T15:30:00',
    updatedAt: '2023-06-25T15:30:00',
    createdBy: '관리자3',
    priority: 4,
    thumbnail: '/images/promotions/winter_draft.jpg',
    description: '겨울 시즌 스키 패키지 - 리프트권 포함 및 10% 객실 할인'
  },
  {
    id: 'PROMO005',
    title: '명절 특별 프로모션',
    type: 'discount',
    discountRate: 25,
    startDate: '2023-09-28T00:00:00',
    endDate: '2023-10-03T23:59:59',
    targetAccommodations: ['ALL'],
    status: 'scheduled',
    createdAt: '2023-06-30T09:10:00',
    updatedAt: '2023-06-30T09:10:00',
    createdBy: '관리자1',
    priority: 1,
    thumbnail: '/images/promotions/holiday_special.jpg',
    description: '한가위 맞이 전 객실 25% 할인 특별 프로모션'
  }
];

/**
 * 프로모션 목록 페이지 컴포넌트
 */
const PromotionList = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
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

  // API에서 프로모션 목록 가져오기
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const params = {
        //   page: page + 1,
        //   limit: rowsPerPage,
        //   search: searchQuery,
        //   ...filters
        // };
        // const response = await contentsApi.getPromotions(params);
        // setPromotions(response.data.items);
        // setTotalCount(response.data.totalCount);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          // 검색 및 필터링 처리
          let filteredData = [...mockPromotions];
          
          // 검색어 필터링
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredData = filteredData.filter(
              (promotion) =>
                promotion.id.toLowerCase().includes(query) ||
                promotion.title.toLowerCase().includes(query) ||
                promotion.description.toLowerCase().includes(query)
            );
          }
          
          // 상태 필터링
          if (filters.status) {
            filteredData = filteredData.filter(
              (promotion) => promotion.status === filters.status
            );
          }
          
          // 타입 필터링
          if (filters.type) {
            filteredData = filteredData.filter(
              (promotion) => promotion.type === filters.type
            );
          }
          
          // 페이지네이션 적용
          const start = page * rowsPerPage;
          const paginatedData = filteredData.slice(start, start + rowsPerPage);
          
          setPromotions(paginatedData);
          setTotalCount(filteredData.length);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('프로모션 목록을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchPromotions();
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
  const handleViewPromotion = (id) => {
    navigate(`/contents/promotions/${id}`);
  };

  // 수정 페이지로 이동
  const handleEditPromotion = (id) => {
    navigate(`/contents/promotions/${id}/edit`);
  };

  // 등록 페이지로 이동
  const handleCreatePromotion = () => {
    navigate('/contents/promotions/new');
  };

  // 프로모션 삭제 처리
  const handleDeletePromotion = async (id) => {
    if (window.confirm('이 프로모션을 정말 삭제하시겠습니까?')) {
      try {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // await contentsApi.deletePromotion(id);
        
        // 임시 로직 (백엔드 구현 전까지)
        setTimeout(() => {
          const updatedPromotions = promotions.filter(
            (promotion) => promotion.id !== id
          );
          setPromotions(updatedPromotions);
          alert('프로모션이 삭제되었습니다.');
        }, 500);
      } catch (error) {
        console.error('프로모션 삭제 중 오류 발생:', error);
        alert('프로모션 삭제 중 오류가 발생했습니다.');
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

  // 프로모션 상태 계산 함수
  const calculateStatus = (promotion) => {
    const now = new Date();
    const startDate = parseISO(promotion.startDate);
    const endDate = parseISO(promotion.endDate);
    
    if (promotion.status === 'draft') {
      return 'draft';
    } else if (isBefore(now, startDate)) {
      return 'scheduled';
    } else if (isAfter(now, endDate)) {
      return 'ended';
    } else {
      return 'active';
    }
  };

  // 프로모션 상태 표시 텍스트
  const getStatusLabel = (status) => {
    const statusLabels = {
      active: '진행중',
      scheduled: '예정됨',
      ended: '종료됨',
      draft: '초안'
    };
    return statusLabels[status] || status;
  };

  // 프로모션 타입 표시 텍스트
  const getTypeLabel = (type) => {
    const typeLabels = {
      discount: '할인',
      package: '패키지',
      gift: '사은품',
      event: '이벤트'
    };
    return typeLabels[type] || type;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          프로모션/이벤트 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          할인, 패키지, 이벤트 등 각종 프로모션 관리
        </Typography>
      </Box>

      {/* 검색 및 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="프로모션 번호, 제목, 설명으로 검색"
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
              onClick={handleCreatePromotion}
            >
              프로모션 등록
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
                    <MenuItem value="discount">할인</MenuItem>
                    <MenuItem value="package">패키지</MenuItem>
                    <MenuItem value="gift">사은품</MenuItem>
                    <MenuItem value="event">이벤트</MenuItem>
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

      {/* 프로모션 목록 테이블 */}
      <Card>
        {loading && <LinearProgress />}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>프로모션 ID</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>타입</TableCell>
                <TableCell>할인율</TableCell>
                <TableCell>기간</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>우선순위</TableCell>
                <TableCell>등록일</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promotions.length > 0 ? (
                promotions.map((promotion) => {
                  // 현재 상태 계산
                  const currentStatus = calculateStatus(promotion);
                  
                  return (
                    <TableRow key={promotion.id} hover>
                      <TableCell>{promotion.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {promotion.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {promotion.description.length > 50
                            ? `${promotion.description.substring(0, 50)}...`
                            : promotion.description}
                        </Typography>
                      </TableCell>
                      <TableCell>{getTypeLabel(promotion.type)}</TableCell>
                      <TableCell>
                        {promotion.discountRate ? `${promotion.discountRate}%` : '-'}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(promotion.startDate)}
                        </Typography>
                        <Typography variant="body2">
                          ~ {formatDate(promotion.endDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(currentStatus)}
                          color={statusColors[currentStatus]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{promotion.priority}</TableCell>
                      <TableCell>{formatDate(promotion.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Tooltip title="상세보기">
                            <IconButton
                              size="small"
                              onClick={() => handleViewPromotion(promotion.id)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="수정">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditPromotion(promotion.id)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="삭제">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeletePromotion(promotion.id)}
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
                      프로모션 데이터가 없습니다.
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

export default PromotionList; 