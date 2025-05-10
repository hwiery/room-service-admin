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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

/**
 * 공지사항 등록 페이지 컴포넌트
 */
const NoticeNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    category: 'service',
    content: '',
    isImportant: false,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 기본값: 한 달 후
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
        navigate('/contents/notices');
      }
    } else {
      navigate('/contents/notices');
    }
  };
  
  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = '시작일을 선택해주세요.';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = '종료일을 선택해주세요.';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = '종료일은 시작일 이후여야 합니다.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 공지사항 등록 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // 폼 데이터 준비
      const noticeData = {
        ...formData,
        startDate: format(formData.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(formData.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
        createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        viewCount: 0,
        createdBy: '관리자' // 실제 로그인한 사용자 정보로 대체 필요
      };
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // const response = await contentsApi.createNotice(noticeData);
      
      // 임시 로직 (백엔드 구현 전까지)
      setTimeout(() => {
        console.log('공지사항 등록 데이터:', noticeData);
        setLoading(false);
        navigate('/contents/notices');
      }, 1000);
    } catch (error) {
      console.error('공지사항 등록 중 오류 발생:', error);
      setLoading(false);
      alert('공지사항 등록 중 오류가 발생했습니다.');
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
        <Link color="inherit" href="/contents/notices" underline="hover">공지사항 관리</Link>
        <Typography color="text.primary">새 공지사항 작성</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">새 공지사항 작성</Typography>
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
      
      {/* 공지사항 등록 폼 */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* 공지사항 기본 정보 */}
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
                        <MenuItem value="service">서비스 안내</MenuItem>
                        <MenuItem value="reservation">예약 안내</MenuItem>
                        <MenuItem value="customerService">고객센터</MenuItem>
                        <MenuItem value="system">시스템</MenuItem>
                        <MenuItem value="policy">정책/약관</MenuItem>
                        <MenuItem value="event">이벤트</MenuItem>
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
                  
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="시작일"
                        value={formData.startDate}
                        onChange={(date) => handleDateChange('startDate', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.startDate}
                            helperText={errors.startDate}
                            required
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="종료일"
                        value={formData.endDate}
                        onChange={(date) => handleDateChange('endDate', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.endDate}
                            helperText={errors.endDate}
                            required
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isImportant}
                          onChange={handleChange}
                          name="isImportant"
                          color="error"
                        />
                      }
                      label="중요 공지사항"
                    />
                    <FormHelperText>
                      중요 공지사항으로 설정하면 항상 상단에 표시됩니다.
                    </FormHelperText>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
          
          {/* 공지사항 내용 */}
          <Grid item xs={12}>
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>공지사항 내용</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <TextField
                  fullWidth
                  multiline
                  rows={15}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="공지사항 내용을 작성해주세요..."
                  error={!!errors.content}
                  helperText={errors.content}
                  sx={{ mb: 3 }}
                />

                <Typography variant="caption" color="text.secondary">
                  * HTML 태그를 사용하여 텍스트 서식을 지정할 수 있습니다. (예: &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt; 등)
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default NoticeNew; 