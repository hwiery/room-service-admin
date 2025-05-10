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
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
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
import { format, parseISO } from 'date-fns';

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
 * 프로모션 수정 페이지 컴포넌트
 */
const PromotionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // 폼 데이터 초기 상태
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    type: 'discount',
    discountRate: '',
    startDate: new Date(),
    endDate: new Date(),
    targetAccommodations: ['ALL'],
    status: 'draft',
    priority: 5,
    thumbnail: null,
    thumbnailPreview: null,
    description: '',
    content: '',
    createdAt: '',
    updatedAt: '',
    createdBy: ''
  });
  
  // API에서 프로모션 정보 가져오기
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await contentsApi.getPromotionById(id);
        // const promotionData = response.data;
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          const foundPromotion = mockPromotions.find(
            (promo) => promo.id === id
          );
          
          if (foundPromotion) {
            // 날짜 포맷 변환
            const promotionData = {
              ...foundPromotion,
              startDate: parseISO(foundPromotion.startDate),
              endDate: parseISO(foundPromotion.endDate),
              thumbnailPreview: foundPromotion.thumbnail
            };
            
            setFormData(promotionData);
          } else {
            // 프로모션을 찾을 수 없는 경우
            navigate('/not-found');
          }
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('프로모션 정보를 가져오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [id, navigate]);
  
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
    navigate(`/contents/promotions/${id}`);
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
  
  // 프로모션 수정 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      // 폼 데이터 준비
      const promotionData = {
        ...formData,
        startDate: format(formData.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(formData.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
        updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
      };
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // const response = await contentsApi.updatePromotion(id, promotionData);
      
      // 임시 로직 (백엔드 구현 전까지)
      setTimeout(() => {
        console.log('프로모션 수정 데이터:', promotionData);
        setSubmitting(false);
        navigate(`/contents/promotions/${id}`);
      }, 1000);
    } catch (error) {
      console.error('프로모션 수정 중 오류 발생:', error);
      setSubmitting(false);
      alert('프로모션 수정 중 오류가 발생했습니다.');
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
        <Link color="inherit" href={`/contents/promotions/${id}`} underline="hover">프로모션 상세</Link>
        <Typography color="text.primary">프로모션 수정</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">프로모션 수정</Typography>
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
      
      {/* 프로모션 수정 폼 */}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* 왼쪽 섹션: 기본 정보 */}
            <Grid item xs={12} md={8}>
              <Card sx={{ mb: 3 }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>기본 정보</Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="프로모션 ID"
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
              
              <Card sx={{ mt: 3 }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>시스템 정보</Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="등록일"
                        value={format(parseISO(formData.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="최종 수정일"
                        value={format(parseISO(formData.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
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

export default PromotionEdit; 