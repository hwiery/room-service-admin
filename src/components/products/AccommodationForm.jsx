import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { productApi } from '../../api';
import imageOptimizer from '../../utils/imageOptimizer';

// 목업 데이터
const mockCategories = [
  { id: 'hotel', name: '호텔' },
  { id: 'resort', name: '리조트' },
  { id: 'pension', name: '펜션' },
  { id: 'guesthouse', name: '게스트하우스' },
  { id: 'villa', name: '빌라' }
];

const mockAmenities = [
  { id: 'wifi', name: '무료 와이파이' },
  { id: 'parking', name: '주차장' },
  { id: 'breakfast', name: '조식 제공' },
  { id: 'pool', name: '수영장' },
  { id: 'gym', name: '피트니스 센터' },
  { id: 'spa', name: '스파' },
  { id: 'ac', name: '에어컨' },
  { id: 'restaurant', name: '레스토랑' },
  { id: 'bar', name: '바/라운지' },
  { id: 'terrace', name: '테라스' }
];

// 유효성 검증 스키마
const validationSchema = Yup.object({
  name: Yup.string().required('숙소명은 필수 입력 항목입니다'),
  category: Yup.string().required('카테고리는 필수 선택 항목입니다'),
  address: Yup.string().required('주소는 필수 입력 항목입니다'),
  description: Yup.string().required('설명은 필수 입력 항목입니다'),
  checkInTime: Yup.string().required('체크인 시간은 필수 입력 항목입니다'),
  checkOutTime: Yup.string().required('체크아웃 시간은 필수 입력 항목입니다'),
  amenities: Yup.array().min(1, '최소 1개 이상의 편의시설을 선택해주세요'),
  images: Yup.array().min(1, '최소 1개 이상의 이미지를 등록해주세요')
});

