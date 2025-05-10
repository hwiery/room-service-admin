import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  Link,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
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

/**
 * FAQ 수정 페이지 컴포넌트
 */
const FaqEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // 폼 데이터 초기 상태
  const [formData, setFormData] = useState({
    id: '',
    question: '',
    answer: '',
    category: 'reservation',
    isPopular: false,
    status: 'draft',
    order: 0,
    viewCount: 0,
    createdAt: '',
    updatedAt: '',
    createdBy: ''
  });
  
  // API에서 FAQ 정보 가져오기
  useEffect(() => {
    const fetchFaq = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await contentsApi.getFaqById(id);
        // const faqData = response.data;
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          const foundFaq = mockFaqs.find(
            (faq) => faq.id === id
          );
          
          if (foundFaq) {
            setFormData(foundFaq);
          } else {
            // FAQ를 찾을 수 없는 경우
            navigate('/not-found');
          }
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('FAQ 정보를 가져오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchFaq();
  }, [id, navigate]);
  
  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    let updatedValue = type === 'checkbox' ? checked : value;
    
    // 숫자 필드 처리
    if (name === 'order') {
      updatedValue = parseInt(value, 10) || 0;
    }
    
    setFormData({
      ...formData,
      [name]: updatedValue
    });
    
    // 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // 상세 페이지로 돌아가기
  const handleBack = () => {
    navigate(`/contents/faqs/${id}`);
  };
  
  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = '질문을 입력해주세요.';
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = '답변을 입력해주세요.';
    }
    
    if (formData.order < 0) {
      newErrors.order = '순서는 0 이상의 숫자여야 합니다.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // FAQ 수정 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      // 폼 데이터 준비
      const faqData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // const response = await contentsApi.updateFaq(id, faqData);
      
      // 임시 로직 (백엔드 구현 전까지)
      setTimeout(() => {
        console.log('FAQ 수정 데이터:', faqData);
        setSubmitting(false);
        navigate(`/contents/faqs/${id}`);
      }, 1000);
    } catch (error) {
      console.error('FAQ 수정 중 오류 발생:', error);
      setSubmitting(false);
      alert('FAQ 수정 중 오류가 발생했습니다.');
    }
  };
  
  // 날짜 포맷팅
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      return dateString;
    }
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
        <Link color="inherit" href={`/contents/faqs/${id}`} underline="hover">FAQ 상세</Link>
        <Typography color="text.primary">FAQ 수정</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">FAQ 수정</Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CancelIcon />}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={submitting}
          >
            저장
          </Button>
        </Box>
      </Paper>
      
      {/* 로딩 표시 */}
      {loading && <LinearProgress sx={{ mb: 3 }} />}
      
      {/* FAQ 수정 폼 */}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* FAQ 기본 정보 */}
            <Grid item xs={12}>
              <Card sx={{ mb: 3 }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>기본 정보</Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="FAQ ID"
                        value={formData.id}
                        disabled
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="등록자"
                        value={formData.createdBy}
                        disabled
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="질문"
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        error={!!errors.question}
                        helperText={errors.question}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>카테고리</InputLabel>
                        <Select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          label="카테고리"
                        >
                          <MenuItem value="reservation">예약</MenuItem>
                          <MenuItem value="payment">결제</MenuItem>
                          <MenuItem value="accommodation">숙소</MenuItem>
                          <MenuItem value="account">계정</MenuItem>
                          <MenuItem value="service">서비스</MenuItem>
                          <MenuItem value="other">기타</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>상태</InputLabel>
                        <Select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          label="상태"
                        >
                          <MenuItem value="published">게시</MenuItem>
                          <MenuItem value="draft">임시저장</MenuItem>
                          <MenuItem value="archived">보관</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="표시 순서"
                        name="order"
                        type="number"
                        value={formData.order}
                        onChange={handleChange}
                        error={!!errors.order}
                        helperText={errors.order || '낮은 숫자가 상위에 표시됩니다'}
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="조회수"
                        value={formData.viewCount.toLocaleString()}
                        disabled
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.isPopular}
                            onChange={handleChange}
                            name="isPopular"
                            color="primary"
                          />
                        }
                        label="인기 FAQ로 설정"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
            
            {/* FAQ 답변 */}
            <Grid item xs={12}>
              <Card sx={{ mb: 3 }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>답변</Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    name="answer"
                    value={formData.answer}
                    onChange={handleChange}
                    placeholder="FAQ 답변을 작성해주세요..."
                    error={!!errors.answer}
                    helperText={errors.answer}
                    required
                  />
                </Box>
              </Card>
            </Grid>
            
            {/* 시스템 정보 */}
            <Grid item xs={12}>
              <Card>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>시스템 정보</Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="등록일"
                        value={formatDate(formData.createdAt)}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="최종 수정일"
                        value={formatDate(formData.updatedAt)}
                        disabled
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </form>
      )}
    </Container>
  );
};

export default FaqEdit; 