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

// 이용약관 상태 색상 정의
const statusColors = {
  published: 'success',
  draft: 'warning',
  archived: 'default'
};

/**
 * 이용약관 상세 페이지 컴포넌트
 */
const TermDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);

  // API에서 이용약관 상세 정보 가져오기
  useEffect(() => {
    const fetchTermDetail = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await contentsApi.getTermById(id);
        // setTerm(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          const foundTerm = mockTerms.find(
            (term) => term.id === id
          );
          
          if (foundTerm) {
            setTerm(foundTerm);
          } else {
            // 이용약관을 찾을 수 없는 경우
            navigate('/not-found');
          }
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('이용약관 상세 정보를 가져오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchTermDetail();
  }, [id, navigate]);

  // 목록으로 돌아가기
  const handleBack = () => {
    navigate('/contents/terms');
  };

  // 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/contents/terms/${id}/edit`);
  };

  // 이용약관 삭제
  const handleDelete = async () => {
    if (window.confirm('이 이용약관을 정말 삭제하시겠습니까?')) {
      try {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // await contentsApi.deleteTerm(id);
        
        // 임시 로직 (백엔드 구현 전까지)
        setTimeout(() => {
          navigate('/contents/terms');
        }, 500);
      } catch (error) {
        console.error('이용약관 삭제 중 오류 발생:', error);
        alert('이용약관 삭제 중 오류가 발생했습니다.');
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

  // 이용약관 상태 표시 텍스트
  const getStatusLabel = (status) => {
    const statusLabels = {
      published: '게시중',
      draft: '임시저장',
      archived: '보관됨'
    };
    return statusLabels[status] || status;
  };

  // 이용약관 카테고리 표시 텍스트
  const getCategoryLabel = (category) => {
    const categoryLabels = {
      service: '서비스 이용약관',
      privacy: '개인정보 처리방침',
      location: '위치기반 서비스',
      marketing: '마케팅 정보 수신',
      payment: '결제 및 환불',
      thirdParty: '제3자 제공'
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
        <Link color="inherit" href="/contents/terms" underline="hover">이용약관 관리</Link>
        <Typography color="text.primary">이용약관 상세</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">이용약관 상세 정보</Typography>
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
      
      {/* 이용약관 상세 정보 */}
      {term && !loading && (
        <Grid container spacing={3}>
          {/* 이용약관 정보 */}
          <Grid item xs={12}>
            <Card sx={{ mb: 3 }}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {term.isRequired && (
                    <Chip
                      label="필수"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  )}
                  <Typography variant="h5">{term.title}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={getCategoryLabel(term.category)}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={getStatusLabel(term.status)}
                      color={statusColors[term.status]}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      버전 {term.version}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    시행일: {formatDate(term.effectiveDate)}
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                {/* 이용약관 내용 */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    약관 내용
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 3, 
                      whiteSpace: 'pre-line',
                      maxHeight: '500px',
                      overflow: 'auto' 
                    }}
                  >
                    {term.content}
                  </Paper>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                {/* 시스템 정보 */}
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" width="150" sx={{ backgroundColor: '#f5f5f5' }}>
                          약관 ID
                        </TableCell>
                        <TableCell>{term.id}</TableCell>
                        <TableCell component="th" width="150" sx={{ backgroundColor: '#f5f5f5' }}>
                          등록자
                        </TableCell>
                        <TableCell>{term.createdBy}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: '#f5f5f5' }}>
                          등록일
                        </TableCell>
                        <TableCell>{formatDate(term.createdAt)}</TableCell>
                        <TableCell component="th" sx={{ backgroundColor: '#f5f5f5' }}>
                          최종 수정일
                        </TableCell>
                        <TableCell>{formatDate(term.updatedAt)}</TableCell>
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

export default TermDetail; 