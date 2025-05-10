import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
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
  Toolbar,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterAlt as FilterAltIcon
} from '@mui/icons-material';
import { productApi } from '../../../api';

// 목업 데이터
const mockCategories = [
  { id: 'hotel', name: '호텔' },
  { id: 'resort', name: '리조트' },
  { id: 'pension', name: '펜션' },
  { id: 'guesthouse', name: '게스트하우스' },
  { id: 'villa', name: '빌라' }
];

const mockData = {
  items: [
    {
      id: 'acc001',
      name: '서울 시그니처 호텔',
      address: '서울시 강남구 테헤란로 123',
      category: '호텔',
      rooms: 25,
      rating: 4.5,
      status: 'active'
    },
    {
      id: 'acc002',
      name: '부산 해변 리조트',
      address: '부산시 해운대구 해운대해변로 456',
      category: '리조트',
      rooms: 40,
      rating: 4.7,
      status: 'active'
    },
    {
      id: 'acc003',
      name: '제주 올레 펜션',
      address: '제주도 서귀포시 중문관광로 789',
      category: '펜션',
      rooms: 10,
      rating: 4.2,
      status: 'active'
    },
    {
      id: 'acc004',
      name: '강원도 힐링 캐빈',
      address: '강원도 평창군 대관령면 솔봉로 101',
      category: '펜션',
      rooms: 8,
      rating: 4.8,
      status: 'active'
    },
    {
      id: 'acc005',
      name: '인천 하버 호텔',
      address: '인천시 중구 공항로 233',
      category: '호텔',
      rooms: 32,
      rating: 4.0,
      status: 'inactive'
    }
  ],
  total: 5
};

/**
 * 숙소 상태에 따른 표시 스타일
 */
const getStatusStyles = (status) => {
  switch (status) {
    case 'active':
      return {
        color: 'success.main',
        label: '운영중'
      };
    case 'inactive':
      return {
        color: 'text.disabled',
        label: '비활성'
      };
    case 'pending':
      return {
        color: 'warning.main',
        label: '대기중'
      };
    default:
      return {
        color: 'text.primary',
        label: status
      };
  }
};

/**
 * 숙소 목록 페이지 컴포넌트
 */
const AccommodationList = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accommodationToDelete, setAccommodationToDelete] = useState(null);

  // API에서 숙소 목록 및 카테고리 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const params = {
        //   page: page + 1,
        //   limit: rowsPerPage,
        //   search: searchTerm,
        //   category: selectedCategory
        // };
        // const [accommodationsResponse, categoriesResponse] = await Promise.all([
        //   productApi.getAccommodations(params),
        //   productApi.getCategories()
        // ]);
        
        // setAccommodations(accommodationsResponse.data.items);
        // setTotalCount(accommodationsResponse.data.total);
        // setCategories(categoriesResponse.data);

        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          setAccommodations(mockData.items);
          setTotalCount(mockData.total);
          setCategories(mockCategories);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('숙소 목록을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page, rowsPerPage, searchTerm, selectedCategory]);

  // 검색어 변경 핸들러
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // 카테고리 필터 변경 핸들러
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(0);
  };

  // 페이지 변경 핸들러
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 페이지당 행 수 변경 핸들러
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPage(0);
  };

  // 삭제 다이얼로그 열기
  const handleOpenDeleteDialog = (accommodation) => {
    setAccommodationToDelete(accommodation);
    setDeleteDialogOpen(true);
  };

  // 삭제 다이얼로그 닫기
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAccommodationToDelete(null);
  };

  // 숙소 삭제 핸들러
  const handleDelete = async () => {
    if (!accommodationToDelete) return;

    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await productApi.deleteAccommodation(accommodationToDelete.id);
      
      // 백엔드 구현 전까지 목업 처리
      console.log(`숙소 삭제: ${accommodationToDelete.id}`);
      
      // 클라이언트 측 상태 업데이트
      const updatedAccommodations = accommodations.filter(
        item => item.id !== accommodationToDelete.id
      );
      
      setAccommodations(updatedAccommodations);
      setTotalCount(totalCount - 1);
      
      // 다이얼로그 닫기
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('숙소 삭제 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          숙소 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          숙소 정보를 등록하고 관리할 수 있습니다.
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <TextField
              size="small"
              placeholder="숙소명 또는 주소 검색"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ mr: 2, width: { xs: '100%', sm: '300px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              select
              size="small"
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="카테고리"
              sx={{ mr: 2, width: { xs: '100%', sm: '150px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterAltIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">전체 카테고리</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>

            <Tooltip title="필터 초기화">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/products/accommodations/new"
            >
              숙소 등록
            </Button>
          </Box>
        </Toolbar>
      </Paper>

      <Card>
        {loading && <LinearProgress />}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>숙소명</TableCell>
                <TableCell>주소</TableCell>
                <TableCell>카테고리</TableCell>
                <TableCell align="center">객실 수</TableCell>
                <TableCell align="center">평점</TableCell>
                <TableCell align="center">상태</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accommodations.length > 0 ? (
                accommodations.map((accommodation) => {
                  const statusStyle = getStatusStyles(accommodation.status);
                  
                  return (
                    <TableRow key={accommodation.id} hover>
                      <TableCell>{accommodation.id}</TableCell>
                      <TableCell>
                        <Box
                          component={RouterLink}
                          to={`/products/accommodations/${accommodation.id}`}
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {accommodation.name}
                        </Box>
                      </TableCell>
                      <TableCell>{accommodation.address}</TableCell>
                      <TableCell>{accommodation.category}</TableCell>
                      <TableCell align="center">{accommodation.rooms}</TableCell>
                      <TableCell align="center">{accommodation.rating.toFixed(1)}</TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          sx={{ color: statusStyle.color, fontWeight: 'medium' }}
                        >
                          {statusStyle.label}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="수정">
                          <IconButton
                            component={RouterLink}
                            to={`/products/accommodations/${accommodation.id}/edit`}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="삭제">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDeleteDialog(accommodation)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : !loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchTerm || selectedCategory
                        ? '검색 결과가 없습니다'
                        : '등록된 숙소가 없습니다'}
                    </Typography>
                    {!searchTerm && !selectedCategory && (
                      <Button
                        variant="text"
                        component={RouterLink}
                        to="/products/accommodations/new"
                        startIcon={<AddIcon />}
                        sx={{ mt: 1 }}
                      >
                        새 숙소 등록하기
                      </Button>
                    )}
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
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="페이지당 행 수:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count !== -1 ? count : `${to}+`}`
          }
        />
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>숙소 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {accommodationToDelete && (
              `'${accommodationToDelete.name}' 숙소를 정말로 삭제하시겠습니까?
              삭제된 데이터는 복구할 수 없습니다.`
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>취소</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AccommodationList; 