import React from 'react';
import { Container } from '@mui/material';
import AccommodationForm from '../../../components/products/AccommodationForm';
import { productApi } from '../../../api';

/**
 * 새 숙소 등록 페이지 컴포넌트
 */
const AccommodationNew = () => {
  // 폼 제출 핸들러
  const handleSubmit = async (values) => {
    try {
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // return await productApi.createAccommodation(values);
      
      // 백엔드 구현 전까지 목업 응답 반환
      console.log('숙소 등록 데이터:', values);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            success: true, 
            data: { 
              id: `acc-${Date.now()}`,
              ...values 
            } 
          });
        }, 1000);
      });
    } catch (error) {
      console.error('숙소 등록 중 오류가 발생했습니다:', error);
      throw error;
    }
  };

  return (
    <Container maxWidth="lg">
      <AccommodationForm 
        isEdit={false}
        onSubmit={handleSubmit}
      />
    </Container>
  );
};

export default AccommodationNew; 