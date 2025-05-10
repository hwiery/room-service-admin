import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  Paper,
  Tab,
  Tabs,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Hotel as HotelIcon,
  MeetingRoom as MeetingRoomIcon
} from '@mui/icons-material';
import { productApi } from '../../../api';

// 목업 데이터
const mockAccommodation = {
  id: 'acc001',
  name: '서울 시그니처 호텔',
  category: 'hotel',
  categoryName: '호텔',
  address: '서울시 강남구 테헤란로 123',
  description: '도심 속 휴식을 제공하는 프리미엄 호텔입니다. 비즈니스와 관광 모두에 최적의 위치를 자랑하며, 세련된 객실과 다양한 부대시설을 갖추고 있습니다.',
  checkInTime: '15:00',
  checkOutTime: '11:00',
  amenities: [
    { id: 'wifi', name: '무료 와이파이' },
    { id: 'parking', name: '주차장' },
    { id: 'breakfast', name: '조식 제공' },
    { id: 'pool', name: '수영장' },
    { id: 'gym', name: '피트니스 센터' }
  ],
  images: [
    {
      id: 'img001',
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      name: '호텔 외관'
    },
    {
      id: 'img002',
      url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
      name: '로비'
    },
    {
      id: 'img003',
      url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      name: '객실'
    }
  ],
  rooms: [
    {
      id: 'room001',
      name: '디럭스 더블',
      price: 150000,
      capacity: 2,
      bedType: '퀸 사이즈 더블 침대 1개',
      area: 25,
      count: 10
    },
    {
      id: 'room002',
      name: '디럭스 트윈',
      price: 150000,
      capacity: 2,
      bedType: '싱글 침대 2개',
      area: 25,
      count: 8
    },
    {
      id: 'room003',
      name: '프리미엄 더블',
      price: 200000,
      capacity: 2,
      bedType: '킹 사이즈 더블 침대 1개',
      area: 35,
      count: 5
    }
  ],
  isActive: true,
  createdAt: '2023-01-15T09:00:00.000Z',
  updatedAt: '2023-04-20T15:30:00.000Z'
};

// 탭 컴포넌트
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`accommodation-detail-tabpanel-${index}`}
      aria-labelledby={`accommodation-detail-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * 숙소 상세 정보 페이지 컴포넌트
 */
const AccommodationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 숙소 정보 로드
  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await productApi.getAccommodation(id);
        // setAccommodation(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          if (id === 'acc001') {
            setAccommodation(mockAccommodation);
          } else {
            // 존재하지 않는 숙소 ID인 경우
            setError('숙소를 찾을 수 없습니다.');
          }
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('숙소 정보를 불러오는 중 오류가 발생했습니다:', error);
        setError('숙소 정보를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchAccommodation();
  }, [id]);

  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 삭제 확인 다이얼로그 열기
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  // 삭제 확인 다이얼로그 닫기
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // 숙소 삭제 핸들러
  const handleDelete = async () => {
    try {
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await productApi.deleteAccommodation(id);
      
      // 백엔드 구현 전까지 목업 처리
      console.log(`숙소 삭제: ${id}`);
      
      // 삭제 후 목록 페이지로 이동
      navigate('/products/accommodations');
    } catch (error) {
      console.error('숙소 삭제 중 오류가 발생했습니다:', error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // 로딩 중
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <LinearProgress sx={{ width: '100%', mb: 2 }} />
          <Typography variant="h6">숙소 정보를 불러오는 중입니다...</Typography>
        </Box>
      </Container>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Typography variant="body1" paragraph>
            요청하신 숙소 정보를 불러올 수 없습니다.
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            component={RouterLink}
            to="/products/accommodations"
          >
            숙소 목록으로 돌아가기
          </Button>
        </Box>
      </Container>
    );
  }

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Container maxWidth="lg">
      {/* 상단 제목 및 버튼 */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/dashboard" color="inherit">
            대시보드
          </Link>
          <Link component={RouterLink} to="/products/accommodations" color="inherit">
            숙소 관리
          </Link>
          <Typography color="text.primary">{accommodation.name}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {accommodation.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                label={accommodation.categoryName}
                color="primary"
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip
                icon={accommodation.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                label={accommodation.isActive ? '운영중' : '비활성'}
                color={accommodation.isActive ? 'success' : 'default'}
                size="small"
              />
            </Box>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              component={RouterLink}
              to={`/products/accommodations/${id}/edit`}
              sx={{ mr: 1 }}
            >
              수정
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleOpenDeleteDialog}
            >
              삭제
            </Button>
          </Box>
        </Box>
      </Box>

      {/* 탭 메뉴 */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="기본 정보" />
          <Tab label="객실 정보" />
          <Tab label="이미지" />
        </Tabs>

        {/* 기본 정보 탭 */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    숙소 정보
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" color="text.secondary">주소</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{accommodation.address}</Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" color="text.secondary">체크인</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{accommodation.checkInTime}</Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" color="text.secondary">체크아웃</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{accommodation.checkOutTime}</Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" color="text.secondary">등록일</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{formatDate(accommodation.createdAt)}</Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" color="text.secondary">최종 수정일</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{formatDate(accommodation.updatedAt)}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    숙소 설명
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" paragraph>
                    {accommodation.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    편의시설
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {accommodation.amenities.map((amenity) => (
                      <Chip
                        key={amenity.id}
                        label={amenity.name}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* 객실 정보 탭 */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              총 {accommodation.rooms.length}개 객실 유형
            </Typography>
            <Button
              variant="contained"
              startIcon={<MeetingRoomIcon />}
              component={RouterLink}
              to={`/products/accommodations/${id}/rooms/new`}
            >
              객실 추가
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {accommodation.rooms.map((room) => (
              <Grid item xs={12} md={6} key={room.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">{room.name}</Typography>
                      <Box>
                        <IconButton
                          size="small"
                          component={RouterLink}
                          to={`/products/accommodations/${id}/rooms/${room.id}/edit`}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => console.log(`Delete room: ${room.id}`)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">가격</Typography>
                        <Typography variant="body2">{room.price.toLocaleString()}원</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">수용 인원</Typography>
                        <Typography variant="body2">{room.capacity}명</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">침대 타입</Typography>
                        <Typography variant="body2">{room.bedType}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">객실 면적</Typography>
                        <Typography variant="body2">{room.area}㎡</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">객실 수</Typography>
                        <Typography variant="body2">{room.count}개</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* 이미지 탭 */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={2}>
            {accommodation.images.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={image.id}>
                <Card>
                  <Box
                    component="img"
                    src={image.url}
                    alt={image.name}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent>
                    <Typography variant="body2">{image.name || `이미지 ${index + 1}`}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>숙소 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            '{accommodation.name}' 숙소를 정말로 삭제하시겠습니까?
            삭제된 데이터는 복구할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>취소</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AccommodationDetail; 