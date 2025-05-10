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
const mockCategories = [
  { id: 'hotel', name: '호텔', description: '전문 서비스와 다양한 편의시설을 갖춘 숙박 시설' },
  { id: 'resort', name: '리조트', description: '레저와 휴양을 위한 종합 숙박 시설' },
  { id: 'pension', name: '펜션', description: '가족 또는 소규모 그룹을 위한 독립 숙박 시설' },
  { id: 'guesthouse', name: '게스트하우스', description: '여행자를 위한 저렴한 숙박 시설' },
  { id: 'villa', name: '빌라', description: '고급 인테리어와 독립적인 공간을 갖춘 숙박 시설' }
];

/**
 * 카테고리 관리 페이지 컴포넌트
 */
const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  // API에서 카테고리 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await productApi.getCategories();
        // setCategories(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          setCategories(mockCategories);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('카테고리 목록을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 카테고리 추가 다이얼로그 열기
  const handleOpenDialog = () => {
    setNewCategory({ name: '', description: '' });
    setIsEditing(false);
    setDialogOpen(true);
  };

  // 카테고리 편집 다이얼로그 열기
  const handleOpenEditDialog = (category) => {
    setNewCategory({ ...category });
    setEditingCategory(category);
    setIsEditing(true);
    setDialogOpen(true);
  };

  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
  };

  // 삭제 다이얼로그 열기
  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  // 삭제 다이얼로그 닫기
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  // 카테고리 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  // 카테고리 저장 핸들러
  const handleSaveCategory = async () => {
    if (!newCategory.name.trim()) return;

    try {
      setLoading(true);
      
      if (isEditing) {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // await productApi.updateCategory(editingCategory.id, newCategory);
        
        // 백엔드 구현 전까지 목업 처리
        console.log('카테고리 수정:', newCategory);
        
        // 클라이언트 측 상태 업데이트
        const updatedCategories = categories.map(cat => 
          cat.id === editingCategory.id ? { ...cat, ...newCategory } : cat
        );
        setCategories(updatedCategories);
      } else {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await productApi.createCategory(newCategory);
        // const createdCategory = response.data;
        
        // 백엔드 구현 전까지 목업 처리
        const createdCategory = {
          id: `cat-${Date.now()}`,
          ...newCategory
        };
        console.log('카테고리 생성:', createdCategory);
        
        // 클라이언트 측 상태 업데이트
        setCategories([...categories, createdCategory]);
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('카테고리 저장 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 삭제 핸들러
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await productApi.deleteCategory(categoryToDelete.id);
      
      // 백엔드 구현 전까지 목업 처리
      console.log('카테고리 삭제:', categoryToDelete.id);
      
      // 클라이언트 측 상태 업데이트
      const updatedCategories = categories.filter(cat => cat.id !== categoryToDelete.id);
      setCategories(updatedCategories);
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('카테고리 삭제 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          카테고리 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          숙소 유형 및 카테고리를 관리할 수 있습니다.
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
            카테고리 추가
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
                <TableCell>카테고리명</TableCell>
                <TableCell>설명</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="수정">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(category)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDeleteDialog(category)}
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
                      등록된 카테고리가 없습니다.
                    </Typography>
                    <Button
                      variant="text"
                      onClick={handleOpenDialog}
                      startIcon={<AddIcon />}
                      sx={{ mt: 1 }}
                    >
                      새 카테고리 추가하기
                    </Button>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* 카테고리 추가/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? '카테고리 수정' : '카테고리 추가'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="카테고리명"
              fullWidth
              variant="outlined"
              value={newCategory.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="설명"
              fullWidth
              variant="outlined"
              value={newCategory.description}
              onChange={handleInputChange}
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            취소
          </Button>
          <Button
            onClick={handleSaveCategory}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!newCategory.name.trim()}
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
        <DialogTitle>카테고리 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {categoryToDelete && (
              `'${categoryToDelete.name}' 카테고리를 정말로 삭제하시겠습니까?
              삭제된 데이터는 복구할 수 없습니다.`
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>취소</Button>
          <Button onClick={handleDeleteCategory} color="error" autoFocus>
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoryList; 