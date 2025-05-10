import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

/**
 * FAQ 등록 페이지 컴포넌트
 */
const FaqNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'reservation',
    isPopular: false,
    status: 'draft',
    order: 999 // 기본 순서 (끝에 배치)
  });
  
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
  
  // 목록으로 돌아가기
  const handleBack = () => {
    if (
      formData.question ||
      formData.answer
    ) {
      if (window.confirm('작성 중인 내용이 있습니다. 목록으로 돌아가시겠습니까?')) {
        navigate('/contents/faqs');
      }
    } else {
      navigate('/contents/faqs');
    }
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
  
  // FAQ 등록 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // 폼 데이터 준비
      const faqData = {
        ...formData,
        id: `FAQ${Math.floor(Math.random() * 90000) + 10000}`, // 임시 ID 생성 (백엔드 구현 시 제거)
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 0,
        createdBy: '관리자' // 실제 로그인한 사용자 정보로 대체 필요
      };
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // const response = await contentsApi.createFaq(faqData);
      
      // 임시 로직 (백엔드 구현 전까지)
      setTimeout(() => {
        console.log('FAQ 등록 데이터:', faqData);
        setLoading(false);
        navigate('/contents/faqs');
      }, 1000);
    } catch (error) {
      console.error('FAQ 등록 중 오류 발생:', error);
      setLoading(false);
      alert('FAQ 등록 중 오류가 발생했습니다.');
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
        <Typography color="text.primary">새 FAQ 작성</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">새 FAQ 작성</Typography>
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
            disabled={loading}
          >
            {formData.status === 'published' ? '등록' : '임시저장'}
          </Button>
        </Box>
      </Paper>
      
      {/* FAQ 등록 폼 */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* FAQ 기본 정보 */}
          <Grid item xs={12}>
            <Card sx={{ mb: 3 }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>기본 정보</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="질문"
                      name="question"
                      value={formData.question}
                      onChange={handleChange}
                      error={!!errors.question}
                      helperText={errors.question}
                      placeholder="예: 예약 취소는 어떻게 하나요?"
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
                        <MenuItem value="published">바로 게시</MenuItem>
                        <MenuItem value="draft">임시 저장</MenuItem>
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
                  
                  <Grid item xs={12} md={8}>
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
                    <FormHelperText>
                      인기 FAQ로 설정하면 고객센터 메인 페이지에 우선적으로 표시됩니다.
                    </FormHelperText>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
          
          {/* FAQ 답변 */}
          <Grid item xs={12}>
            <Card>
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
        </Grid>
      </form>
    </Container>
  );
};

export default FaqNew; 