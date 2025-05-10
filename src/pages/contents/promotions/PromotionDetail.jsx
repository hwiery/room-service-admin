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
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

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
    description: '뜨거운 여름, 시원한 할인! 모든 숙소 15% 할인 이벤트',
    content: `<h2>여름 특가 프로모션</h2>
    <p>올 여름, 시원한 물놀이와 함께 특별한 휴가를 즐겨보세요. 모든 숙소에서 15% 할인을 제공합니다.</p>
    <ul>
      <li>기간: 2023년 7월 1일 ~ 8월 31일</li>
      <li>대상: 전체 숙소</li>
      <li>혜택: 객실 요금 15% 할인</li>
    </ul>`
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
    description: '30일 이전 예약 시 20% 특별 할인',
    content: `<h2>얼리버드 예약 할인</h2>
    <p>미리 계획하고 더 많은 혜택을 받으세요! 30일 이전 예약 시 20% 특별 할인을 제공합니다.</p>
    <ul>
      <li>기간: 2023년 9월 1일 ~ 10월 31일</li>
      <li>대상: 특정 숙소 (프리미엄 리조트, 시티 호텔, 해변 빌라)</li>
      <li>혜택: 객실 요금 20% 할인</li>
      <li>조건: 체크인 30일 이전 예약 완료 시</li>
    </ul>`
  }
];

/**
 * 프로모션 상세 페이지 컴포넌트
 */
const PromotionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);

  // API에서 프로모션 상세 정보 가져오기
  useEffect(() => {
    const fetchPromotionDetail = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await contentsApi.getPromotionById(id);
        // setPromotion(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          const foundPromotion = mockPromotions.find(
            (promo) => promo.id === id
          );
          
          if (foundPromotion) {
            setPromotion(foundPromotion);
          } else {
            // 프로모션을 찾을 수 없는 경우
            navigate('/not-found');
          }
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('프로모션 상세 정보를 가져오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchPromotionDetail();
  }, [id, navigate]);

  // 목록으로 돌아가기
  const handleBack = () => {
    navigate('/contents/promotions');
  };

  // 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/contents/promotions/${id}/edit`);
  };

  // 프로모션 삭제
  const handleDelete = async () => {
    if (window.confirm('이 프로모션을 정말 삭제하시겠습니까?')) {
      try {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // await contentsApi.deletePromotion(id);
        
        // 임시 로직 (백엔드 구현 전까지)
        setTimeout(() => {
          navigate('/contents/promotions');
        }, 500);
      } catch (error) {
        console.error('프로모션 삭제 중 오류 발생:', error);
        alert('프로모션 삭제 중 오류가 발생했습니다.');
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

  // 프로모션 상태 계산
  const calculateStatus = (promotion) => {
    if (!promotion) return '';

    const now = new Date();
    const startDate = parseISO(promotion.startDate);
    const endDate = parseISO(promotion.endDate);

    if (promotion.status === 'draft') return 'draft';
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
      discount: '할인',
      package: '패키지',
      gift: '사은품',
      event: '이벤트'
    };
    return typeLabels[type] || type;
  };

  // 대상 숙소 표시
  const renderTargetAccommodations = (targets) => {
    if (targets && targets.includes('ALL')) {
      return '전체 숙소';
    }
    
    if (targets && targets.length > 0) {
      return `${targets.length}개 숙소`;
    }
    
    return '없음';
  };

  // 프로모션 내용 렌더링
  const renderContent = (content) => {
    if (!content) return <Typography>내용이 없습니다.</Typography>;
    
    return (
      <div dangerouslySetInnerHTML={{ __html: content }} />
    );
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
        <Link color="inherit" href="/contents/promotions" underline="hover">프로모션 관리</Link>
        <Typography color="text.primary">프로모션 상세</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">프로모션 상세 정보</Typography>
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
      
      {/* 프로모션 상세 정보 */}
      {promotion && !loading && (
        <Grid container spacing={3}>
          {/* 왼쪽 섹션: 기본 정보 */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" gutterBottom>{promotion.title}</Typography>
                  <Chip
                    label={getStatusLabel(calculateStatus(promotion))}
                    color={statusColors[calculateStatus(promotion)]}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {promotion.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" width="30%">프로모션 ID</TableCell>
                        <TableCell>{promotion.id}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">타입</TableCell>
                        <TableCell>{getTypeLabel(promotion.type)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">할인율</TableCell>
                        <TableCell>{promotion.discountRate ? `${promotion.discountRate}%` : '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">기간</TableCell>
                        <TableCell>{`${formatDate(promotion.startDate)} ~ ${formatDate(promotion.endDate)}`}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">대상 숙소</TableCell>
                        <TableCell>{renderTargetAccommodations(promotion.targetAccommodations)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">우선순위</TableCell>
                        <TableCell>{promotion.priority}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">등록자</TableCell>
                        <TableCell>{promotion.createdBy}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">등록일</TableCell>
                        <TableCell>{formatDate(promotion.createdAt)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">최종 수정일</TableCell>
                        <TableCell>{formatDate(promotion.updatedAt)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Card>
            
            {/* 프로모션 내용 */}
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>프로모션 내용</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mt: 2 }}>
                  {renderContent(promotion.content)}
                </Box>
              </Box>
            </Card>
          </Grid>
          
          {/* 오른쪽 섹션: 이미지 */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                image={promotion.thumbnail || '/images/placeholder.jpg'}
                alt={promotion.title}
                sx={{ height: 300 }}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2">썸네일 이미지</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default PromotionDetail; 