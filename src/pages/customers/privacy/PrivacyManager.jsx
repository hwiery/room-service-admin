import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Snackbar,
  Alert,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  DeleteForever as DeleteForeverIcon,
  Visibility as VisibilityIcon,
  Lock as LockIcon,
  Download as DownloadIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { format, parseISO, subYears } from 'date-fns';
import { customerApi } from '../../../api/customerApi';

// 목업 데이터 - 개인정보 설정
const mockPrivacySettings = {
  retentionPeriod: 3, // 개인정보 보유 기간 (년)
  autoDeleteInactive: true, // 비활성 계정 자동 삭제
  inactiveThreshold: 1, // 비활성 기준 기간 (년)
  maskSensitiveData: true, // 민감 정보 마스킹
  logAccessHistory: true, // 개인정보 접근 로그 기록
  exportFormat: 'json', // 개인정보 내보내기 형식
  gdprCompliance: true, // GDPR 준수 여부
  lastUpdated: '2023-05-15T10:30:45' // 마지막 업데이트 시간
};

// 목업 데이터 - 삭제 대상 회원
const mockMembersToDelete = [
  {
    id: 'M008',
    name: '장민수',
    email: 'jang@example.com',
    lastLoginDate: '2022-02-10T14:30:22',
    registrationDate: '2021-08-20T09:15:22',
    inactiveDays: 480,
    dataSize: '1.2MB',
    reservationCount: 2
  },
  {
    id: 'M010',
    name: '홍길동',
    email: 'hong@example.com',
    lastLoginDate: '2022-04-05T11:10:55',
    registrationDate: '2021-10-12T16:45:30',
    inactiveDays: 425,
    dataSize: '0.9MB',
    reservationCount: 1
  },
  {
    id: 'M015',
    name: '김지영',
    email: 'kim.jy@example.com',
    lastLoginDate: '2022-03-18T09:25:10',
    registrationDate: '2021-12-05T14:20:35',
    inactiveDays: 443,
    dataSize: '1.5MB',
    reservationCount: 3
  }
];

// 목업 데이터 - 개인정보 접근 로그
const mockAccessLogs = [
  {
    id: 'LOG001',
    adminId: 'admin1',
    adminName: '관리자1',
    action: 'view',
    dataType: 'member_detail',
    targetId: 'M002',
    targetName: '이영희',
    timestamp: '2023-06-01T10:15:30',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'LOG002',
    adminId: 'admin2',
    adminName: '관리자2',
    action: 'export',
    dataType: 'member_data',
    targetId: 'M005',
    targetName: '정현우',
    timestamp: '2023-05-28T14:30:22',
    ipAddress: '192.168.1.101'
  },
  {
    id: 'LOG003',
    adminId: 'admin1',
    adminName: '관리자1',
    action: 'edit',
    dataType: 'member_contact',
    targetId: 'M003',
    targetName: '박지민',
    timestamp: '2023-05-25T09:45:15',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'LOG004',
    adminId: 'admin3',
    adminName: '관리자3',
    action: 'delete',
    dataType: 'member_account',
    targetId: 'M011',
    targetName: '신동욱',
    timestamp: '2023-05-20T16:20:40',
    ipAddress: '192.168.1.102'
  }
];

/**
 * 개인정보 보호 관리 페이지 컴포넌트
 */