// 탭 컴포넌트
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`accommodation-tabpanel-${index}`}
      aria-labelledby={`accommodation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * 숙소 등록/수정 폼 컴포넌트
 * @param {Object} props
 * @param {Object} props.initialValues - 초기 폼 데이터 (수정 시 사용)
 * @param {boolean} props.isEdit - 수정 모드 여부
 * @param {Function} props.onSubmit - 폼 제출 핸들러
 */
const AccommodationForm = ({ initialValues, isEdit, onSubmit }) => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [categories, setCategories] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);

  // 기본 초기값
  const defaultValues = {
    name: '',
    category: '',
    address: '',
    description: '',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    amenities: [],
    images: [],
    isActive: true
  };

  // API에서 카테고리 및 편의시설 목록 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const [categoriesResponse, amenitiesResponse] = await Promise.all([
        //   productApi.getCategories(),
        //   productApi.getAmenities()
        // ]);
        // setCategories(categoriesResponse.data);
        // setAmenities(amenitiesResponse.data);

        // 목업 데이터 사용 (백엔드 구현 전까지)
        setCategories(mockCategories);
        setAmenities(mockAmenities);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchData();
  }, []);

  // 컴포넌트 언마운트 시 URL 객체 해제
  useEffect(() => {
    return () => {
      // 컴포넌트 내에서 생성한 모든 URL 객체 해제
      if (initialValues?.images) {
        initialValues.images.forEach(image => {
          if (image.url && image.url.startsWith('blob:')) {
            imageOptimizer.revokeObjectURL(image.url);
          }
        });
      }
    };
  }, [initialValues]);

  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 이미지 업로드 핸들러 (실제 업로드 기능 구현 필요)
  const handleImageUpload = async (event, setFieldValue, images) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);

    try {
      // 이미지 최적화 (리사이징 및 압축)
      const optimizedImages = await imageOptimizer.optimizeMultipleImages(files, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
        format: 'webp'
      });

      // 실제 API 호출 (백엔드 구현 후 활성화)
      // const formData = new FormData();
      // for (const img of optimizedImages) {
      //   formData.append('images', img.file);
      // }
      // const response = await productApi.uploadImage(formData);
      // const uploadedImages = response.data;
      // setFieldValue('images', [...images, ...uploadedImages]);

      // 목업 이미지 객체 생성 (백엔드 구현 전까지)
      const mockUploadedImages = optimizedImages.map((img) => ({
        id: `img-${Date.now()}-${img.name}`,
        url: img.url,
        name: img.name,
        // 최적화 정보 추가 (UI에 표시할 수 있음)
        optimized: true,
        size: imageOptimizer.formatFileSize(img.blob.size)
      }));

      setFieldValue('images', [...images, ...mockUploadedImages]);
      
      console.log('이미지 최적화 완료:', mockUploadedImages);
    } catch (error) {
      console.error('이미지 업로드/최적화 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onSubmit(values);
      navigate('/products/accommodations');
    } catch (error) {
      console.error('폼 제출 중 오류가 발생했습니다:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues || defaultValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, isSubmitting, setFieldValue }) => (
        <Form>
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/products/accommodations')}
              sx={{ mb: 2 }}
            >
              목록으로 돌아가기
            </Button>
            <Typography variant="h4" component="h1" gutterBottom>
              {isEdit ? '숙소 정보 수정' : '새 숙소 등록'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEdit
                ? '숙소 정보를 수정하세요'
                : '새로운 숙소 정보를 입력하세요'}
            </Typography>
          </Box>

          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="기본 정보" />
              <Tab label="상세 정보" />
              <Tab label="이미지" />
            </Tabs>

            {/* 기본 정보 탭 */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="숙소명"
                    name="name"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    error={touched.category && Boolean(errors.category)}
                    required
                  >
                    <InputLabel>카테고리</InputLabel>
                    <Field
                      as={Select}
                      name="category"
                      label="카테고리"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.category && errors.category && (
                      <FormHelperText>{errors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="주소"
                    name="address"
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="체크인 시간"
                    name="checkInTime"
                    error={touched.checkInTime && Boolean(errors.checkInTime)}
                    helperText={touched.checkInTime && errors.checkInTime}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="체크아웃 시간"
                    name="checkOutTime"
                    error={touched.checkOutTime && Boolean(errors.checkOutTime)}
                    helperText={touched.checkOutTime && errors.checkOutTime}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.isActive}
                        onChange={(e) => setFieldValue('isActive', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="활성화 (숙소 운영 중)"
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* 상세 정보 탭 */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="숙소 설명"
                    name="description"
                    multiline
                    rows={6}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    편의시설
                  </Typography>
                  <FormControl
                    fullWidth
                    error={touched.amenities && Boolean(errors.amenities)}
                  >
                    <FieldArray name="amenities">
                      {({ push, remove }) => (
                        <Box>
                          <Grid container spacing={1}>
                            {amenities.map((amenity) => (
                              <Grid item key={amenity.id}>
                                <Chip
                                  label={amenity.name}
                                  color={
                                    values.amenities.includes(amenity.id)
                                      ? 'primary'
                                      : 'default'
                                  }
                                  onClick={() => {
                                    if (values.amenities.includes(amenity.id)) {
                                      const index = values.amenities.indexOf(amenity.id);
                                      remove(index);
                                    } else {
                                      push(amenity.id);
                                    }
                                  }}
                                  sx={{ m: 0.5 }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                          {touched.amenities && errors.amenities && (
                            <FormHelperText error>{errors.amenities}</FormHelperText>
                          )}
                        </Box>
                      )}
                    </FieldArray>
                  </FormControl>
                </Grid>
              </Grid>
            </TabPanel>

            {/* 이미지 탭 */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    숙소 이미지
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    sx={{ mb: 2 }}
                    disabled={loading}
                  >
                    이미지 업로드
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={(e) => handleImageUpload(e, setFieldValue, values.images)}
                    />
                  </Button>
                  {touched.images && errors.images && (
                    <FormHelperText error>{errors.images}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FieldArray name="images">
                    {({ remove }) => (
                      <Grid container spacing={2}>
                        {values.images.map((image, index) => (
                          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                            <Card sx={{ position: 'relative' }}>
                              <Box
                                component="img"
                                src={image.url}
                                alt={image.name || `이미지 ${index + 1}`}
                                sx={{
                                  width: '100%',
                                  height: 200,
                                  objectFit: 'cover',
                                }}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  p: 1,
                                }}
                              >
                                <Button
                                  variant="contained"
                                  color="error"
                                  size="small"
                                  onClick={() => remove(index)}
                                  sx={{ minWidth: 'auto', p: '4px' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </Button>
                              </Box>
                              <Box sx={{ p: 1 }}>
                                <Typography variant="body2" noWrap>
                                  {image.name || `이미지 ${index + 1}`}
                                </Typography>
                                {image.optimized && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                    <Chip 
                                      size="small" 
                                      label="최적화됨" 
                                      color="success" 
                                      variant="outlined" 
                                      sx={{ mr: 1, height: '20px', fontSize: '0.7rem' }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      {image.size}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </FieldArray>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/products/accommodations')}
              sx={{ mr: 2 }}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={isSubmitting}
            >
              {isEdit ? '변경사항 저장' : '숙소 등록'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AccommodationForm; 