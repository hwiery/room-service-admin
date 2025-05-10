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
const mockTerms = [
  {
    id: 'TERMS001',
    title: '서비스 이용약관',
    category: 'service',
    version: '1.2',
    status: 'published',
    isRequired: true,
    effectiveDate: '2023-01-01T00:00:00',
    createdAt: '2022-12-15T10:30:00',
    updatedAt: '2022-12-20T14:20:00',
    createdBy: '관리자1',
    content: '제1조 (목적)\n본 약관은 서비스 이용에 관한 조건과 절차를 규정함을 목적으로 합니다.\n\n제2조 (정의)\n이 약관에서 사용하는 용어의 정의는 다음과 같습니다.\n1. "서비스"라 함은 회사가 제공하는 숙박 예약 서비스를 의미합니다.\n2. "회원"이라 함은 회사와 서비스 이용 계약을 체결하고 회원 아이디를 부여받은 자를 의미합니다.\n3. "아이디(ID)"라 함은 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인한 이메일 주소를 의미합니다.\n\n제3조 (약관의 효력 및 변경)\n1. 이 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다.\n2. 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항에 게시함으로써 효력이 발생합니다.\n\n제4조 (서비스 이용 계약의 성립)\n1. 서비스 이용 계약은 회원이 약관에 동의하고 회사가 승인함으로써 성립됩니다.\n2. 회사는 서비스 관련 설비 여유가 없거나, 기술상 또는 업무상 문제가 있는 경우에는 승인을 유보할 수 있습니다.'
  },
  {
    id: 'TERMS002',
    title: '개인정보 처리방침',
    category: 'privacy',
    version: '2.1',
    status: 'published',
    isRequired: true,
    effectiveDate: '2023-03-01T00:00:00',
    createdAt: '2023-02-10T09:15:00',
    updatedAt: '2023-02-15T11:20:00',
    createdBy: '관리자2',
    content: '제1조 (개인정보 수집 항목)\n회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.\n- 필수항목: 이름, 이메일 주소, 휴대폰 번호, 비밀번호\n- 선택항목: 프로필 이미지, 주소, 생년월일\n\n제2조 (개인정보 수집 목적)\n회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.\n- 서비스 제공에 관한 계약 이행\n- 예약 및 결제 서비스\n- 고객 관리 및 마케팅 활동\n\n제3조 (개인정보의 보유 및 이용기간)\n회사는 회원탈퇴 시 또는 수집·이용목적이 달성된 후에는 예외 없이 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.\n- 계약 또는 청약철회 등에 관한 기록: 5년\n- 대금결제 및 재화 등의 공급에 관한 기록: 5년\n- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년'
  }
];

/**
 * 이용약관 수정 페이지 컴포넌트
 */
const TermEdit = () => {
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
    version: '1.0',
    content: '',
    isRequired: true,
    effectiveDate: new Date(),
    status: 'draft',
    createdAt: '',
    updatedAt: '',
    createdBy: ''
  });
  
  // API에서 이용약관 정보 가져오기
  useEffect(() => {
    const fetchTerm = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await contentsApi.getTermById(id);
        // const termData = response.data;
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          const foundTerm = mockTerms.find(
            (term) => term.id === id
          );
          
          if (foundTerm) {
            // 날짜 포맷 변환
            const termData = {
              ...foundTerm,
              effectiveDate: parseISO(foundTerm.effectiveDate)
            };
            
            setFormData(termData);
          } else {
            // 이용약관을 찾을 수 없는 경우
            navigate('/not-found');
          }
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('이용약관 정보를 가져오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchTerm();
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
    navigate(`/contents/terms/${id}`);
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
  
  // 이용약관 수정 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      // 폼 데이터 준비
      const termData = {
        ...formData,
        effectiveDate: format(formData.effectiveDate, "yyyy-MM-dd'T'HH:mm:ss"),
        updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
      };
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // const response = await contentsApi.updateTerm(id, termData);
      
      // 임시 로직 (백엔드 구현 전까지)
      setTimeout(() => {
        console.log('이용약관 수정 데이터:', termData);
        setSubmitting(false);
        navigate(`/contents/terms/${id}`);
      }, 1000);
    } catch (error) {
      console.error('이용약관 수정 중 오류 발생:', error);
      setSubmitting(false);
      alert('이용약관 수정 중 오류가 발생했습니다.');
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
        <Link color="inherit" href="/contents/terms" underline="hover">이용약관 관리</Link>
        <Link color="inherit" href={`/contents/terms/${id}`} underline="hover">이용약관 상세</Link>
        <Typography color="text.primary">이용약관 수정</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">이용약관 수정</Typography>
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
      
      {/* 이용약관 수정 폼 */}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* 이용약관 기본 정보 */}
            <Grid item xs={12}>
              <Card sx={{ mb: 3 }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>기본 정보</Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="약관 ID"
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
                          <MenuItem value="published">게시</MenuItem>
                          <MenuItem value="draft">임시저장</MenuItem>
                          <MenuItem value="archived">보관</MenuItem>
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
              <Card sx={{ mb: 3 }}>
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

export default TermEdit; 