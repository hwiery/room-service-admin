import React, { useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import { getImageUrl, getImageSrcSet } from '../utils/cdn';

/**
 * 최적화된 이미지 컴포넌트
 * - CDN 활용 (운영환경에서 자동 전환)
 * - 지연 로딩 (Lazy loading)
 * - 반응형 이미지 (srcset)
 * - 이미지 로딩 상태 표시
 * - 이미지 로딩 오류 처리
 * - alt 속성 필수
 */
const OptimizedImage = ({
  src,
  alt,
  width = '100%',
  height = 200,
  size = 'medium',
  objectFit = 'cover',
  quality,
  fallbackSrc = '/images/placeholder.svg',
  withSrcSet = false,
  sx = {},
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // CDN URL 생성
  const cdnSrc = getImageUrl(src, {
    width: typeof width === 'number' ? width : undefined,
    height: typeof height === 'number' ? height : undefined,
    quality
  });

  // 오류 발생시 사용할 대체 이미지 URL
  const cdnFallbackSrc = getImageUrl(fallbackSrc);

  // 반응형 이미지를 위한 srcset 생성
  const srcSet = withSrcSet ? getImageSrcSet(src) : undefined;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <Box position="relative" width={width} height={height} {...props}>
      {isLoading && (
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          animation="wave"
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      <Box
        component="img"
        src={error ? cdnFallbackSrc : cdnSrc}
        srcSet={!error && srcSet}
        sizes={withSrcSet ? "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        sx={{
          width: '100%',
          height: '100%',
          objectFit,
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s',
          ...sx,
        }}
      />
    </Box>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  size: PropTypes.oneOf(['thumbnail', 'small', 'medium', 'large']),
  objectFit: PropTypes.string,
  quality: PropTypes.number,
  fallbackSrc: PropTypes.string,
  withSrcSet: PropTypes.bool,
  sx: PropTypes.object,
};

export default OptimizedImage; 