import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, LinearProgress, Typography, Box } from '@mui/material';
import AccommodationForm from '../../../components/products/AccommodationForm';
import { productApi } from '../../../api';

// 목업 데이터
const mockAccommodation = {
  id: 'acc001',
  name: '서울 시그니처 호텔',
  category: 'hotel',
  address: '서울시 강남구 테헤란로 123',
  description: '도심 속 휴식을 제공하는 프리미엄 호텔입니다. 비즈니스와 관광 모두에 최적의 위치를 자랑하며, 세련된 객실과 다양한 부대시설을 갖추고 있습니다.',
  checkInTime: '15:00',
  checkOutTime: '11:00',
  amenities: ['wifi', 'parking', 'breakfast', 'pool', 'gym'],
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
  isActive: true
};

/**
 * 숙소 수정 페이지 컴포넌트
 */
const AccommodationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // 폼 제출 핸들러
  const handleSubmit = async (values) => {
    try {
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // return await productApi.updateAccommodation(id, values);
      
      // 백엔드 구현 전까지 목업 응답 반환
      console.log('숙소 수정 데이터:', values);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            success: true, 
            data: { 
              id,
              ...values 
            } 
          });
        }, 1000);
      });
    } catch (error) {
      console.error('숙소 수정 중 오류가 발생했습니다:', error);
      throw error;
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
          <Typography variant="body2">
            숙소 목록으로 돌아가서 다시 시도해주세요.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <AccommodationForm
        initialValues={accommodation}
        isEdit={true}
        onSubmit={handleSubmit}
      />
    </Container>
  );
};

export default AccommodationEdit; 