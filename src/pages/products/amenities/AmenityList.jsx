import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { productApi } from '../../../api';

// 목업 데이터
const mockAmenities = [
  { id: 'wifi', name: '무료 와이파이', icon: 'wifi' },
  { id: 'parking', name: '주차장', icon: 'local_parking' },
  { id: 'breakfast', name: '조식 제공', icon: 'restaurant' },
  { id: 'pool', name: '수영장', icon: 'pool' },
  { id: 'gym', name: '피트니스 센터', icon: 'fitness_center' },
  { id: 'spa', name: '스파', icon: 'spa' },
  { id: 'ac', name: '에어컨', icon: 'ac_unit' },
  { id: 'restaurant', name: '레스토랑', icon: 'restaurant' },
  { id: 'bar', name: '바/라운지', icon: 'local_bar' },
  { id: 'terrace', name: '테라스', icon: 'deck' }
];

/**
 * 편의시설 관리 페이지 컴포넌트
 */
const AmenityList = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [amenityToDelete, setAmenityToDelete] = useState(null);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [newAmenity, setNewAmenity] = useState({ name: '', icon: '' });
  const [isEditing, setIsEditing] = useState(false);

  // API에서 편의시설 목록 가져오기
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await productApi.getAmenities();
        // setAmenities(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          setAmenities(mockAmenities);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('편의시설 목록을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  // 편의시설 추가 다이얼로그 열기
  const handleOpenDialog = () => {
    setNewAmenity({ name: '', icon: '' });
    setIsEditing(false);
    setDialogOpen(true);
  };

  // 편의시설 편집 다이얼로그 열기
  const handleOpenEditDialog = (amenity) => {
    setNewAmenity({ ...amenity });
    setEditingAmenity(amenity);
    setIsEditing(true);
    setDialogOpen(true);
  };

  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAmenity(null);
  };

  // 삭제 다이얼로그 열기
  const handleOpenDeleteDialog = (amenity) => {
    setAmenityToDelete(amenity);
    setDeleteDialogOpen(true);
  };

  // 삭제 다이얼로그 닫기
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAmenityToDelete(null);
  };

  // 편의시설 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAmenity(prev => ({ ...prev, [name]: value }));
  };

  // 편의시설 저장 핸들러
  const handleSaveAmenity = async () => {
    if (!newAmenity.name.trim()) return;

    try {
      setLoading(true);
      
      if (isEditing) {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // await productApi.updateAmenity(editingAmenity.id, newAmenity);
        
        // 백엔드 구현 전까지 목업 처리
        console.log('편의시설 수정:', newAmenity);
        
        // 클라이언트 측 상태 업데이트
        const updatedAmenities = amenities.map(item => 
          item.id === editingAmenity.id ? { ...item, ...newAmenity } : item
        );
        setAmenities(updatedAmenities);
      } else {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await productApi.createAmenity(newAmenity);
        // const createdAmenity = response.data;
        
        // 백엔드 구현 전까지 목업 처리
        const createdAmenity = {
          id: `amenity-${Date.now()}`,
          ...newAmenity
        };
        console.log('편의시설 생성:', createdAmenity);
        
        // 클라이언트 측 상태 업데이트
        setAmenities([...amenities, createdAmenity]);
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('편의시설 저장 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  // 편의시설 삭제 핸들러
  const handleDeleteAmenity = async () => {
    if (!amenityToDelete) return;

    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await productApi.deleteAmenity(amenityToDelete.id);
      
      // 백엔드 구현 전까지 목업 처리
      console.log('편의시설 삭제:', amenityToDelete.id);
      
      // 클라이언트 측 상태 업데이트
      const updatedAmenities = amenities.filter(item => item.id !== amenityToDelete.id);
      setAmenities(updatedAmenities);
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('편의시설 삭제 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          편의시설 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          숙소에서 사용할 편의시설 코드를 관리할 수 있습니다.
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            편의시설 추가
          </Button>
        </Toolbar>
      </Paper>

      <Card>
        {loading && <LinearProgress />}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>아이콘</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {amenities.length > 0 ? (
                amenities.map((amenity) => (
                  <TableRow key={amenity.id} hover>
                    <TableCell>{amenity.id}</TableCell>
                    <TableCell>{amenity.name}</TableCell>
                    <TableCell>{amenity.icon}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="수정">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(amenity)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDeleteDialog(amenity)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : !loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      등록된 편의시설이 없습니다.
                    </Typography>
                    <Button
                      variant="text"
                      onClick={handleOpenDialog}
                      startIcon={<AddIcon />}
                      sx={{ mt: 1 }}
                    >
                      새 편의시설 추가하기
                    </Button>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* 편의시설 추가/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? '편의시설 수정' : '편의시설 추가'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="이름"
              fullWidth
              variant="outlined"
              value={newAmenity.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              margin="dense"
              name="icon"
              label="아이콘 코드"
              fullWidth
              variant="outlined"
              value={newAmenity.icon}
              onChange={handleInputChange}
              helperText="Material Icons 이름을 입력하세요 (예: wifi, local_parking, restaurant)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            취소
          </Button>
          <Button
            onClick={handleSaveAmenity}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!newAmenity.name.trim()}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>편의시설 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {amenityToDelete && (
              `'${amenityToDelete.name}' 편의시설을 정말로 삭제하시겠습니까?
              삭제된 데이터는 복구할 수 없습니다.`
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>취소</Button>
          <Button onClick={handleDeleteAmenity} color="error" autoFocus>
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AmenityList; 