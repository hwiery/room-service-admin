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

// 공지사항 상태 색상 정의
const statusColors = {
  published: 'success',
  draft: 'warning',
  archived: 'default'
};

/**
 * 공지사항 상세 페이지 컴포넌트
 */
const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  // API에서 공지사항 상세 정보 가져오기
  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await contentsApi.getNoticeById(id);
        // setNotice(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          const foundNotice = mockNotices.find(
            (notice) => notice.id === id
          );
          
          if (foundNotice) {
            setNotice(foundNotice);
          } else {
            // 공지사항을 찾을 수 없는 경우
            navigate('/not-found');
          }
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('공지사항 상세 정보를 가져오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchNoticeDetail();
  }, [id, navigate]);

  // 목록으로 돌아가기
  const handleBack = () => {
    navigate('/contents/notices');
  };

  // 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/contents/notices/${id}/edit`);
  };

  // 공지사항 삭제
  const handleDelete = async () => {
    if (window.confirm('이 공지사항을 정말 삭제하시겠습니까?')) {
      try {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // await contentsApi.deleteNotice(id);
        
        // 임시 로직 (백엔드 구현 전까지)
        setTimeout(() => {
          navigate('/contents/notices');
        }, 500);
      } catch (error) {
        console.error('공지사항 삭제 중 오류 발생:', error);
        alert('공지사항 삭제 중 오류가 발생했습니다.');
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

  // 공지사항 상태 표시 텍스트
  const getStatusLabel = (status) => {
    const statusLabels = {
      published: '게시중',
      draft: '임시저장',
      archived: '보관됨'
    };
    return statusLabels[status] || status;
  };

  // 공지사항 카테고리 표시 텍스트
  const getCategoryLabel = (category) => {
    const categoryLabels = {
      service: '서비스 안내',
      reservation: '예약 안내',
      customerService: '고객센터',
      system: '시스템',
      policy: '정책/약관',
      event: '이벤트'
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
        <Link color="inherit" href="/contents/notices" underline="hover">공지사항 관리</Link>
        <Typography color="text.primary">공지사항 상세</Typography>
      </Breadcrumbs>
      
      {/* 상단 헤더 */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">공지사항 상세 정보</Typography>
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
      
      {/* 공지사항 상세 정보 */}
      {notice && !loading && (
        <Grid container spacing={3}>
          {/* 공지사항 정보 */}
          <Grid item xs={12}>
            <Card sx={{ mb: 3 }}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {notice.isImportant && (
                    <Chip
                      label="중요"
                      color="error"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  )}
                  <Typography variant="h5">{notice.title}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={getCategoryLabel(notice.category)}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={getStatusLabel(notice.status)}
                      color={statusColors[notice.status]}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      조회 {notice.viewCount.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    게시 기간: {formatDate(notice.startDate)} ~ {formatDate(notice.endDate)}
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                {/* 공지사항 내용 */}
                <Box sx={{ mb: 3 }}>
                  <div dangerouslySetInnerHTML={{ __html: notice.content }} />
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                {/* 시스템 정보 */}
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" width="150" sx={{ backgroundColor: '#f5f5f5' }}>
                          등록자
                        </TableCell>
                        <TableCell>{notice.createdBy}</TableCell>
                        <TableCell component="th" width="150" sx={{ backgroundColor: '#f5f5f5' }}>
                          등록일
                        </TableCell>
                        <TableCell>{formatDate(notice.createdAt)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ backgroundColor: '#f5f5f5' }}>
                          최종 수정일
                        </TableCell>
                        <TableCell colSpan={3}>{formatDate(notice.updatedAt)}</TableCell>
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

export default NoticeDetail; 