const PrivacyManager = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // 개인정보 설정 상태
  const [settings, setSettings] = useState(null);
  const [membersToDelete, setMembersToDelete] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  
  // 다이얼로그 상태
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteMembersDialogOpen, setDeleteMembersDialogOpen] = useState(false);
  
  // 알림 상태
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // API에서 개인정보 설정 가져오기
  useEffect(() => {
    const fetchPrivacySettings = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await customerApi.getPrivacySettings();
        // setSettings(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          setSettings(mockPrivacySettings);
          setMembersToDelete(mockMembersToDelete);
          setAccessLogs(mockAccessLogs);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('개인정보 설정을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };

    fetchPrivacySettings();
  }, []);

  // 설정 변경 핸들러
  const handleSettingChange = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 개인정보 설정 저장 핸들러
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await customerApi.updatePrivacySettings(settings);
      
      // 백엔드 구현 전까지 목업 처리
      console.log('개인정보 설정 저장:', settings);
      
      // 클라이언트 측 상태 업데이트
      setSettings((prev) => ({
        ...prev,
        lastUpdated: new Date().toISOString()
      }));
      
      showSnackbar('개인정보 설정이 저장되었습니다');
    } catch (error) {
      console.error('개인정보 설정 저장 중 오류가 발생했습니다:', error);
      showSnackbar('개인정보 설정 저장 실패', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 개인정보 삭제 실행 핸들러
  const handleExecuteDeletion = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await customerApi.deleteInactiveMembers();
      
      // 백엔드 구현 전까지 목업 처리
      console.log('비활성 회원 삭제 실행');
      
      // 클라이언트 측 상태 업데이트
      setMembersToDelete([]);
      
      setDeleteMembersDialogOpen(false);
      showSnackbar('비활성 회원 삭제가 완료되었습니다');
    } catch (error) {
      console.error('비활성 회원 삭제 중 오류가 발생했습니다:', error);
      showSnackbar('비활성 회원 삭제 실패', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 개인정보 처리방침 내보내기 핸들러
  const handleExportPolicy = () => {
    // 실제 구현에서는 API 호출 또는 파일 다운로드 처리
    console.log('개인정보 처리방침 내보내기');
    showSnackbar('개인정보 처리방침이 다운로드되었습니다');
  };

  // 스낵바 표시 함수
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // 스낵바 닫기 핸들러
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'yyyy년 MM월 dd일 HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  // 액션 텍스트 변환 함수
  const getActionText = (action) => {
    const actionMap = {
      view: '조회',
      edit: '수정',
      delete: '삭제',
      export: '내보내기'
    };
    return actionMap[action] || action;
  };

  // 데이터 타입 텍스트 변환 함수
  const getDataTypeText = (dataType) => {
    const dataTypeMap = {
      member_detail: '회원 상세 정보',
      member_data: '회원 데이터',
      member_contact: '회원 연락처',
      member_account: '회원 계정'
    };
    return dataTypeMap[dataType] || dataType;
  };

  if (loading && !settings) {
    return (
      <Container maxWidth="lg">
        <LinearProgress />
        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h6">개인정보 설정을 불러오는 중...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {loading && <LinearProgress />}
      
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/customers/members')}
          sx={{ mb: 2 }}
        >
          회원 목록으로 돌아가기
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          개인정보 보호 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          GDPR 및 개인정보보호법 준수를 위한 설정
        </Typography>
      </Box>

      {/* 개인정보 보호 설정 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">개인정보 보호 설정</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
          >
            설정 저장
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="개인정보 보유 기간 (년)"
              type="number"
              InputProps={{ inputProps: { min: 1, max: 10 } }}
              value={settings?.retentionPeriod || ''}
              onChange={(e) => handleSettingChange('retentionPeriod', parseInt(e.target.value))}
              helperText="회원 탈퇴 후 개인정보 보관 기간을 설정합니다"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="비활성 계정 기준 기간 (년)"
              type="number"
              InputProps={{ inputProps: { min: 1, max: 5 } }}
              value={settings?.inactiveThreshold || ''}
              onChange={(e) => handleSettingChange('inactiveThreshold', parseInt(e.target.value))}
              helperText="지정된 기간 동안 로그인하지 않은 계정을 비활성으로 처리합니다"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="개인정보 내보내기 형식"
              select
              value={settings?.exportFormat || 'json'}
              onChange={(e) => handleSettingChange('exportFormat', e.target.value)}
              helperText="회원이 자신의 정보를 요청할 때 제공할 형식"
              SelectProps={{
                native: true,
              }}
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="xml">XML</option>
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings?.autoDeleteInactive || false}
                  onChange={(e) => handleSettingChange('autoDeleteInactive', e.target.checked)}
                  color="primary"
                />
              }
              label="비활성 계정 자동 삭제"
              sx={{ mb: 2, display: 'block' }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings?.maskSensitiveData || false}
                  onChange={(e) => handleSettingChange('maskSensitiveData', e.target.checked)}
                  color="primary"
                />
              }
              label="개인정보 마스킹 처리"
              sx={{ mb: 2, display: 'block' }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings?.logAccessHistory || false}
                  onChange={(e) => handleSettingChange('logAccessHistory', e.target.checked)}
                  color="primary"
                />
              }
              label="개인정보 접근 기록 로깅"
              sx={{ mb: 2, display: 'block' }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings?.gdprCompliance || false}
                  onChange={(e) => handleSettingChange('gdprCompliance', e.target.checked)}
                  color="primary"
                />
              }
              label="GDPR 준수 모드"
              sx={{ mb: 2, display: 'block' }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">
                마지막 업데이트: {formatDate(settings?.lastUpdated || new Date().toISOString())}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 비활성 회원 관리 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            비활성 회원 관리 ({membersToDelete.length}명)
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={() => setDeleteMembersDialogOpen(true)}
            disabled={membersToDelete.length === 0}
          >
            일괄 삭제
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>회원번호</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell>마지막 로그인</TableCell>
                <TableCell>비활성 기간</TableCell>
                <TableCell>예약 수</TableCell>
                <TableCell>데이터 크기</TableCell>
                <TableCell align="right">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {membersToDelete.length > 0 ? (
                membersToDelete.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{formatDate(member.lastLoginDate)}</TableCell>
                    <TableCell>{member.inactiveDays}일</TableCell>
                    <TableCell>{member.reservationCount}건</TableCell>
                    <TableCell>{member.dataSize}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="회원 상세 보기">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/customers/members/${member.id}`)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      비활성 회원이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 개인정보 접근 로그 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            개인정보 접근 로그
          </Typography>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportPolicy}
          >
            내보내기
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>로그 ID</TableCell>
                <TableCell>관리자</TableCell>
                <TableCell>작업</TableCell>
                <TableCell>데이터 유형</TableCell>
                <TableCell>대상 회원</TableCell>
                <TableCell>IP 주소</TableCell>
                <TableCell>일시</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accessLogs.length > 0 ? (
                accessLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.id}</TableCell>
                    <TableCell>{log.adminName}</TableCell>
                    <TableCell>{getActionText(log.action)}</TableCell>
                    <TableCell>{getDataTypeText(log.dataType)}</TableCell>
                    <TableCell>{log.targetName} ({log.targetId})</TableCell>
                    <TableCell>{log.ipAddress}</TableCell>
                    <TableCell>{formatDate(log.timestamp)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      접근 로그가 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 개인정보 처리방침 */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            개인정보 처리방침
          </Typography>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportPolicy}
          >
            다운로드
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Typography variant="body2" color="text.secondary" paragraph>
          개인정보 처리방침은 서비스 이용자의 개인정보를 보호하기 위해 회사가 준수해야 할 사항을 규정한 문서입니다.
          여기에서 최신 개인정보 처리방침을 확인하고 다운로드할 수 있습니다.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <LockIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body2">
            현재 버전: v1.2.3 (마지막 업데이트: 2023년 5월 15일)
          </Typography>
        </Box>
      </Paper>

      {/* 설정 저장 확인 다이얼로그 */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>설정 저장</DialogTitle>
        <DialogContent>
          <DialogContentText>
            개인정보 보호 설정을 저장하시겠습니까? 이 설정은 즉시 적용됩니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>취소</Button>
          <Button onClick={handleSaveSettings} color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 회원 삭제 확인 다이얼로그 */}
      <Dialog open={deleteMembersDialogOpen} onClose={() => setDeleteMembersDialogOpen(false)}>
        <DialogTitle>비활성 회원 일괄 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            총 {membersToDelete.length}명의 비활성 회원 데이터를 삭제합니다. 
            이 작업은 되돌릴 수 없으며, 모든 개인정보가 영구적으로 삭제됩니다.
            계속하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteMembersDialogOpen(false)}>취소</Button>
          <Button onClick={handleExecuteDeletion} color="error">
            삭제
          </Button>
        </DialogActions>
      </Dialog>

      {/* 알림 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PrivacyManager; 