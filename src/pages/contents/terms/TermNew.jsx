import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Chip,
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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

/**
 * 이용약관 등록 페이지 컴포넌트
 */
const TermNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    category: 'service',
    content: '',
    version: '1.0',
    isRequired: true,
    effectiveDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 기본값: 7일 후
    status: 'draft'
  });
  
  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // 날짜 변경 핸들러
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
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
      formData.title ||
      formData.content
    ) {
      if (window.confirm('작성 중인 내용이 있습니다. 목록으로 돌아가시겠습니까?')) {
        navigate('/contents/terms');
      }
    } else {
      navigate('/contents/terms');
    }
  };
  
  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = '약관 내용을 입력해주세요.';
    }
    
    if (!formData.version.trim()) {
      newErrors.version = '버전을 입력해주세요.';
    } else if (!/^\d+\.\d+$/.test(formData.version)) {
      newErrors.version = '버전은 x.x 형식으로 입력해주세요. (예: 1.0)';
    }
    
    if (!formData.effectiveDate) {
      newErrors.effectiveDate = '시행일을 선택해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 이용약관 등록 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // 폼 데이터 준비
      const termData = {
        ...formData,
        effectiveDate: format(formData.effectiveDate, "yyyy-MM-dd'T'HH:mm:ss"),
        createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        createdBy: '관리자' // 실제 로그인한 사용자 정보로 대체 필요
      };
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // const response = await contentsApi.createTerm(termData);
      
      // 임시 로직 (백엔드 구현 전까지)
      setTimeout(() => {
        console.log('이용약관 등록 데이터:', termData);
        setLoading(false);
        navigate('/contents/terms');
      }, 1000);
    } catch (error) {
      console.error('이용약관 등록 중 오류 발생:', error);
      setLoading(false);
      alert('이용약관 등록 중 오류가 발생했습니다.');
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
        <Link color="inherit" href="/contents/terms" underline="hover">이용약관 관리</Link>
        <Typography color="text.primary">새 이용약관 작성</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">새 이용약관 작성</Typography>
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
      
      {/* 이용약관 등록 폼 */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* 이용약관 기본 정보 */}
          <Grid item xs={12}>
            <Card sx={{ mb: 3 }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>기본 정보</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="제목"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      error={!!errors.title}
                      helperText={errors.title}
                      placeholder="예: 서비스 이용약관, 개인정보 처리방침 등"
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth required>
                      <InputLabel>카테고리</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        label="카테고리"
                      >
                        <MenuItem value="service">서비스 이용약관</MenuItem>
                        <MenuItem value="privacy">개인정보 처리방침</MenuItem>
                        <MenuItem value="location">위치기반 서비스</MenuItem>
                        <MenuItem value="marketing">마케팅 정보 수신</MenuItem>
                        <MenuItem value="payment">결제 및 환불</MenuItem>
                        <MenuItem value="thirdParty">제3자 제공</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="버전"
                      name="version"
                      value={formData.version}
                      onChange={handleChange}
                      error={!!errors.version}
                      helperText={errors.version}
                      placeholder="예: 1.0"
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
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
                  
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="시행일"
                        value={formData.effectiveDate}
                        onChange={(date) => handleDateChange('effectiveDate', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.effectiveDate}
                            helperText={errors.effectiveDate}
                            required
                          />
                        )}
                      />
                    </LocalizationProvider>
                    <FormHelperText>
                      시행일은 충분한 사전 고지 기간을 두어야 합니다.
                    </FormHelperText>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isRequired}
                          onChange={handleChange}
                          name="isRequired"
                          color="primary"
                        />
                      }
                      label="필수 동의 항목"
                    />
                    <FormHelperText>
                      필수 동의 항목은 서비스 이용 시 반드시 동의해야 하는 약관입니다.
                    </FormHelperText>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
          
          {/* 이용약관 내용 */}
          <Grid item xs={12}>
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>약관 내용</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <TextField
                  fullWidth
                  multiline
                  rows={20}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="약관 내용을 작성해주세요..."
                  error={!!errors.content}
                  helperText={errors.content}
                  sx={{ mb: 3 }}
                />

                <Typography variant="caption" color="text.secondary">
                  * 약관 내용 작성 시 조항별로 구분하여 작성하는 것이 좋습니다. (예: 제1조 (목적), 제2조 (정의) 등)
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default TermNew; 