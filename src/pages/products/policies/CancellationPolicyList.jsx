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
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText
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
const mockPolicies = [
  {
    id: 'policy1',
    name: '기본 정책',
    description: '체크인 3일 전까지 무료 취소 가능',
    rules: [
      { days: 3, refundRate: 100 },
      { days: 1, refundRate: 50 },
      { days: 0, refundRate: 0 }
    ],
    isDefault: true
  },
  {
    id: 'policy2',
    name: '유연한 정책',
    description: '체크인 당일까지 무료 취소 가능',
    rules: [
      { days: 0, refundRate: 100 }
    ],
    isDefault: false
  },
  {
    id: 'policy3',
    name: '엄격한 정책',
    description: '체크인 7일 전까지만 무료 취소 가능',
    rules: [
      { days: 7, refundRate: 100 },
      { days: 3, refundRate: 50 },
      { days: 1, refundRate: 20 },
      { days: 0, refundRate: 0 }
    ],
    isDefault: false
  }
];

/**
 * 취소/환불 규정 관리 페이지 컴포넌트
 */
const CancellationPolicyList = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    description: '',
    rules: [{ days: 0, refundRate: 100 }],
    isDefault: false
  });
  const [isEditing, setIsEditing] = useState(false);

  // API에서 취소/환불 규정 목록 가져오기
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await productApi.getCancellationPolicies();
        // setPolicies(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          setPolicies(mockPolicies);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('취소/환불 규정 목록을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  // 정책 추가 다이얼로그 열기
  const handleOpenDialog = () => {
    setNewPolicy({
      name: '',
      description: '',
      rules: [{ days: 0, refundRate: 100 }],
      isDefault: false
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  // 정책 편집 다이얼로그 열기
  const handleOpenEditDialog = (policy) => {
    setNewPolicy({ ...policy });
    setEditingPolicy(policy);
    setIsEditing(true);
    setDialogOpen(true);
  };

  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPolicy(null);
  };

  // 삭제 다이얼로그 열기
  const handleOpenDeleteDialog = (policy) => {
    setPolicyToDelete(policy);
    setDeleteDialogOpen(true);
  };

  // 삭제 다이얼로그 닫기
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPolicyToDelete(null);
  };

  // 정책 기본 정보 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPolicy(prev => ({ ...prev, [name]: value }));
  };

  // 기본 정책 여부 변경 핸들러
  const handleDefaultChange = (e) => {
    const { checked } = e.target;
    setNewPolicy(prev => ({ ...prev, isDefault: checked }));
  };

  // 규칙 추가 핸들러
  const handleAddRule = () => {
    setNewPolicy(prev => ({
      ...prev,
      rules: [...prev.rules, { days: 0, refundRate: 100 }]
    }));
  };

  // 규칙 삭제 핸들러
  const handleRemoveRule = (index) => {
    setNewPolicy(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  // 규칙 변경 핸들러
  const handleRuleChange = (index, field, value) => {
    setNewPolicy(prev => {
      const updatedRules = [...prev.rules];
      updatedRules[index] = {
        ...updatedRules[index],
        [field]: parseInt(value, 10)
      };
      return { ...prev, rules: updatedRules };
    });
  };

  // 정책 저장 핸들러
  const handleSavePolicy = async () => {
    if (!newPolicy.name.trim()) return;

    try {
      setLoading(true);
      
      if (isEditing) {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // await productApi.updateCancellationPolicy(editingPolicy.id, newPolicy);
        
        // 백엔드 구현 전까지 목업 처리
        console.log('취소/환불 규정 수정:', newPolicy);
        
        // 클라이언트 측 상태 업데이트
        const updatedPolicies = policies.map(policy => 
          policy.id === editingPolicy.id ? { ...policy, ...newPolicy } : policy
        );
        setPolicies(updatedPolicies);
      } else {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await productApi.createCancellationPolicy(newPolicy);
        // const createdPolicy = response.data;
        
        // 백엔드 구현 전까지 목업 처리
        const createdPolicy = {
          id: `policy-${Date.now()}`,
          ...newPolicy
        };
        console.log('취소/환불 규정 생성:', createdPolicy);
        
        // 클라이언트 측 상태 업데이트
        setPolicies([...policies, createdPolicy]);
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('취소/환불 규정 저장 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  // 정책 삭제 핸들러
  const handleDeletePolicy = async () => {
    if (!policyToDelete) return;

    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await productApi.deleteCancellationPolicy(policyToDelete.id);
      
      // 백엔드 구현 전까지 목업 처리
      console.log('취소/환불 규정 삭제:', policyToDelete.id);
      
      // 클라이언트 측 상태 업데이트
      const updatedPolicies = policies.filter(policy => policy.id !== policyToDelete.id);
      setPolicies(updatedPolicies);
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('취소/환불 규정 삭제 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  // 규칙 표시 포맷
  const formatRule = (rule) => {
    if (rule.days === 0) {
      return `체크인 당일 - ${rule.refundRate}% 환불`;
    }
    return `체크인 ${rule.days}일 전 - ${rule.refundRate}% 환불`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          취소/환불 규정 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          숙소에 적용할 취소 및 환불 규정을 관리할 수 있습니다.
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
            규정 추가
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
                <TableCell>규정명</TableCell>
                <TableCell>설명</TableCell>
                <TableCell>규칙</TableCell>
                <TableCell align="center">기본 규정</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {policies.length > 0 ? (
                policies.map((policy) => (
                  <TableRow key={policy.id} hover>
                    <TableCell>{policy.id}</TableCell>
                    <TableCell>{policy.name}</TableCell>
                    <TableCell>{policy.description}</TableCell>
                    <TableCell>
                      {policy.rules.map((rule, index) => (
                        <div key={index}>{formatRule(rule)}</div>
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      {policy.isDefault ? '예' : '아니오'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="수정">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(policy)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDeleteDialog(policy)}
                          disabled={policy.isDefault}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : !loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      등록된 취소/환불 규정이 없습니다.
                    </Typography>
                    <Button
                      variant="text"
                      onClick={handleOpenDialog}
                      startIcon={<AddIcon />}
                      sx={{ mt: 1 }}
                    >
                      새 규정 추가하기
                    </Button>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* 규정 추가/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? '취소/환불 규정 수정' : '취소/환불 규정 추가'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="규정명"
              fullWidth
              variant="outlined"
              value={newPolicy.name}
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
              value={newPolicy.description}
              onChange={handleInputChange}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              취소 규칙
            </Typography>
            
            {newPolicy.rules.map((rule, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  type="number"
                  label="체크인 전 일수"
                  value={rule.days}
                  onChange={(e) => handleRuleChange(index, 'days', e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{ inputProps: { min: 0, max: 365 } }}
                  sx={{ width: '150px', mr: 2 }}
                />
                <TextField
                  type="number"
                  label="환불 비율(%)"
                  value={rule.refundRate}
                  onChange={(e) => handleRuleChange(index, 'refundRate', e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  sx={{ width: '150px', mr: 2 }}
                />
                <IconButton
                  onClick={() => handleRemoveRule(index)}
                  disabled={newPolicy.rules.length <= 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            
            <Button
              variant="outlined"
              onClick={handleAddRule}
              startIcon={<AddIcon />}
              size="small"
              sx={{ mt: 1 }}
            >
              규칙 추가
            </Button>
            
            <Box sx={{ mt: 3 }}>
              <FormControl component="fieldset">
                <label>
                  <input
                    type="checkbox"
                    checked={newPolicy.isDefault}
                    onChange={(e) => setNewPolicy(prev => ({ ...prev, isDefault: e.target.checked }))}
                  />
                  기본 규정으로 설정
                </label>
                <FormHelperText>
                  기본 규정은 새 숙소에 자동으로 적용됩니다. 기본 규정은 하나만 설정 가능합니다.
                </FormHelperText>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            취소
          </Button>
          <Button
            onClick={handleSavePolicy}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!newPolicy.name.trim() || newPolicy.rules.length === 0}
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
        <DialogTitle>규정 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {policyToDelete && (
              `'${policyToDelete.name}' 규정을 정말로 삭제하시겠습니까?
              삭제된 데이터는 복구할 수 없습니다.`
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>취소</Button>
          <Button onClick={handleDeletePolicy} color="error" autoFocus>
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CancellationPolicyList; 