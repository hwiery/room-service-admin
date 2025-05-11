/**
 * CDN 설정
 * 
 * 이 파일은 애플리케이션의 CDN 설정을 관리합니다.
 * 환경별로 다른 설정을 적용할 수 있습니다.
 */

// 환경 설정
const config = {
  development: {
    enabled: false,
    baseUrl: 'http://localhost:3000',
    imagePrefix: '/images',
    staticPrefix: '/static',
    defaultQuality: 85,
    providers: {
      image: 'local',
      static: 'local'
    }
  },
  test: {
    enabled: true,
    baseUrl: 'https://test-cdn.roomservice.com',
    imagePrefix: '/images',
    staticPrefix: '/static',
    defaultQuality: 85,
    providers: {
      image: 'cloudinary',
      static: 'cloudflare'
    }
  },
  production: {
    enabled: true,
    baseUrl: 'https://cdn.roomservice.com',
    imagePrefix: '/images',
    staticPrefix: '/static',
    defaultQuality: 85,
    providers: {
      image: 'cloudinary',
      static: 'cloudflare'
    }
  }
};

// CDN 제공자별 설정
const providerConfig = {
  cloudinary: {
    cloudName: 'your-cloud-name',
    apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
    transformations: {
      thumbnail: 'c_thumb,g_face,w_100,h_100,q_70',
      small: 'w_300,h_300,c_fill,q_80',
      medium: 'w_600,h_600,c_fill,q_80',
      large: 'w_1200,h_1200,c_fill,q_85'
    }
  },
  cloudflare: {
    zoneId: 'your-zone-id',
    options: {
      cacheEverything: true,
      cacheTtl: 86400
    }
  },
  local: {
    // 로컬 개발 환경 설정
  }
};

// 현재 환경 감지
const currentEnv = process.env.NODE_ENV || 'development';

// 현재 환경에 맞는 설정 내보내기
export const cdnConfig = config[currentEnv] || config.development;

// CDN 제공자 설정 내보내기
export const providers = providerConfig;

// 현재 설정된 CDN 제공자 내보내기
export const currentProviders = {
  image: providerConfig[cdnConfig.providers.image],
  static: providerConfig[cdnConfig.providers.static]
};

export default cdnConfig; 