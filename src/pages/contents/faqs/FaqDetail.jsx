import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
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
  }
];

// FAQ 상태 색상 정의
const statusColors = {
  published: 'success',
  draft: 'warning',
  archived: 'default'
};

/**
 * FAQ 상세 페이지 컴포넌트
 */
const FaqDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);

  // API에서 FAQ 상세 정보 가져오기
  useEffect(() => {
    const fetchFaqDetail = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await contentsApi.getFaqById(id);
        // setFaq(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          const foundFaq = mockFaqs.find(
            (faq) => faq.id === id
          );
          
          if (foundFaq) {
            setFaq(foundFaq);
          } else {
            // FAQ를 찾을 수 없는 경우
            navigate('/not-found');
          }
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('FAQ 상세 정보를 가져오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchFaqDetail();
  }, [id, navigate]);

  // 목록으로 돌아가기
  const handleBack = () => {
    navigate('/contents/faqs');
  };

  // 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/contents/faqs/${id}/edit`);
  };

  // FAQ 삭제
  const handleDelete = async () => {
    if (window.confirm('이 FAQ를 정말 삭제하시겠습니까?')) {
      try {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // await contentsApi.deleteFaq(id);
        
        // 임시 로직 (백엔드 구현 전까지)
        setTimeout(() => {
          navigate('/contents/faqs');
        }, 500);
      } catch (error) {
        console.error('FAQ 삭제 중 오류 발생:', error);
        alert('FAQ 삭제 중 오류가 발생했습니다.');
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* 브레드크럼 네비게이션 */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Link color="inherit" href="/dashboard" underline="hover">대시보드</Link>
        <Link color="inherit" href="/contents/faqs" underline="hover">FAQ 관리</Link>
        <Typography color="text.primary">FAQ 상세</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">FAQ 상세 정보</Typography>
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
      
      {/* FAQ 상세 정보 */}
      {faq && !loading && (
        <Grid container spacing={3}>
          {/* FAQ 정보 */}
          <Grid item xs={12}>
            <Card sx={{ mb: 3 }}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {faq.isPopular && (
                    <Chip
                      label="인기"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  )}
                  <Typography variant="h5" component="h1">
                    Q. {faq.question}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Chip
                    label={getCategoryLabel(faq.category)}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={getStatusLabel(faq.status)}
                    color={statusColors[faq.status]}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    표시 순서: {faq.order}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    조회수: {faq.viewCount.toLocaleString()}
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                {/* FAQ 답변 */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    A. 답변
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {faq.answer}
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                {/* 시스템 정보 */}
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" width="150" sx={{ backgroundColor: '#f5f5f5' }}>
                          FAQ ID
                        </TableCell>
                        <TableCell>{faq.id}</TableCell>
                        <TableCell component="th" width="150" sx={{ backgroundColor: '#f5f5f5' }}>
                          등록자
                        </TableCell>
                        <TableCell>{faq.createdBy}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: '#f5f5f5' }}>
                          등록일
                        </TableCell>
                        <TableCell>{formatDate(faq.createdAt)}</TableCell>
                        <TableCell component="th" sx={{ backgroundColor: '#f5f5f5' }}>
                          최종 수정일
                        </TableCell>
                        <TableCell>{formatDate(faq.updatedAt)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default FaqDetail; 