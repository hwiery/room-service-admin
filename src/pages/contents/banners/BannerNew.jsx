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
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AttachFile as AttachFileIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

/**
 * 배너 등록 페이지 컴포넌트
 */
const BannerNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    type: 'main',
    position: 'top',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 기본값: 한 달 후
    linkUrl: '',
    status: 'draft',
    priority: 5,
    image: null,
    imagePreview: null,
    description: ''
  });
  
  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
  
  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // 이미지 파일 타입 확인
    if (!file.type.includes('image/')) {
      setErrors({
        ...errors,
        image: '이미지 파일만 업로드 가능합니다.'
      });
      return;
    }
    
    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        image: '파일 크기는 5MB 이하여야 합니다.'
      });
      return;
    }
    
    // 이미지 프리뷰 설정
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({
        ...formData,
        image: file,
        imagePreview: reader.result
      });
    };
    reader.readAsDataURL(file);
    
    // 이미지 에러 제거
    if (errors.image) {
      setErrors({
        ...errors,
        image: null
      });
    }
  };
  
  // 목록으로 돌아가기
  const handleBack = () => {
    if (
      formData.title ||
      formData.description ||
      formData.image ||
      formData.linkUrl
    ) {
      if (window.confirm('작성 중인 내용이 있습니다. 목록으로 돌아가시겠습니까?')) {
        navigate('/contents/banners');
      }
    } else {
      navigate('/contents/banners');
    }
  };
  
  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '배너 제목을 입력해주세요.';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '배너 설명을 입력해주세요.';
    }
    
    if (!formData.image) {
      newErrors.image = '배너 이미지를 업로드해주세요.';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = '시작일을 선택해주세요.';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = '종료일을 선택해주세요.';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = '종료일은 시작일 이후여야 합니다.';
    }
    
    if (formData.linkUrl && !isValidUrl(formData.linkUrl)) {
      newErrors.linkUrl = '올바른 URL 형식이 아닙니다.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // URL 유효성 검사
  const isValidUrl = (string) => {
    if (!string) return true;
    try {
      // 상대 경로도 허용
      if (string.startsWith('/')) return true;
      // 절대 경로 검사
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  // 배너 등록 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // 폼 데이터 준비
      const bannerData = {
        ...formData,
        startDate: format(formData.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(formData.endDate, "yyyy-MM-dd'T'HH:mm:ss")
      };
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // const response = await contentsApi.createBanner(bannerData);
      
      // 임시 로직 (백엔드 구현 전까지)
      setTimeout(() => {
        console.log('배너 등록 데이터:', bannerData);
        setLoading(false);
        navigate('/contents/banners');
      }, 1000);
    } catch (error) {
      console.error('배너 등록 중 오류 발생:', error);
      setLoading(false);
      alert('배너 등록 중 오류가 발생했습니다.');
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
        <Link color="inherit" href="/contents/banners" underline="hover">배너 관리</Link>
        <Typography color="text.primary">새 배너 등록</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">새 배너 등록</Typography>
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
            등록
          </Button>
        </Box>
      </Paper>
      
      {/* 배너 등록 폼 */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* 왼쪽 섹션: 기본 정보 */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>기본 정보</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="배너 제목"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      error={!!errors.title}
                      helperText={errors.title}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="배너 설명"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      error={!!errors.description}
                      helperText={errors.description}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>배너 타입</InputLabel>
                      <Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        label="배너 타입"
                      >
                        <MenuItem value="main">메인</MenuItem>
                        <MenuItem value="sub">서브</MenuItem>
                        <MenuItem value="popup">팝업</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>배너 위치</InputLabel>
                      <Select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        label="배너 위치"
                      >
                        <MenuItem value="top">상단</MenuItem>
                        <MenuItem value="middle">중단</MenuItem>
                        <MenuItem value="bottom">하단</MenuItem>
                        <MenuItem value="side">사이드</MenuItem>
                        <MenuItem value="center">중앙 (팝업)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="링크 URL"
                      name="linkUrl"
                      value={formData.linkUrl}
                      onChange={handleChange}
                      placeholder="https://example.com 또는 /path/to/page"
                      error={!!errors.linkUrl}
                      helperText={errors.linkUrl || '클릭 시 이동할 URL (상대 경로 또는 절대 경로)'}
                    />
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
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>상태</InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="상태"
                      >
                        <MenuItem value="active">활성</MenuItem>
                        <MenuItem value="draft">초안</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="우선순위"
                      name="priority"
                      type="number"
                      value={formData.priority}
                      onChange={handleChange}
                      InputProps={{ inputProps: { min: 1, max: 10 } }}
                      helperText="1(높음) ~ 10(낮음)"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
          
          {/* 오른쪽 섹션: 이미지 업로드 */}
          <Grid item xs={12} md={6}>
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>배너 이미지</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ 
                  border: '2px dashed #ccc', 
                  borderRadius: 1, 
                  p: 3, 
                  textAlign: 'center',
                  mb: 2,
                  height: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundImage: formData.imagePreview ? `url(${formData.imagePreview})` : 'none',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  position: 'relative'
                }}>
                  {!formData.imagePreview && (
                    <>
                      <AttachFileIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        이미지를 드래그하거나 클릭하여 업로드하세요.
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        (최대 5MB, JPG, PNG, GIF)
                      </Typography>
                    </>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{
                      opacity: 0,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer'
                    }}
                  />
                </Box>
                
                {errors.image && (
                  <FormHelperText error>{errors.image}</FormHelperText>
                )}
                
                {formData.imagePreview && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={() => setFormData({ ...formData, image: null, imagePreview: null })}
                  >
                    이미지 제거
                  </Button>
                )}
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>권장 이미지 사이즈</Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 메인 배너: 1920 x 500 픽셀 (가로 세로 비율 3.84:1)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 서브 배너: 400 x 300 픽셀 (가로 세로 비율 4:3)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 팝업 배너: 600 x 800 픽셀 (가로 세로 비율 3:4)
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default BannerNew; 