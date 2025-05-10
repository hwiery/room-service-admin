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
  InputAdornment,
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
 * 프로모션 등록 페이지 컴포넌트
 */
const PromotionNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    type: 'discount',
    discountRate: '',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 기본값: 한 달 후
    targetAccommodations: ['ALL'],
    status: 'draft',
    priority: 5,
    thumbnail: null,
    thumbnailPreview: null,
    description: '',
    content: ''
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
        thumbnail: '이미지 파일만 업로드 가능합니다.'
      });
      return;
    }
    
    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        thumbnail: '파일 크기는 5MB 이하여야 합니다.'
      });
      return;
    }
    
    // 썸네일 프리뷰 설정
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({
        ...formData,
        thumbnail: file,
        thumbnailPreview: reader.result
      });
    };
    reader.readAsDataURL(file);
    
    // 썸네일 에러 제거
    if (errors.thumbnail) {
      setErrors({
        ...errors,
        thumbnail: null
      });
    }
  };
  
  // 목록으로 돌아가기
  const handleBack = () => {
    if (
      formData.title ||
      formData.description ||
      formData.thumbnail ||
      formData.content
    ) {
      if (window.confirm('작성 중인 내용이 있습니다. 목록으로 돌아가시겠습니까?')) {
        navigate('/contents/promotions');
      }
    } else {
      navigate('/contents/promotions');
    }
  };
  
  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '프로모션 제목을 입력해주세요.';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '프로모션 설명을 입력해주세요.';
    }
    
    if (formData.type === 'discount' && (!formData.discountRate || formData.discountRate <= 0)) {
      newErrors.discountRate = '유효한 할인율을 입력해주세요.';
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
  
  // 프로모션 등록 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // 폼 데이터 준비
      const promotionData = {
        ...formData,
        startDate: format(formData.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(formData.endDate, "yyyy-MM-dd'T'HH:mm:ss")
      };
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // const response = await contentsApi.createPromotion(promotionData);
      
      // 임시 로직 (백엔드 구현 전까지)
      setTimeout(() => {
        console.log('프로모션 등록 데이터:', promotionData);
        setLoading(false);
        navigate('/contents/promotions');
      }, 1000);
    } catch (error) {
      console.error('프로모션 등록 중 오류 발생:', error);
      setLoading(false);
      alert('프로모션 등록 중 오류가 발생했습니다.');
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
        <Link color="inherit" href="/contents/promotions" underline="hover">프로모션 관리</Link>
        <Typography color="text.primary">새 프로모션 등록</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">새 프로모션 등록</Typography>
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
      
      {/* 프로모션 등록 폼 */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* 왼쪽 섹션: 기본 정보 */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>기본 정보</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="프로모션 제목"
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
                      label="프로모션 설명"
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
                      <InputLabel>프로모션 타입</InputLabel>
                      <Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        label="프로모션 타입"
                      >
                        <MenuItem value="discount">할인</MenuItem>
                        <MenuItem value="package">패키지</MenuItem>
                        <MenuItem value="gift">사은품</MenuItem>
                        <MenuItem value="event">이벤트</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="할인율"
                      name="discountRate"
                      type="number"
                      value={formData.discountRate}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      error={!!errors.discountRate}
                      helperText={errors.discountRate}
                      disabled={formData.type !== 'discount'}
                      required={formData.type === 'discount'}
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
                      <InputLabel>대상 숙소</InputLabel>
                      <Select
                        name="targetAccommodations"
                        value={formData.targetAccommodations}
                        onChange={handleChange}
                        label="대상 숙소"
                      >
                        <MenuItem value={['ALL']}>전체 숙소</MenuItem>
                        <MenuItem value={['A001', 'A002']}>선택된 숙소 (추후 구현)</MenuItem>
                      </Select>
                    </FormControl>
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
            
            {/* 프로모션 내용 */}
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>프로모션 내용</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  label="내용 (HTML 지원)"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="<h2>프로모션 제목</h2><p>내용을 입력하세요...</p>"
                />
              </Box>
            </Card>
          </Grid>
          
          {/* 오른쪽 섹션: 이미지 업로드 */}
          <Grid item xs={12} md={4}>
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>썸네일 이미지</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ 
                  border: '2px dashed #ccc', 
                  borderRadius: 1, 
                  p: 3, 
                  textAlign: 'center',
                  mb: 2,
                  height: 240,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundImage: formData.thumbnailPreview ? `url(${formData.thumbnailPreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  {!formData.thumbnailPreview && (
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
                
                {errors.thumbnail && (
                  <FormHelperText error>{errors.thumbnail}</FormHelperText>
                )}
                
                {formData.thumbnailPreview && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={() => setFormData({ ...formData, thumbnail: null, thumbnailPreview: null })}
                  >
                    이미지 제거
                  </Button>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default PromotionNew; 