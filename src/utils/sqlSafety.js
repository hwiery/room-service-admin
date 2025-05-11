/**
 * SQL 인젝션 방어 유틸리티
 * 
 * 이 모듈은 SQL 인젝션 공격을 방지하기 위한 유틸리티 함수를 제공합니다.
 * 프론트엔드에서 SQL 쿼리를 직접 작성하는 경우는 드물지만,
 * API 요청 파라미터를 검증하는 등의 용도로 사용할 수 있습니다.
 */

/**
 * SQL 인젝션 취약점이 있는 문자열 패턴 감지
 * @param {string} input - 검사할 문자열
 * @returns {boolean} 안전한 문자열 여부 (true: 안전함, false: 위험함)
 */
export const isSqlSafe = (input) => {
  if (!input || typeof input !== 'string') return true;
  
  // SQL 인젝션 공격에 자주 사용되는 패턴 목록
  const suspiciousPatterns = [
    /'\s*OR\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/i,  // ' OR '1'='1
    /'\s*OR\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?/i,   // ' OR 'a'='a
    /'\s*OR\s+['"]?1['"]?\s*=\s*['"]?1['"]?/i,       // ' OR 1=1
    /'\s*OR\s*['"]?true['"]?/i,                     // ' OR true
    /UNION\s+ALL\s+SELECT/i,                        // UNION ALL SELECT
    /UNION\s+SELECT/i,                              // UNION SELECT
    /SELECT\s+@@version/i,                          // SELECT @@version
    /INSERT\s+INTO/i,                               // INSERT INTO
    /UPDATE\s+\w+\s+SET/i,                          // UPDATE table SET
    /DELETE\s+FROM/i,                               // DELETE FROM
    /DROP\s+TABLE/i,                                // DROP TABLE
    /TRUNCATE\s+TABLE/i,                            // TRUNCATE TABLE
    /ALTER\s+TABLE/i,                               // ALTER TABLE
    /EXEC\s*\(/i,                                   // EXEC(
    /EXECUTE\s*\(/i,                                // EXECUTE(
    /DECLARE\s+@/i,                                 // DECLARE @
    /WAITFOR\s+DELAY/i,                             // WAITFOR DELAY
    /;\s*SELECT/i,                                  // ; SELECT
    /--/,                                           // --
    /\/\*/,                                         // /*
    /xp_cmdshell/i                                  // xp_cmdshell
  ];
  
  // 패턴 검사
  return !suspiciousPatterns.some(pattern => pattern.test(input));
};

/**
 * SQL 안전 파라미터 생성
 * @param {Object} params - 원본 파라미터 객체
 * @returns {Object} 안전한 파라미터 객체 (위험한 내용 제거)
 */
export const sanitizeSqlParams = (params) => {
  if (!params || typeof params !== 'object') return {};
  
  const sanitized = {};
  
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      
      if (typeof value === 'string') {
        // 문자열인 경우 위험한 패턴 제거
        sanitized[key] = sanitizeSqlString(value);
      } else if (Array.isArray(value)) {
        // 배열인 경우 각 항목 검사
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? sanitizeSqlString(item) : item
        );
      } else {
        // 그 외의 경우 그대로 사용
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
};

/**
 * 문자열의 SQL 인젝션 취약점 제거
 * @param {string} input - 원본 문자열
 * @returns {string} 안전한 문자열
 */
export const sanitizeSqlString = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    // SQL 주석 제거
    .replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '')
    // 세미콜론 이후 코드 제거
    .replace(/;.*/g, '')
    // SQL 특수 키워드 중간에 공백 삽입하여 무효화
    .replace(/\bUNION\b/gi, 'UNI ON')
    .replace(/\bSELECT\b/gi, 'SEL ECT')
    .replace(/\bINSERT\b/gi, 'INS ERT')
    .replace(/\bUPDATE\b/gi, 'UPD ATE')
    .replace(/\bDELETE\b/gi, 'DEL ETE')
    .replace(/\bDROP\b/gi, 'DR OP')
    .replace(/\bTRUNCATE\b/gi, 'TRUNC ATE')
    .replace(/\bEXEC\b/gi, 'EX EC')
    .trim();
};

/**
 * API 요청 파라미터를 SQL 안전하게 변환
 * @param {Object} requestData - API 요청 데이터
 * @returns {Object} SQL 안전한 요청 데이터
 */
export const prepareSafeApiRequest = (requestData) => {
  if (!requestData) return {};
  
  // 객체 깊은 복사
  const safeData = JSON.parse(JSON.stringify(requestData));
  
  // 민감한 키워드 확인 (실제 프로젝트에 맞게 조정 필요)
  const sensitiveKeys = [
    'query', 'filter', 'sql', 'command', 'search', 'conditions'
  ];
  
  // 민감한 필드가 있는지 확인하고 처리
  for (const key in safeData) {
    if (safeData.hasOwnProperty(key)) {
      // 민감한 키인 경우 특별히 검사
      if (sensitiveKeys.includes(key.toLowerCase()) && typeof safeData[key] === 'string') {
        // SQL 안전 처리
        safeData[key] = sanitizeSqlString(safeData[key]);
      } 
      // 객체나 배열인 경우 재귀적으로 처리
      else if (typeof safeData[key] === 'object' && safeData[key] !== null) {
        safeData[key] = prepareSafeApiRequest(safeData[key]);
      }
    }
  }
  
  return safeData;
}; 