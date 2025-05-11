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
  TextField,
  Typography
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

/**
 * 결제 게이트웨이 설정 페이지 컴포넌트
 */
const PaymentSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    activeGateway: 'toss',
    testMode: true,
    
    // 토스 페이먼츠 설정
    toss: {
      enabled: true,
      apiKey: 'test_api_key_123456789',
      secretKey: 'test_secret_key_987654321',
      callbackUrl: 'https://example.com/payments/toss/callback',
      methods: ['card', 'transfer', 'virtualAccount']
    },
    
    // 아임포트 설정
    iamport: {
      enabled: false,
      merchantId: 'imp00000000',
      apiKey: '',
      secretKey: '',
      callbackUrl: 'https://example.com/payments/iamport/callback',
      methods: ['card', 'kakaopay']
    },
    
    // 나이스페이 설정
    nicepay: {
      enabled: false,
      merchantId: '',
      merchantKey: '',
      callbackUrl: 'https://example.com/payments/nicepay/callback',
      methods: ['card']
    },
    
    // 결제 일반 설정
    allowPartialPayment: true,
    depositPercentage: 30,
    depositDueDays: 2,
    fullPaymentDueDays: 7,
    refundPolicy: '예약 취소 시 7일 전: 100% 환불, 3일 전: 50% 환불, 당일: 환불 불가'
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
        console.error('결제 설정을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
        showSnackbar('결제 설정을 불러올 수 없습니다', 'error');
      }
    };

    fetchSettings();
  }, []);

  // 설정 변경 핸들러
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === 'checkbox' ? checked : value;
    
    setSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // PG사 개별 설정 변경 핸들러
  const handleGatewayChange = (gateway, field, value) => {
    setSettings(prev => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        [field]: value
      }
    }));
  };

  // 결제 수단 체크 핸들러
  const handleMethodToggle = (gateway, method) => {
    setSettings(prev => {
      const methods = [...prev[gateway].methods];
      const index = methods.indexOf(method);
      
      if (index === -1) {
        methods.push(method);
      } else {
        methods.splice(index, 1);
      }
      
      return {
        ...prev,
        [gateway]: {
          ...prev[gateway],
          methods
        }
      };
    });
  };

  // 설정 저장 핸들러
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await api.savePaymentSettings(settings);
      
      // 백엔드 구현 전까지 목업 처리
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSnackbar('결제 설정이 성공적으로 저장되었습니다');
    } catch (error) {
      console.error('결제 설정 저장 중 오류가 발생했습니다:', error);
      showSnackbar('결제 설정 저장 실패', 'error');
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
          결제 게이트웨이 설정
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          결제 게이트웨이 및 결제 관련 설정을 관리합니다.
        </Typography>
      </Box>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            공통 설정
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  select
                  label="기본 결제 게이트웨이"
                  name="activeGateway"
                  value={settings.activeGateway}
                  onChange={handleChange}
                >
                  <MenuItem value="toss">토스 페이먼츠</MenuItem>
                  <MenuItem value="iamport">아임포트</MenuItem>
                  <MenuItem value="nicepay">나이스페이</MenuItem>
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.testMode}
                    onChange={handleChange}
                    name="testMode"
                    color="primary"
                  />
                }
                label="테스트 모드 활성화"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                활성화하면 실제 결제가 이루어지지 않습니다. 개발 및 테스트 시에만 사용하세요.
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            토스 페이먼츠 설정
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.toss.enabled}
                    onChange={(e) => handleGatewayChange('toss', 'enabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="토스 페이먼츠 활성화"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="API 키"
                value={settings.toss.apiKey}
                onChange={(e) => handleGatewayChange('toss', 'apiKey', e.target.value)}
                disabled={!settings.toss.enabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Secret 키"
                type="password"
                value={settings.toss.secretKey}
                onChange={(e) => handleGatewayChange('toss', 'secretKey', e.target.value)}
                disabled={!settings.toss.enabled}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="콜백 URL"
                value={settings.toss.callbackUrl}
                onChange={(e) => handleGatewayChange('toss', 'callbackUrl', e.target.value)}
                disabled={!settings.toss.enabled}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                결제 수단
              </Typography>
              <Grid container spacing={1}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.toss.methods.includes('card')}
                        onChange={() => handleMethodToggle('toss', 'card')}
                        disabled={!settings.toss.enabled}
                      />
                    }
                    label="신용카드"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.toss.methods.includes('transfer')}
                        onChange={() => handleMethodToggle('toss', 'transfer')}
                        disabled={!settings.toss.enabled}
                      />
                    }
                    label="계좌이체"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.toss.methods.includes('virtualAccount')}
                        onChange={() => handleMethodToggle('toss', 'virtualAccount')}
                        disabled={!settings.toss.enabled}
                      />
                    }
                    label="가상계좌"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            아임포트 설정
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.iamport.enabled}
                    onChange={(e) => handleGatewayChange('iamport', 'enabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="아임포트 활성화"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="상점 ID"
                value={settings.iamport.merchantId}
                onChange={(e) => handleGatewayChange('iamport', 'merchantId', e.target.value)}
                disabled={!settings.iamport.enabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="API 키"
                value={settings.iamport.apiKey}
                onChange={(e) => handleGatewayChange('iamport', 'apiKey', e.target.value)}
                disabled={!settings.iamport.enabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Secret 키"
                type="password"
                value={settings.iamport.secretKey}
                onChange={(e) => handleGatewayChange('iamport', 'secretKey', e.target.value)}
                disabled={!settings.iamport.enabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="콜백 URL"
                value={settings.iamport.callbackUrl}
                onChange={(e) => handleGatewayChange('iamport', 'callbackUrl', e.target.value)}
                disabled={!settings.iamport.enabled}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                결제 수단
              </Typography>
              <Grid container spacing={1}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.iamport.methods.includes('card')}
                        onChange={() => handleMethodToggle('iamport', 'card')}
                        disabled={!settings.iamport.enabled}
                      />
                    }
                    label="신용카드"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.iamport.methods.includes('kakaopay')}
                        onChange={() => handleMethodToggle('iamport', 'kakaopay')}
                        disabled={!settings.iamport.enabled}
                      />
                    }
                    label="카카오페이"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            결제 옵션 설정
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.allowPartialPayment}
                    onChange={handleChange}
                    name="allowPartialPayment"
                    color="primary"
                  />
                }
                label="부분 결제 허용"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                활성화하면 예약 시 계약금 납부 후 나머지는 추후 결제 가능
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="예약금 비율 (%)"
                type="number"
                name="depositPercentage"
                value={settings.depositPercentage}
                onChange={handleChange}
                disabled={!settings.allowPartialPayment}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="예약금 납부 기한 (일)"
                type="number"
                name="depositDueDays"
                value={settings.depositDueDays}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="전액 결제 기한 (일)"
                type="number"
                name="fullPaymentDueDays"
                value={settings.fullPaymentDueDays}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="환불 정책"
                name="refundPolicy"
                value={settings.refundPolicy}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
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

export default PaymentSettings; 