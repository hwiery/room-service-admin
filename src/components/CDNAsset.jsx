import React from 'react';
import PropTypes from 'prop-types';
import { getStaticUrl } from '../utils/cdn';

/**
 * CDN에서 정적 자원을 로드하는 컴포넌트
 * - CSS, JavaScript, 폰트 등의 정적 파일을 CDN에서 제공
 * - 개발/운영 환경에 따라 자동 전환
 */
const CDNAsset = ({ path, type, attributes = {}, ...props }) => {
  const assetUrl = getStaticUrl(path);
  
  // 타입에 따라 다른 엘리먼트 렌더링
  switch (type) {
    case 'script':
      return <script src={assetUrl} {...attributes} {...props} />;
      
    case 'style':
      return <link rel="stylesheet" href={assetUrl} {...attributes} {...props} />;
      
    case 'font':
      return (
        <link
          rel="preload"
          href={assetUrl}
          as="font"
          crossOrigin="anonymous"
          {...attributes}
          {...props}
        />
      );
      
    case 'image':
      return <img src={assetUrl} alt={attributes.alt || ''} {...attributes} {...props} />;
      
    case 'video':
      return <video src={assetUrl} {...attributes} {...props} />;
      
    case 'audio':
      return <audio src={assetUrl} {...attributes} {...props} />;
      
    case 'link':
      return (
        <a href={assetUrl} {...attributes} {...props}>
          {props.children || assetUrl}
        </a>
      );
      
    default:
      console.warn(`CDNAsset: Unknown asset type: ${type}`);
      return null;
  }
};

CDNAsset.propTypes = {
  path: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['script', 'style', 'font', 'image', 'video', 'audio', 'link']).isRequired,
  attributes: PropTypes.object,
};

export default CDNAsset; 