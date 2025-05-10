import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box, 
  Alert,
  Container,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';

// 유효성 검증 스키마
const validationSchema = Yup.object({
  username: Yup.string().required('아이디를 입력해주세요'),
  password: Yup.string().required('비밀번호를 입력해주세요'),
});

/**
 * 로그인 페이지 컴포넌트
 */
const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // 비밀번호 표시/숨김 토글
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  
  // 폼 제출 처리
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values.username, values.password);
      navigate('/dashboard');
    } catch (err) {
      // 에러는 useAuth 내에서 처리
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
            ABC 숙소 예약 서비스 관리자
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            관리자 계정으로 로그인하세요
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
          
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form style={{ width: '100%' }}>
                <Field
                  as={TextField}
                  name="username"
                  label="아이디"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />
                
                <Field
                  as={TextField}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="비밀번호"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="비밀번호 표시 전환"
                          onClick={toggleShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
                  로그인
                </Button>
              </Form>
            )}
          </Formik>
          
          <Box mt={1} textAlign="center">
            <Link href="/forgot-password" variant="body2">
              비밀번호를 잊으셨나요?
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 