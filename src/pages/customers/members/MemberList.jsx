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
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
  Block as BlockIcon,
  Check as CheckIcon
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

// 목업 데이터
const mockMembers = [
  {
    id: 'M001',
    name: '김철수',
    email: 'kim@example.com',
    phoneNumber: '010-1234-5678',
    status: 'active',
    tier: 'standard',
    registrationDate: '2023-01-15T10:30:45',
    lastLoginDate: '2023-06-01T14:22:36',
    reservationCount: 3,
    totalSpent: 580000
  },
  {
    id: 'M002',
    name: '이영희',
    email: 'lee@example.com',
    phoneNumber: '010-9876-5432',
    status: 'active',
    tier: 'gold',
    registrationDate: '2022-08-20T09:15:22',
    lastLoginDate: '2023-05-28T16:40:55',
    reservationCount: 8,
    totalSpent: 1650000
  },
  {
    id: 'M003',
    name: '박지민',
    email: 'park@example.com',
    phoneNumber: '010-5555-1234',
    status: 'inactive',
    tier: 'silver',
    registrationDate: '2022-11-05T11:20:18',
    lastLoginDate: '2023-03-10T08:35:47',
    reservationCount: 5,
    totalSpent: 920000
  },
  {
    id: 'M004',
    name: '최서연',
    email: 'choi@example.com',
    phoneNumber: '010-2222-3333',
    status: 'blocked',
    tier: 'standard',
    registrationDate: '2023-02-28T08:30:51',
    lastLoginDate: '2023-04-15T17:45:12',
    reservationCount: 1,
    totalSpent: 150000
  },
  {
    id: 'M005',
    name: '정현우',
    email: 'jung@example.com',
    phoneNumber: '010-7777-8888',
    status: 'active',
    tier: 'platinum',
    registrationDate: '2022-05-10T13:40:28',
    lastLoginDate: '2023-06-05T10:15:36',
    reservationCount: 12,
    totalSpent: 2850000
  }
];

/**
 * 회원 목록 페이지 컴포넌트
 */
const MemberList = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // 검색 및 필터링 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    tier: ''
  });

  // API에서 회원 목록 가져오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const params = {
        //   page: page + 1,
        //   limit: rowsPerPage,
        //   search: searchQuery,
        //   ...filters
        // };
        // const response = await customerApi.getMembers(params);
        // setMembers(response.data.items);
        // setTotalCount(response.data.totalCount);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          // 검색 및 필터링 처리
          let filteredData = [...mockMembers];
          
          // 검색어 필터링
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredData = filteredData.filter(
              (member) =>
                member.id.toLowerCase().includes(query) ||
                member.name.toLowerCase().includes(query) ||
                member.email.toLowerCase().includes(query) ||
                member.phoneNumber.includes(query)
            );
          }
          
          // 상태 필터링
          if (filters.status) {
            filteredData = filteredData.filter(
              (member) => member.status === filters.status
            );
          }
          
          // 등급 필터링
          if (filters.tier) {
            filteredData = filteredData.filter(
              (member) => member.tier === filters.tier
            );
          }
          
          // 페이지네이션 적용
          const start = page * rowsPerPage;
          const paginatedData = filteredData.slice(start, start + rowsPerPage);
          
          setMembers(paginatedData);
          setTotalCount(filteredData.length);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('회원 목록을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchMembers();
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
      tier: ''
    });
    setPage(0);
  };

  // 회원 상세 페이지 이동 핸들러
  const handleViewMember = (id) => {
    navigate(`/customers/members/${id}`);
  };

  // 회원 상태 변경 핸들러
  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await customerApi.updateMemberStatus(id, newStatus);
      
      // 백엔드 구현 전까지 목업 처리
      console.log(`회원 상태 변경: ${id}, ${newStatus}`);
      
      // 클라이언트 측 상태 업데이트
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === id ? { ...member, status: newStatus } : member
        )
      );
      
      setLoading(false);
    } catch (error) {
      console.error('회원 상태 변경 중 오류가 발생했습니다:', error);
      setLoading(false);
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

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          회원 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          회원 목록 조회 및 관리
        </Typography>
      </Box>

      {/* 검색 및 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="회원번호, 이름, 이메일, 전화번호로 검색"
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
              onClick={() => navigate('/customers/members/stats')}
            >
              회원 통계
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={() => navigate('/customers/members/blacklist')}
            >
              블랙리스트 관리
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/customers/privacy')}
            >
              개인정보 보호
            </Button>
          </Grid>
          
          {filterOpen && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>회원 상태</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="회원 상태"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="active">활성</MenuItem>
                    <MenuItem value="inactive">비활성</MenuItem>
                    <MenuItem value="blocked">차단</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>회원 등급</InputLabel>
                  <Select
                    value={filters.tier}
                    onChange={(e) => handleFilterChange('tier', e.target.value)}
                    label="회원 등급"
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="standard">일반</MenuItem>
                    <MenuItem value="silver">실버</MenuItem>
                    <MenuItem value="gold">골드</MenuItem>
                    <MenuItem value="platinum">플래티넘</MenuItem>
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

      {/* 회원 목록 테이블 */}
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
                <TableCell>상태</TableCell>
                <TableCell>등급</TableCell>
                <TableCell>가입일</TableCell>
                <TableCell>예약수</TableCell>
                <TableCell>총 사용액</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.length > 0 ? (
                members.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phoneNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(member.status)}
                        color={statusColors[member.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTierLabel(member.tier)}
                        color={tierColors[member.tier]}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{formatDate(member.registrationDate)}</TableCell>
                    <TableCell>{member.reservationCount}</TableCell>
                    <TableCell>{formatPrice(member.totalSpent)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {member.status === 'active' ? (
                          <Tooltip title="차단">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleStatusChange(member.id, 'blocked')}
                            >
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : member.status === 'blocked' ? (
                          <Tooltip title="활성화">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleStatusChange(member.id, 'active')}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : null}
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
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      회원 데이터가 없습니다.
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

export default MemberList; 