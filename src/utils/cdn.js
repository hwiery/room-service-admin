/**
 * CDN 활용 유틸리티
 * - 이미지 및 정적 파일을 CDN에서 제공
 * - 개발/운영 환경에 따라 자동 전환
 */
import cdnConfig, { currentProviders } from '../config/cdnConfig';

// 크기별 설정
const sizeMap = {
  thumbnail: { width: 100, height: 100, quality: 70 },
  small: { width: 300, height: 300, quality: 80 },
  medium: { width: 600, height: 600, quality: 80 },
  large: { width: 1200, height: 1200, quality: 85 }
};

// 현재 환경에 맞는 기본 URL 반환
const getBaseUrl = () => {
  return cdnConfig.enabled ? cdnConfig.baseUrl : cdnConfig.baseUrl;
};

/**
 * 이미지 URL 생성 함수
 * @param {string} path - 이미지 경로
 * @param {Object} options - 옵션 (width, height, quality)
 * @returns {string} CDN 이미지 URL
 */
export const getImageUrl = (path, options = {}) => {
  // path가 완전한 URL인 경우 그대로 반환
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }

  // path가 없는 경우 기본 이미지 반환
  if (!path) {
    return `${getBaseUrl()}${cdnConfig.imagePrefix}/placeholder.svg`;
  }

  // 이미지 제공자가 Cloudinary인 경우 Cloudinary URL 생성
  if (cdnConfig.providers.image === 'cloudinary') {
    return getCloudinaryUrl(path, options);
  }

  // 기본 CDN URL 구성
  let url = `${getBaseUrl()}${cdnConfig.imagePrefix}${path.startsWith('/') ? path : `/${path}`}`;

  // 최적화 파라미터 추가
  const params = [];
  
  if (options.width) {
    params.push(`w=${options.width}`);
  }
  
  if (options.height) {
    params.push(`h=${options.height}`);
  }
  
  const quality = options.quality || cdnConfig.defaultQuality;
  params.push(`q=${quality}`);
  
  // 파라미터가 있으면 URL에 추가
  if (params.length > 0 && cdnConfig.enabled) {
    url += `?${params.join('&')}`;
  }
  
  return url;
};

/**
 * Cloudinary URL 생성
 * @param {string} path - 이미지 경로
 * @param {Object} options - 옵션
 * @returns {string} Cloudinary URL
 */
const getCloudinaryUrl = (path, options = {}) => {
  const cloudinary = currentProviders.image;
  const cloudName = cloudinary.cloudName;
  
  // 기본 변환 설정
  let transformation = '';
  
  // 크기 설정이 있으면 적용
  if (options.size && cloudinary.transformations[options.size]) {
    transformation = cloudinary.transformations[options.size];
  } else {
    // 개별 옵션 적용
    const params = [];
    
    if (options.width) {
      params.push(`w_${options.width}`);
    }
    
    if (options.height) {
      params.push(`h_${options.height}`);
    }
    
    if (options.quality) {
      params.push(`q_${options.quality}`);
    } else {
      params.push(`q_${cdnConfig.defaultQuality}`);
    }
    
    if (params.length > 0) {
      transformation = params.join(',');
    }
  }
  
  // 경로에서 파일명 추출
  const fileName = path.split('/').pop();
  
  // Cloudinary URL 구성
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${fileName}`;
};

/**
 * 정적 파일 URL 생성 함수
 * @param {string} path - 정적 파일 경로
 * @returns {string} CDN 정적 파일 URL
 */
export const getStaticUrl = (path) => {
  // path가 완전한 URL인 경우 그대로 반환
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }

  // CDN URL 구성
  return `${getBaseUrl()}${cdnConfig.staticPrefix}${path.startsWith('/') ? path : `/${path}`}`;
};

/**
 * 이미지 크기와 품질을 조정한 URL 반환
 * @param {string} originalUrl - 원본 이미지 URL
 * @param {string} size - 이미지 크기 (small, medium, large)
 * @returns {string} 최적화된 이미지 URL
 */
export const getOptimizedImageUrl = (originalUrl, size = 'medium') => {
  // 이미 CDN URL이거나 외부 URL인 경우
  if (!originalUrl || originalUrl.startsWith('http://') || originalUrl.startsWith('https://')) {
    return originalUrl;
  }

  // 기본값은 medium
  const sizeConfig = sizeMap[size] || sizeMap.medium;
  
  return getImageUrl(originalUrl, {...sizeConfig, size});
};

/**
 * 반응형 이미지 소스 세트 생성
 * @param {string} path - 이미지 경로
 * @returns {string} srcset 속성 값
 */
export const getImageSrcSet = (path) => {
  if (!path) return '';
  
  // 다양한 화면 크기에 맞는 이미지 URL 생성
  const widths = [320, 640, 1024, 1280, 1920];
  
  return widths
    .map(width => `${getImageUrl(path, { width, quality: 80 })} ${width}w`)
    .join(', ');
};

/**
 * 사용자 프로필 이미지 URL 가져오기
 * @param {string} userId - 사용자 ID
 * @param {string} size - 이미지 크기 (small, medium, large)
 * @returns {string} 프로필 이미지 URL
 */
export const getProfileImageUrl = (userId, size = 'medium') => {
  if (!userId) return getImageUrl('default-profile.jpg', sizeMap[size] || sizeMap.medium);
  
  return getOptimizedImageUrl(`/users/${userId}/profile.jpg`, size);
};

/**
 * 제품 이미지 URL 가져오기
 * @param {string} productId - 제품 ID
 * @param {number} index - 이미지 인덱스 (0: 대표 이미지)
 * @param {string} size - 이미지 크기 (small, medium, large)
 * @returns {string} 제품 이미지 URL
 */
export const getProductImageUrl = (productId, index = 0, size = 'medium') => {
  if (!productId) return getImageUrl('default-product.jpg');
  
  return getOptimizedImageUrl(`/products/${productId}/image-${index}.jpg`, size);
}; 