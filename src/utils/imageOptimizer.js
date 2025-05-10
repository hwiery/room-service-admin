/**
 * 이미지 최적화 유틸리티 함수들
 * 이미지 리사이징, 압축 및 포맷 변환 기능 제공
 */

/**
 * 이미지 리사이징 및 압축
 * 
 * @param {File} file - 압축할 이미지 파일
 * @param {Object} options - 압축 옵션
 * @param {number} options.maxWidth - 최대 너비 (픽셀 단위)
 * @param {number} options.maxHeight - 최대 높이 (픽셀 단위)
 * @param {number} options.quality - 이미지 품질 (0-1)
 * @param {string} options.format - 출력 형식 ('jpeg', 'png', 'webp')
 * @returns {Promise<Blob>} - 압축된 이미지 Blob
 */
export const optimizeImage = (file, options = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    format = 'webp'
  } = options;

  return new Promise((resolve, reject) => {
    // 파일을 URL로 변환
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      // URL 객체 해제
      URL.revokeObjectURL(url);
      
      // 이미지 크기 계산
      let width = img.width;
      let height = img.height;
      
      // 이미지 크기가 최대 크기를 초과하면 비율에 맞게 조정
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      
      // 캔버스 생성 및 이미지 그리기
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // 이미지 출력 형식 결정
      let mimeType;
      switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          mimeType = 'image/jpeg';
          break;
        case 'png':
          mimeType = 'image/png';
          break;
        case 'webp':
          mimeType = 'image/webp';
          break;
        default:
          mimeType = 'image/jpeg';
      }
      
      // 압축된 이미지 생성
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('이미지 압축 실패'));
          }
        },
        mimeType,
        quality
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지 로드 실패'));
    };
    
    // 이미지 로드
    img.src = url;
  });
};

/**
 * 이미지 미리보기 URL 생성
 * 
 * @param {Blob} blob - 이미지 Blob
 * @returns {string} - 미리보기 URL
 */
export const createPreviewUrl = (blob) => {
  return URL.createObjectURL(blob);
};

/**
 * 여러 이미지 파일을 최적화
 * 
 * @param {FileList} files - 이미지 파일 목록
 * @param {Object} options - 최적화 옵션
 * @returns {Promise<Array<{blob: Blob, file: File, url: string}>>} - 최적화된 이미지 배열
 */
export const optimizeMultipleImages = async (files, options = {}) => {
  const optimizedImages = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      continue;
    }
    
    try {
      // 이미지 최적화
      const blob = await optimizeImage(file, options);
      
      // 원본 파일과 동일한 이름의 새 파일 생성
      const fileName = file.name.replace(/\.[^/.]+$/, '') + '.' + (options.format || 'webp');
      const optimizedFile = new File([blob], fileName, { type: blob.type });
      
      // 미리보기 URL 생성
      const url = createPreviewUrl(blob);
      
      optimizedImages.push({
        blob,
        file: optimizedFile,
        url,
        name: fileName
      });
    } catch (error) {
      console.error(`이미지 '${file.name}' 최적화 실패:`, error);
    }
  }
  
  return optimizedImages;
};

/**
 * 이미지 파일 크기를 포맷팅 (KB, MB)
 * 
 * @param {number} bytes - 바이트 단위 크기
 * @returns {string} - 포맷팅된 크기
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
};

// 안전한 리소스 해제를 위한 URL 객체 해제 함수
export const revokeObjectURL = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

export default {
  optimizeImage,
  optimizeMultipleImages,
  createPreviewUrl,
  formatFileSize,
  revokeObjectURL
}; 