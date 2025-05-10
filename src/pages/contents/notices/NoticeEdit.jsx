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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, parseISO } from 'date-fns';

// 목업 데이터
const mockNotices = [
  {
    id: 'NOTICE001',
    title: '서비스 이용약관 변경 안내',
    category: 'service',
    status: 'published',
    isImportant: true,
    viewCount: 1250,
    startDate: '2023-05-01T00:00:00',
    endDate: '2023-12-31T23:59:59',
    createdAt: '2023-04-25T10:30:00',
    updatedAt: '2023-04-28T14:20:00',
    createdBy: '관리자1',
    content: `<h2>서비스 이용약관 변경 안내</h2>
<p>안녕하세요. 저희 서비스를 이용해 주시는 고객님께 감사드립니다.</p>
<p>서비스 이용약관이 아래와 같이 변경되어 안내드립니다.</p>
<h3>주요 변경사항</h3>
<ol>
  <li>개인정보 보호 정책 강화</li>
  <li>예약 취소 및 환불 정책 변경</li>
  <li>서비스 이용 제한 관련 조항 추가</li>
</ol>
<p>변경된 이용약관은 2023년 5월 1일부터 적용됩니다.</p>
<p>자세한 내용은 서비스 이용약관 페이지에서 확인하실 수 있습니다.</p>
<p>감사합니다.</p>`
  },
  {
    id: 'NOTICE002',
    title: '여름 성수기 예약 안내',
    category: 'reservation',
    status: 'published',
    isImportant: true,
    viewCount: 980,
    startDate: '2023-06-01T00:00:00',
    endDate: '2023-08-31T23:59:59',
    createdAt: '2023-05-20T09:15:00',
    updatedAt: '2023-05-20T09:15:00',
    createdBy: '관리자2',
    content: `<h2>2023년 여름 성수기 예약 안내</h2>
<p>안녕하세요. 2023년 여름 성수기 예약 관련 안내사항입니다.</p>
<h3>성수기 기간</h3>
<p>2023년 7월 15일 ~ 8월 15일</p>
<h3>예약 안내</h3>
<ul>
  <li>성수기 기간 예약은 최소 2박 이상부터 가능합니다.</li>
  <li>성수기 예약은 30일 전까지만 취소 시 전액 환불됩니다.</li>
  <li>인기 숙소의 경우 조기 마감될 수 있으니 서둘러 예약해주세요.</li>
</ul>
<p>문의사항은 고객센터(1588-0000)로 연락주시기 바랍니다.</p>
<p>감사합니다.</p>`
  }
];

/**
 * 공지사항 수정 페이지 컴포넌트
 */
const NoticeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // 폼 데이터 초기 상태
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'service',
    content: '',
    isImportant: false,
    startDate: new Date(),
    endDate: new Date(),
    status: 'draft',
    viewCount: 0,
    createdAt: '',
    updatedAt: '',
    createdBy: ''
  });
  
  // API에서 공지사항 정보 가져오기
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await contentsApi.getNoticeById(id);
        // const noticeData = response.data;
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          const foundNotice = mockNotices.find(
            (notice) => notice.id === id
          );
          
          if (foundNotice) {
            // 날짜 포맷 변환
            const noticeData = {
              ...foundNotice,
              startDate: parseISO(foundNotice.startDate),
              endDate: parseISO(foundNotice.endDate)
            };
            
            setFormData(noticeData);
          } else {
            // 공지사항을 찾을 수 없는 경우
            navigate('/not-found');
          }
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('공지사항 정보를 가져오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id, navigate]);
  
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
  
  // 상세 페이지로 돌아가기
  const handleBack = () => {
    navigate(`/contents/notices/${id}`);
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
  
  // 공지사항 수정 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      // 폼 데이터 준비
      const noticeData = {
        ...formData,
        startDate: format(formData.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(formData.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
        updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
      };
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // const response = await contentsApi.updateNotice(id, noticeData);
      
      // 임시 로직 (백엔드 구현 전까지)
      setTimeout(() => {
        console.log('공지사항 수정 데이터:', noticeData);
        setSubmitting(false);
        navigate(`/contents/notices/${id}`);
      }, 1000);
    } catch (error) {
      console.error('공지사항 수정 중 오류 발생:', error);
      setSubmitting(false);
      alert('공지사항 수정 중 오류가 발생했습니다.');
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
        <Link color="inherit" href={`/contents/notices/${id}`} underline="hover">공지사항 상세</Link>
        <Typography color="text.primary">공지사항 수정</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">공지사항 수정</Typography>
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
      
      {/* 공지사항 수정 폼 */}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* 공지사항 기본 정보 */}
            <Grid item xs={12}>
              <Card sx={{ mb: 3 }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>기본 정보</Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="공지사항 ID"
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
                          <MenuItem value="published">게시</MenuItem>
                          <MenuItem value="draft">임시저장</MenuItem>
                          <MenuItem value="archived">보관</MenuItem>
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
              <Card sx={{ mb: 3 }}>
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
                        label="조회수"
                        value={formData.viewCount.toLocaleString()}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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

export default NoticeEdit; 