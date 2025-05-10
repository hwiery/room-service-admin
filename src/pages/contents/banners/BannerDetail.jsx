import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardMedia,
  Container,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  NavigateNext as NavigateNextIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

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
  }
];

/**
 * 배너 상세 페이지 컴포넌트
 */
const BannerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  // API에서 배너 상세 정보 가져오기
  useEffect(() => {
    const fetchBannerDetail = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await contentsApi.getBannerById(id);
        // setBanner(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          const foundBanner = mockBanners.find(
            (banner) => banner.id === id
          );
          
          if (foundBanner) {
            setBanner(foundBanner);
          } else {
            // 배너를 찾을 수 없는 경우
            navigate('/not-found');
          }
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('배너 상세 정보를 가져오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchBannerDetail();
  }, [id, navigate]);

  // 목록으로 돌아가기
  const handleBack = () => {
    navigate('/contents/banners');
  };

  // 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/contents/banners/${id}/edit`);
  };

  // 배너 삭제
  const handleDelete = async () => {
    if (window.confirm('이 배너를 정말 삭제하시겠습니까?')) {
      try {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // await contentsApi.deleteBanner(id);
        
        // 임시 로직 (백엔드 구현 전까지)
        setTimeout(() => {
          navigate('/contents/banners');
        }, 500);
      } catch (error) {
        console.error('배너 삭제 중 오류 발생:', error);
        alert('배너 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'yyyy.MM.dd');
    } catch (error) {
      return dateString;
    }
  };

  // 배너 상태 계산
  const calculateStatus = (banner) => {
    if (!banner) return '';

    const now = new Date();
    const startDate = parseISO(banner.startDate);
    const endDate = parseISO(banner.endDate);

    if (banner.status === 'draft') return 'draft';
    if (now < startDate) return 'scheduled';
    if (now > endDate) return 'ended';
    return 'active';
  };

  // 상태 라벨 표시
  const getStatusLabel = (status) => {
    const statusLabels = {
      active: '진행중',
      scheduled: '예정됨',
      ended: '종료됨',
      draft: '초안'
    };
    return statusLabels[status] || status;
  };

  // 타입 라벨 표시
  const getTypeLabel = (type) => {
    const typeLabels = {
      main: '메인',
      sub: '서브',
      popup: '팝업'
    };
    return typeLabels[type] || type;
  };

  // 위치 라벨 표시
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* 브레드크럼 네비게이션 */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Link color="inherit" href="/dashboard" underline="hover">대시보드</Link>
        <Link color="inherit" href="/contents/banners" underline="hover">배너 관리</Link>
        <Typography color="text.primary">배너 상세</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">배너 상세 정보</Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            삭제
          </Button>
        </Box>
      </Paper>
      
      {/* 로딩 표시 */}
      {loading && <LinearProgress sx={{ mb: 3 }} />}
      
      {/* 배너 상세 정보 */}
      {banner && !loading && (
        <Grid container spacing={3}>
          {/* 왼쪽 섹션: 기본 정보 */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" gutterBottom>{banner.title}</Typography>
                  <Chip
                    label={getStatusLabel(calculateStatus(banner))}
                    color={statusColors[calculateStatus(banner)]}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {banner.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" width="30%">배너 ID</TableCell>
                        <TableCell>{banner.id}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">타입</TableCell>
                        <TableCell>{getTypeLabel(banner.type)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">위치</TableCell>
                        <TableCell>{getPositionLabel(banner.position)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">링크 URL</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {banner.linkUrl}
                            {banner.linkUrl && (
                              <IconButton 
                                size="small" 
                                color="primary" 
                                sx={{ ml: 1 }}
                                onClick={() => window.open(banner.linkUrl, '_blank')}
                              >
                                <LinkIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">기간</TableCell>
                        <TableCell>{`${formatDate(banner.startDate)} ~ ${formatDate(banner.endDate)}`}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">우선순위</TableCell>
                        <TableCell>{banner.priority}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">등록자</TableCell>
                        <TableCell>{banner.createdBy}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">등록일</TableCell>
                        <TableCell>{formatDate(banner.createdAt)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">최종 수정일</TableCell>
                        <TableCell>{formatDate(banner.updatedAt)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Card>
          </Grid>
          
          {/* 오른쪽 섹션: 이미지 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                image={banner.imagePath || '/images/placeholder.jpg'}
                alt={banner.title}
                sx={{ width: '100%', height: 'auto', maxHeight: 400 }}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2">배너 이미지</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default BannerDetail; 