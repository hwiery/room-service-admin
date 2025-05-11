import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// API 엔드포인트 (실제 구현 시 환경 변수나 설정에서 가져올 수 있음)
const API_URL = '/api';

/**
 * 숙소 목록을 가져오는 함수
 * @param {Object} params - 필터링, 정렬, 페이지네이션 등의 파라미터
 */
const fetchAccommodations = async (params = {}) => {
  // 실제 API 연결 시 사용할 코드
  // const { data } = await axios.get(`${API_URL}/accommodations`, { params });
  // return data;
  
  // 목업 데이터 반환 (개발 중에만 사용)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: [
          { id: 'ACC001', name: '서울 그랜드 호텔', address: '서울시 중구', category: '호텔', rooms: 12, rating: 4.5, status: 'active' },
          { id: 'ACC002', name: '부산 오션 리조트', address: '부산시 해운대구', category: '리조트', rooms: 25, rating: 4.2, status: 'active' },
          { id: 'ACC003', name: '제주 펜션', address: '제주시 애월읍', category: '펜션', rooms: 8, rating: 4.7, status: 'active' },
          { id: 'ACC004', name: '강원 스키 리조트', address: '강원도 평창군', category: '리조트', rooms: 32, rating: 4.0, status: 'inactive' },
        ],
        total: 4,
        page: 1,
        perPage: 10,
        totalPages: 1
      });
    }, 500);
  });
};

/**
 * 숙소 상세 정보를 가져오는 함수
 * @param {string} id - 숙소 ID
 */
const fetchAccommodation = async (id) => {
  if (!id) return null;
  
  // 실제 API 연결 시 사용할 코드
  // const { data } = await axios.get(`${API_URL}/accommodations/${id}`);
  // return data;
  
  // 목업 데이터 반환 (개발 중에만 사용)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: id === 'ACC001' ? '서울 그랜드 호텔' : '부산 오션 리조트',
        description: '멋진 호텔입니다.',
        address: id === 'ACC001' ? '서울시 중구' : '부산시 해운대구',
        category: id === 'ACC001' ? '호텔' : '리조트',
        rooms: id === 'ACC001' ? 12 : 25,
        rating: id === 'ACC001' ? 4.5 : 4.2,
        status: 'active',
        images: [
          { id: 1, url: 'https://example.com/image1.jpg', isMain: true },
          { id: 2, url: 'https://example.com/image2.jpg', isMain: false },
        ],
        amenities: ['wifi', 'parking', 'breakfast'],
        policies: {
          checkIn: '15:00',
          checkOut: '11:00',
          cancellation: '예약 3일 전까지 무료 취소 가능'
        }
      });
    }, 500);
  });
};

/**
 * 숙소 등록 함수
 * @param {Object} accommodationData - 등록할 숙소 데이터
 */
const createAccommodation = async (accommodationData) => {
  // 실제 API 연결 시 사용할 코드
  // const { data } = await axios.post(`${API_URL}/accommodations`, accommodationData);
  // return data;
  
  // 목업 응답 (개발 중에만 사용)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'ACC' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        ...accommodationData,
        createdAt: new Date().toISOString()
      });
    }, 500);
  });
};

/**
 * 숙소 수정 함수
 * @param {Object} accommodationData - 수정할 숙소 데이터 (id 포함)
 */
const updateAccommodation = async (accommodationData) => {
  // 실제 API 연결 시 사용할 코드
  // const { data } = await axios.put(`${API_URL}/accommodations/${accommodationData.id}`, accommodationData);
  // return data;
  
  // 목업 응답 (개발 중에만 사용)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...accommodationData,
        updatedAt: new Date().toISOString()
      });
    }, 500);
  });
};

/**
 * 숙소 삭제 함수
 * @param {string} id - 삭제할 숙소 ID
 */
const deleteAccommodation = async (id) => {
  // 실제 API 연결 시 사용할 코드
  // await axios.delete(`${API_URL}/accommodations/${id}`);
  // return true;
  
  // 목업 응답 (개발 중에만 사용)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

/**
 * 숙소 목록 조회 훅
 * @param {Object} params - 필터링, 정렬, 페이지네이션 등의 파라미터
 * @param {Object} options - React Query 옵션
 */
export const useAccommodations = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['accommodations', params],
    queryFn: () => fetchAccommodations(params),
    ...options
  });
};

/**
 * 숙소 상세 조회 훅
 * @param {string} id - 숙소 ID
 * @param {Object} options - React Query 옵션
 */
export const useAccommodation = (id, options = {}) => {
  return useQuery({
    queryKey: ['accommodation', id],
    queryFn: () => fetchAccommodation(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    ...options
  });
};

/**
 * 숙소 등록 뮤테이션 훅
 */
export const useCreateAccommodation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAccommodation,
    onSuccess: () => {
      // 성공 시 숙소 목록 쿼리 무효화 (데이터 갱신)
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
    }
  });
};

/**
 * 숙소 수정 뮤테이션 훅
 */
export const useUpdateAccommodation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateAccommodation,
    onSuccess: (data) => {
      // 성공 시 해당 숙소 쿼리와 목록 쿼리 모두 무효화
      queryClient.invalidateQueries({ queryKey: ['accommodation', data.id] });
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
    }
  });
};

/**
 * 숙소 삭제 뮤테이션 훅
 */
export const useDeleteAccommodation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAccommodation,
    onSuccess: (_, id) => {
      // 성공 시 해당 숙소 쿼리와 목록 쿼리 모두 무효화
      queryClient.invalidateQueries({ queryKey: ['accommodation', id] });
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
    }
  });
}; 