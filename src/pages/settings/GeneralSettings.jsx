import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

/**
 * 탭 패널 컴포넌트
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * 사이트 기본 설정 페이지 컴포넌트
 */
const GeneralSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    siteName: '숙소 예약 서비스',
    siteDescription: '최고의 숙박 예약 서비스',
    contactEmail: 'contact@example.com',
    contactPhone: '02-1234-5678',
    businessHours: '09:00 - 18:00 (주중)',
    currencySymbol: '₩',
    dateFormat: 'YYYY-MM-DD',
    timeZone: 'Asia/Seoul',
    maintenanceMode: false,
    reservationEnabled: true,
    bookingLeadTime: 1,
    maxBookingDays: 30,
    defaultCheckIn: '15:00',
    defaultCheckOut: '11:00'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 데이터 로드 (목업)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // 실제 API 호출 대신 타임아웃으로 목업 처리
        setTimeout(() => {
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('설정을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
        showSnackbar('설정을 불러올 수 없습니다', 'error');
      }
    };

    fetchSettings();
  }, []);

  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 설정 변경 핸들러
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === 'checkbox' ? checked : value;
    
    setSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // 설정 저장 핸들러
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await api.saveSettings(settings);
      
      // 백엔드 구현 전까지 목업 처리
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSnackbar('설정이 성공적으로 저장되었습니다');
    } catch (error) {
      console.error('설정 저장 중 오류가 발생했습니다:', error);
      showSnackbar('설정 저장 실패', 'error');
    } finally {
      setSaving(false);
    }
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

  return (
    <Container maxWidth="lg">
      {loading && <LinearProgress />}
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          시스템 설정
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          서비스 운영에 필요한 기본 설정을 관리합니다.
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="기본 설정" />
          <Tab label="예약 설정" />
          <Tab label="시스템 유지관리" />
        </Tabs>
      </Box>
      
      <Card>
        <CardContent>
          {/* 기본 설정 탭 */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  사이트 정보
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="사이트명"
                      name="siteName"
                      value={settings.siteName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="사이트 설명"
                      name="siteDescription"
                      value={settings.siteDescription}
                      onChange={handleChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  연락처 정보
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="연락처 이메일"
                      name="contactEmail"
                      value={settings.contactEmail}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="연락처 전화번호"
                      name="contactPhone"
                      value={settings.contactPhone}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="영업시간"
                      name="businessHours"
                      value={settings.businessHours}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  지역 및 화폐
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="화폐 단위"
                      name="currencySymbol"
                      value={settings.currencySymbol}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="날짜 형식"
                      name="dateFormat"
                      value={settings.dateFormat}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <TextField
                        select
                        label="시간대"
                        name="timeZone"
                        value={settings.timeZone}
                        onChange={handleChange}
                      >
                        <MenuItem value="Asia/Seoul">아시아/서울 (GMT+9)</MenuItem>
                        <MenuItem value="Asia/Tokyo">아시아/도쿄 (GMT+9)</MenuItem>
                        <MenuItem value="America/New_York">미국/뉴욕 (GMT-5)</MenuItem>
                        <MenuItem value="Europe/London">유럽/런던 (GMT+0)</MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* 예약 설정 탭 */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  예약 기본 설정
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.reservationEnabled}
                          onChange={handleChange}
                          name="reservationEnabled"
                          color="primary"
                        />
                      }
                      label="예약 시스템 활성화"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="최소 예약 가능일 (현재 날짜로부터 몇 일 후)"
                      name="bookingLeadTime"
                      type="number"
                      value={settings.bookingLeadTime}
                      onChange={handleChange}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="최대 예약 가능 일수"
                      name="maxBookingDays"
                      type="number"
                      value={settings.maxBookingDays}
                      onChange={handleChange}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  체크인/체크아웃 설정
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="기본 체크인 시간"
                      name="defaultCheckIn"
                      value={settings.defaultCheckIn}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="기본 체크아웃 시간"
                      name="defaultCheckOut"
                      value={settings.defaultCheckOut}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* 시스템 유지관리 탭 */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  시스템 상태
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.maintenanceMode}
                          onChange={handleChange}
                          name="maintenanceMode"
                          color="primary"
                        />
                      }
                      label="유지보수 모드 활성화"
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      활성화하면 사용자는 유지보수 중 페이지를 보게 됩니다. 관리자는 계속 접근 가능합니다.
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* 저장 버튼 */}
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '저장 중...' : '설정 저장'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      
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

export default GeneralSettings; 