import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  LinearProgress,
  Paper,
  Switch,
  Tab,
  TableCell,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import {
  Save as SaveIcon
} from '@mui/icons-material';

// 목업 데이터
const mockSeoData = {
  general: {
    siteName: '숙소 예약 서비스',
    siteDescription: '최고의 숙소 예약 서비스, 특별한 휴가를 위한 최적의 선택',
    separator: ' | ',
    defaultTitle: '숙소 예약 서비스 - 특별한 휴가를 위한 최선의 선택',
    defaultDescription: '전국 각지의 특별한 숙소를 쉽고 빠르게 예약하세요. 호텔, 펜션, 게스트하우스 등 다양한 옵션을 제공합니다.',
    defaultKeywords: '숙소 예약, 호텔, 펜션, 게스트하우스, 여행, 휴가, 숙박'
  },
  social: {
    enableOpenGraph: true,
    ogTitle: '숙소 예약 서비스',
    ogDescription: '전국 각지의 특별한 숙소를 쉽고 빠르게 예약하세요.',
    ogImageUrl: 'https://example.com/images/og-image.jpg',
    enableTwitterCard: true,
    twitterCardType: 'summary_large_image',
    twitterTitle: '숙소 예약 서비스',
    twitterDescription: '전국 각지의 특별한 숙소를 쉽고 빠르게 예약하세요.',
    twitterImageUrl: 'https://example.com/images/twitter-image.jpg'
  },
  robots: {
    generateRobotsTxt: true,
    allowIndexing: true,
    disallowPaths: '/admin/*, /private/*, /checkout/*',
    sitemapUrl: 'https://example.com/sitemap.xml'
  },
  sitemap: {
    generateSitemap: true,
    sitemapChangeFreq: 'weekly',
    sitemapPriority: '0.7',
    excludePaths: '/admin/*, /private/*, /temp/*'
  },
  structured: {
    enableStructuredData: true,
    organizationType: 'LocalBusiness',
    organizationName: '숙소 예약 서비스',
    organizationUrl: 'https://example.com',
    organizationLogo: 'https://example.com/images/logo.png',
    contactType: 'customer service',
    contactPhone: '+82-2-123-4567',
    contactEmail: 'contact@example.com'
  }
};

/**
 * SEO 설정 관리 페이지 컴포넌트
 */
const SeoSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [seoData, setSeoData] = useState({
    general: {},
    social: {},
    robots: {},
    sitemap: {},
    structured: {}
  });

  // API에서 SEO 설정 데이터 가져오기
  useEffect(() => {
    const fetchSeoSettings = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 (백엔드 구현 후 활성화)
        // const response = await systemApi.getSeoSettings();
        // setSeoData(response.data);
        
        // 목업 데이터 사용 (백엔드 구현 전까지)
        setTimeout(() => {
          setSeoData(mockSeoData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('SEO 설정을 가져오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchSeoSettings();
  }, []);

  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 입력 변경 핸들러
  const handleChange = (section, field, value) => {
    setSeoData({
      ...seoData,
      [section]: {
        ...seoData[section],
        [field]: value
      }
    });
  };

  // 스위치 변경 핸들러
  const handleSwitchChange = (section, field, event) => {
    setSeoData({
      ...seoData,
      [section]: {
        ...seoData[section],
        [field]: event.target.checked
      }
    });
  };

  // 설정 저장 핸들러
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      // await systemApi.updateSeoSettings(seoData);
      
      // 임시 로직 (백엔드 구현 전까지)
      setTimeout(() => {
        console.log('SEO 설정 저장 데이터:', seoData);
        alert('SEO 설정이 저장되었습니다.');
        setSaving(false);
      }, 1000);
    } catch (error) {
      console.error('SEO 설정 저장 중 오류 발생:', error);
      alert('SEO 설정 저장 중 오류가 발생했습니다.');
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          SEO 최적화 설정
        </Typography>
        <Typography variant="body1" color="text.secondary">
          검색 엔진 최적화 및 소셜 미디어 설정을 관리합니다.
        </Typography>
      </Box>

      {loading ? (
        <LinearProgress sx={{ mb: 4 }} />
      ) : (
        <>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="기본 설정" />
              <Tab label="소셜 미디어" />
              <Tab label="Robots.txt" />
              <Tab label="사이트맵" />
              <Tab label="구조화 데이터" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* 기본 설정 탭 */}
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>기본 SEO 설정</Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="사이트 이름"
                      value={seoData.general.siteName || ''}
                      onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                      helperText="웹사이트의 이름을 입력하세요."
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="구분자"
                      value={seoData.general.separator || ''}
                      onChange={(e) => handleChange('general', 'separator', e.target.value)}
                      helperText="페이지 제목과 사이트 이름 사이의 구분자 (예: |, -, 등)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="기본 페이지 제목"
                      value={seoData.general.defaultTitle || ''}
                      onChange={(e) => handleChange('general', 'defaultTitle', e.target.value)}
                      helperText="사이트의 기본 제목 태그 내용입니다."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="사이트 설명"
                      value={seoData.general.siteDescription || ''}
                      onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
                      helperText="사이트에 대한 간략한 설명입니다."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="기본 메타 설명"
                      value={seoData.general.defaultDescription || ''}
                      onChange={(e) => handleChange('general', 'defaultDescription', e.target.value)}
                      helperText="사이트의 기본 메타 설명 태그 내용입니다. 150-160자 내로 작성하세요."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="기본 키워드"
                      value={seoData.general.defaultKeywords || ''}
                      onChange={(e) => handleChange('general', 'defaultKeywords', e.target.value)}
                      helperText="쉼표로 구분된 키워드 목록 (예: 호텔, 숙소, 예약)"
                    />
                  </Grid>
                </Grid>
              )}

              {/* 소셜 미디어 탭 */}
              {activeTab === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>소셜 미디어 설정</Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={seoData.social.enableOpenGraph || false}
                          onChange={(e) => handleSwitchChange('social', 'enableOpenGraph', e)}
                        />
                      }
                      label="Open Graph 태그 활성화"
                    />
                    <FormHelperText>
                      Open Graph 태그를 활성화하면 Facebook 등의 소셜 미디어에서 공유 시 콘텐츠가 더 잘 표시됩니다.
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="OG 제목"
                      value={seoData.social.ogTitle || ''}
                      onChange={(e) => handleChange('social', 'ogTitle', e.target.value)}
                      disabled={!seoData.social.enableOpenGraph}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="OG 이미지 URL"
                      value={seoData.social.ogImageUrl || ''}
                      onChange={(e) => handleChange('social', 'ogImageUrl', e.target.value)}
                      disabled={!seoData.social.enableOpenGraph}
                      helperText="1200 x 630 픽셀 크기의 이미지를 권장합니다."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="OG 설명"
                      value={seoData.social.ogDescription || ''}
                      onChange={(e) => handleChange('social', 'ogDescription', e.target.value)}
                      disabled={!seoData.social.enableOpenGraph}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={seoData.social.enableTwitterCard || false}
                          onChange={(e) => handleSwitchChange('social', 'enableTwitterCard', e)}
                        />
                      }
                      label="Twitter Card 태그 활성화"
                    />
                    <FormHelperText>
                      Twitter Card 태그를 활성화하면 트위터에서 공유 시 콘텐츠가 더 잘 표시됩니다.
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth disabled={!seoData.social.enableTwitterCard}>
                      <TextField
                        select
                        label="Twitter Card 유형"
                        value={seoData.social.twitterCardType || 'summary_large_image'}
                        onChange={(e) => handleChange('social', 'twitterCardType', e.target.value)}
                        SelectProps={{
                          native: true
                        }}
                      >
                        <option value="summary">요약형</option>
                        <option value="summary_large_image">큰 이미지 요약형</option>
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Twitter 이미지 URL"
                      value={seoData.social.twitterImageUrl || ''}
                      onChange={(e) => handleChange('social', 'twitterImageUrl', e.target.value)}
                      disabled={!seoData.social.enableTwitterCard}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Twitter 제목"
                      value={seoData.social.twitterTitle || ''}
                      onChange={(e) => handleChange('social', 'twitterTitle', e.target.value)}
                      disabled={!seoData.social.enableTwitterCard}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Twitter 설명"
                      value={seoData.social.twitterDescription || ''}
                      onChange={(e) => handleChange('social', 'twitterDescription', e.target.value)}
                      disabled={!seoData.social.enableTwitterCard}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Robots.txt 탭 */}
              {activeTab === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Robots.txt 설정</Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={seoData.robots.generateRobotsTxt || false}
                          onChange={(e) => handleSwitchChange('robots', 'generateRobotsTxt', e)}
                        />
                      }
                      label="Robots.txt 자동 생성"
                    />
                    <FormHelperText>
                      Robots.txt 파일을 자동으로 생성합니다. 검색 엔진 크롤러의 접근을 제어합니다.
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={seoData.robots.allowIndexing || false}
                          onChange={(e) => handleSwitchChange('robots', 'allowIndexing', e)}
                          disabled={!seoData.robots.generateRobotsTxt}
                        />
                      }
                      label="검색 엔진 색인 허용"
                    />
                    <FormHelperText>
                      검색 엔진이 사이트를 색인화하도록 허용합니다.
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="접근 제한 경로"
                      value={seoData.robots.disallowPaths || ''}
                      onChange={(e) => handleChange('robots', 'disallowPaths', e.target.value)}
                      disabled={!seoData.robots.generateRobotsTxt}
                      helperText="검색 엔진이 접근하지 않도록 할 경로를 입력하세요. 여러 경로는 쉼표로 구분합니다. (예: /admin/*, /private/*)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="사이트맵 URL"
                      value={seoData.robots.sitemapUrl || ''}
                      onChange={(e) => handleChange('robots', 'sitemapUrl', e.target.value)}
                      disabled={!seoData.robots.generateRobotsTxt}
                      helperText="사이트맵의 전체 URL을 입력하세요. (예: https://example.com/sitemap.xml)"
                    />
                  </Grid>
                </Grid>
              )}

              {/* 사이트맵 탭 */}
              {activeTab === 3 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>사이트맵 설정</Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={seoData.sitemap.generateSitemap || false}
                          onChange={(e) => handleSwitchChange('sitemap', 'generateSitemap', e)}
                        />
                      }
                      label="사이트맵 자동 생성"
                    />
                    <FormHelperText>
                      XML 사이트맵을 자동으로 생성합니다. 검색 엔진이 사이트의 페이지를 찾는 데 도움이 됩니다.
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth disabled={!seoData.sitemap.generateSitemap}>
                      <TextField
                        select
                        label="변경 빈도"
                        value={seoData.sitemap.sitemapChangeFreq || 'weekly'}
                        onChange={(e) => handleChange('sitemap', 'sitemapChangeFreq', e.target.value)}
                        SelectProps={{
                          native: true
                        }}
                        helperText="페이지가 얼마나 자주 변경되는지 알려줍니다."
                      >
                        <option value="always">항상</option>
                        <option value="hourly">매시간</option>
                        <option value="daily">매일</option>
                        <option value="weekly">매주</option>
                        <option value="monthly">매월</option>
                        <option value="yearly">매년</option>
                        <option value="never">없음</option>
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="우선순위"
                      type="number"
                      inputProps={{ min: 0, max: 1, step: 0.1 }}
                      value={seoData.sitemap.sitemapPriority || '0.7'}
                      onChange={(e) => handleChange('sitemap', 'sitemapPriority', e.target.value)}
                      disabled={!seoData.sitemap.generateSitemap}
                      helperText="페이지의 중요도를 0.0부터 1.0 사이의 값으로 나타냅니다."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="제외 경로"
                      value={seoData.sitemap.excludePaths || ''}
                      onChange={(e) => handleChange('sitemap', 'excludePaths', e.target.value)}
                      disabled={!seoData.sitemap.generateSitemap}
                      helperText="사이트맵에서 제외할 경로를 입력하세요. 여러 경로는 쉼표로 구분합니다. (예: /admin/*, /private/*)"
                    />
                  </Grid>
                </Grid>
              )}

              {/* 구조화 데이터 탭 */}
              {activeTab === 4 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>구조화 데이터 설정</Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={seoData.structured.enableStructuredData || false}
                          onChange={(e) => handleSwitchChange('structured', 'enableStructuredData', e)}
                        />
                      }
                      label="구조화 데이터 활성화"
                    />
                    <FormHelperText>
                      구조화 데이터(Schema.org)를 활성화하면 검색 결과에 리치 스니펫이 표시될 수 있습니다.
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth disabled={!seoData.structured.enableStructuredData}>
                      <TextField
                        select
                        label="조직 유형"
                        value={seoData.structured.organizationType || 'LocalBusiness'}
                        onChange={(e) => handleChange('structured', 'organizationType', e.target.value)}
                        SelectProps={{
                          native: true
                        }}
                      >
                        <option value="Organization">일반 조직</option>
                        <option value="LocalBusiness">지역 비즈니스</option>
                        <option value="Corporation">기업</option>
                        <option value="Hotel">호텔</option>
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="조직 이름"
                      value={seoData.structured.organizationName || ''}
                      onChange={(e) => handleChange('structured', 'organizationName', e.target.value)}
                      disabled={!seoData.structured.enableStructuredData}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="조직 URL"
                      value={seoData.structured.organizationUrl || ''}
                      onChange={(e) => handleChange('structured', 'organizationUrl', e.target.value)}
                      disabled={!seoData.structured.enableStructuredData}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="조직 로고 URL"
                      value={seoData.structured.organizationLogo || ''}
                      onChange={(e) => handleChange('structured', 'organizationLogo', e.target.value)}
                      disabled={!seoData.structured.enableStructuredData}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth disabled={!seoData.structured.enableStructuredData}>
                      <TextField
                        select
                        label="연락처 유형"
                        value={seoData.structured.contactType || 'customer service'}
                        onChange={(e) => handleChange('structured', 'contactType', e.target.value)}
                        SelectProps={{
                          native: true
                        }}
                      >
                        <option value="customer service">고객 서비스</option>
                        <option value="technical support">기술 지원</option>
                        <option value="billing support">결제 지원</option>
                        <option value="sales">영업</option>
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="연락처 전화번호"
                      value={seoData.structured.contactPhone || ''}
                      onChange={(e) => handleChange('structured', 'contactPhone', e.target.value)}
                      disabled={!seoData.structured.enableStructuredData}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="연락처 이메일"
                      value={seoData.structured.contactEmail || ''}
                      onChange={(e) => handleChange('structured', 'contactEmail', e.target.value)}
                      disabled={!seoData.structured.enableStructuredData}
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              size="large"
            >
              {saving ? '저장 중...' : '설정 저장'}
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default SeoSettings; 