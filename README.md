# 📞 Contact Service API

> Node.js + Express + SQLite 기반의 RESTful 연락처 관리 시스템

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](LICENSE)

## ✨ 주요 기능

- 🔍 **연락처 검색**: 이름 기반 검색 기능
- 📄 **페이징**: 효율적인 대량 데이터 처리
- 📸 **이미지 업로드**: Multer 기반 사진 업로드
- 🛡️ **보안**: SQL 인젝션 방지 필터
- 📚 **API 문서**: 내장된 Swagger UI 콘솔
- 🧪 **테스트 모드**: 지연 응답 테스트 엔드포인트

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 14.0.0 이상
- npm 6.0.0 이상

### 설치 및 실행
```bash
# 저장소 클론
git clone <repository-url>
cd contactsvc

# 종속성 설치
npm install

# 서버 시작
npm start
```

서버가 시작되면 `http://localhost:3000`에서 접근 가능합니다.

## 📋 API 엔드포인트

### 📖 기본 CRUD 작업

| Method | Endpoint | 설명 | 페이징 | 파라미터 |
|--------|----------|------|--------|----------|
| `GET` | `/contacts` | 연락처 목록 조회 | ✅ | `pageno`, `pagesize` |
| `GET` | `/contacts/:no` | 특정 연락처 조회 | ❌ | `no` (경로) |
| `POST` | `/contacts` | 새 연락처 추가 | ❌ | `name`, `tel`, `address` |
| `PUT` | `/contacts/:no` | 연락처 정보 수정 | ❌ | `no`, `name`, `tel`, `address` |
| `DELETE` | `/contacts/:no` | 연락처 삭제 | ❌ | `no` (경로) |

### 🔍 검색 및 특수 기능

| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/contacts/search/:name` | 이름으로 연락처 검색 (2글자 이상) |
| `POST` | `/contacts/batchinsert` | 여러 연락처 일괄 추가 |
| `POST` | `/contacts/:no/photo` | 연락처 사진 업로드 |

### 🧪 테스트 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/contacts_long` | 1초 지연 후 목록 조회 |
| `GET` | `/contacts_long/search/:name` | 1초 지연 후 검색 |

## 📊 데이터 구조

### Contact 스키마
```json
{
  "no": "1234567890123",      // 고유번호 (타임스탬프)
  "name": "홍길동",           // 이름
  "tel": "010-1234-5678",     // 전화번호
  "address": "서울시",        // 주소
  "photo": "profile.jpg"      // 사진 파일명
}
```

### 응답 형식

#### 성공 응답
```json
{
  "status": "success",
  "message": "작업 완료",
  "no": 1234567890123
}
```

#### 목록 조회 응답
```json
{
  "pageno": 1,
  "pagesize": 5,
  "totalcount": 100,
  "contacts": [...]
}
```

#### 오류 응답
```json
{
  "status": "fail",
  "message": "오류 메시지"
}
```

## 🏗️ 프로젝트 구조

```
contactsvc/
├── 📄 index.js              # Express 서버 진입점
├── 📄 routes.js             # API 라우팅 로직
├── 📄 contactdao.js         # 데이터베이스 접근 계층
├── 📄 contacts.db           # SQLite 데이터베이스 파일
├── 📁 views/                # EJS 템플릿
│   └── index.ejs           # API 문서 페이지
├── 📁 public/              # 정적 파일
│   ├── 📁 photos/          # 업로드된 사진
│   ├── 📁 console/         # Swagger UI
│   ├── swagger.json        # API 명세서
│   └── ...                # CSS, JS, 이미지
└── 📁 temp_photom/         # 임시 사진 저장소
```

## 🛠️ 기술 스택

### 백엔드
- **Node.js**: JavaScript 런타임
- **Express**: 웹 프레임워크
- **SQLite3**: 경량 데이터베이스

### 미들웨어 & 유틸리티
- **body-parser**: 요청 본문 파싱
- **cors**: CORS 처리
- **multer**: 파일 업로드 처리
- **ejs**: 템플릿 엔진
- **sleep-promise**: 테스트용 지연

### 프런트엔드 (문서화)
- **Bootstrap**: UI 프레임워크
- **Font Awesome**: 아이콘
- **Swagger UI**: API 문서화

## 🔧 설정

### 환경 변수
- `PORT`: 서버 포트 (기본값: 3000)

### 데이터베이스
- **파일**: `contacts.db` (자동 생성)
- **테이블**: `contacts` (자동 생성)
- **초기 데이터**: 100개 샘플 연락처 (자동 생성)

## 🛡️ 보안 기능

- ✅ SQL 인젝션 방지 필터
- ✅ CORS 설정
- ✅ 입력 데이터 검증
- ✅ 캐시 제어 헤더

## 📖 API 문서

서버 실행 후 다음 경로에서 API 문서를 확인할 수 있습니다:

- **웹 문서**: `http://localhost:3000/`
- **Swagger UI**: `http://localhost:3000/console/`

## 🧪 테스트

### API 테스트 예시

```bash
# 전체 연락처 조회
curl -X GET "http://localhost:3000/contacts"

# 페이징된 연락처 조회
curl -X GET "http://localhost:3000/contacts?pageno=1&pagesize=10"

# 특정 연락처 조회
curl -X GET "http://localhost:3000/contacts/1234567890123"

# 연락처 추가
curl -X POST "http://localhost:3000/contacts" \
  -H "Content-Type: application/json" \
  -d '{"name":"김철수","tel":"010-1234-5678","address":"부산시"}'

# 이름으로 검색
curl -X GET "http://localhost:3000/contacts/search/김"
```

## 🤝 기여하기

1. 저장소를 Fork 합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📝 라이선스

이 프로젝트는 ISC 라이선스 하에 배포됩니다.

## 👤 작성자

**stepanowon**
- Email: stepanowon@hotmail.com
- GitHub: [@stepanowon](https://github.com/stepanowon)

---

<p align="center">Made with ❤️ for learning Node.js & RESTful APIs</p>
