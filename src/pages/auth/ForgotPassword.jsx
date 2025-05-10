import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box, 
  Container, 
  Alert,
  Link
} from '@mui/material';
import { authApi } from '../../api';

// 유효성 검증 스키마
const validationSchema = Yup.object({
  email: Yup.string()
    .email('유효한 이메일 주소를 입력해주세요')
    .required('이메일을 입력해주세요'),
});

/**
 * 비밀번호 찾기 페이지 컴포넌트
 */
const ForgotPassword = () => {
  const [status, setStatus] = useState({
    success: false,
    error: null
  });

  // 폼 제출 처리
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await authApi.forgotPassword(values.email);
      setStatus({
        success: true,
        error: null
      });
    } catch (error) {
      setStatus({
        success: false,
        error: error.response?.data?.message || '비밀번호 찾기 요청 중 오류가 발생했습니다.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom>
            비밀번호 찾기
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            가입시 등록한 이메일을 입력하시면 비밀번호 재설정 안내가 발송됩니다.
          </Typography>
          
          {status.success ? (
            <Box textAlign="center">
              <Alert severity="success" sx={{ mb: 2 }}>
                비밀번호 재설정 안내를 발송했습니다. 이메일을 확인해주세요.
              </Alert>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                로그인 페이지로 돌아가기
              </Button>
            </Box>
          ) : (
            <>
              {status.error && (
                <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                  {status.error}
                </Alert>
              )}
              
              <Formik
                initialValues={{ email: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, touched, errors }) => (
                  <Form style={{ width: '100%' }}>
                    <Field
                      as={TextField}
                      name="email"
                      label="이메일"
                      type="email"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                    
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      disabled={isSubmitting}
                      sx={{ mt: 3, mb: 2 }}
                    >
                      비밀번호 재설정 요청
                    </Button>
                  </Form>
                )}
              </Formik>
              
              <Box mt={1} textAlign="center">
                <Link component={RouterLink} to="/login" variant="body2">
                  로그인 페이지로 돌아가기
                </Link>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword; 