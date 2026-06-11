# 🔖 Bookmark Dashboard (북마크 대시보드)

프로젝트와 북마크를 효율적으로 관리하고 탐색할 수 있는 반응형 웹 애플리케이션입니다. Firebase Authentication 및 Firestore와 TanStack React Query v5를 연동하여 안전하고 빠른 데이터 동기화를 제공합니다.

---

## 🛠 기술 스택 (Tech Stack)

| 영역              | 기술 스택                             |
| :---------------- | :------------------------------------ |
| **Core**          | React 19, TypeScript, Vite 6          |
| **Styling**       | Tailwind CSS v4, Lucide React (Icons) |
| **State**         | Zustand 5                             |
| **Data Fetching** | TanStack React Query v5               |
| **Backend**       | Firebase Auth, Cloud Firestore        |
| **Code Quality**  | Prettier                              |

---

## 📂 프로젝트 구조 및 컨벤션 (Directory Structure & Conventions)

이 프로젝트는 **TeamSystem UI 컨벤션 및 폴더 구조** 표준을 엄격히 준수하여 설계되었습니다.

```text
src/
├── App.tsx             # 라우터 및 글로벌 공급자(React Query) 정의
├── index.css           # Tailwind CSS v4 글로벌 스타일 및 @theme 정의
├── main.tsx            # 엔트리 포인트
├── vite-env.d.ts       # Vite 클라이언트 타입 정의
├── model/
│   └── model.ts        # 데이터 모델 인터페이스 정의 (Project, Bookmark)
├── utils/
│   └── firebase.ts     # Firebase 초기화 및 Firestore 공통 에러 핸들러
└── pages/              # 서비스 페이지 단위 폴더
    ├── login/          # 로그인 페이지
    │   ├── _action/    # 클라이언트 Action 엘리먼트 ('use client')
    │   ├── _area/      # 로그인 영역 레이아웃 컴포넌트
    │   ├── index.tsx   # 로그인 페이지 메인 Entry
    │   └── state.ts    # 로그인 페이지 Zustand Store
    └── main/           # 북마크 대시보드 메인 페이지
        ├── _action/    # Element 기반 Action 컴포넌트
        ├── _area/      # 물리적/기능적 영역 단위 컴포넌트 (Header, Dashboard)
        ├── _component/ # 재사용 가능한 하위 컴포넌트 (ProjectCard)
        ├── _lib/       # Firestore 단일 연동 API 함수 (1파일 1함수 원칙)
        ├── index.tsx   # 메인 페이지 메인 Entry (Suspense 연동)
        └── state.ts    # 메인 페이지 Zustand Store
```

### 💡 주요 컨벤션 가이드라인

1. **Element 기반 Action 컴포넌트 (`_action/`)**:
   - 이벤트 처리 및 logic/HTML Element 렌더링을 담당하는 컴포넌트입니다.
   - 항상 파일 최상단에 `'use client'` 지시어가 선언되어 있으며, 파일명 끝에 `[Name].action.tsx` 접미사를 사용합니다.
   - `Select`, `Text`, `Click`, `Read`의 4가지 유형으로 성격을 명확히 구분하여 네이밍합니다.
2. **영역 컴포넌트 (`_area/`)**:
   - 물리적 레이아웃 또는 다른 대단위 기능을 묶는 영역 컴포넌트입니다. `'use client'`를 포함하지 않으며 구조와 배치 역할만 담당합니다.
3. **단일 API 파일 분리 (`_lib/`)**:
   - Firestore 통신 함수들을 하나의 파일로 통합하여 관리하지 않고, 기능 단위로 개별 파일로 분리합니다. (예: `getProjects.ts`, `getBookmarks.ts`)
4. **Zustand Store (`state.ts`)**:
   - 컴포넌트의 depth와 관계없는 글로벌 상태를 Zustand 스토어로 페이지 단위에서 선언합니다. 스토어 사용 시 최적화를 위해 `useShallow`를 활용합니다.

---

## ✨ 핵심 아키텍처 및 구현 (Core Architecture)

### 1. TanStack React Query v5 & React Suspense 연동

- **초기 로드 전용 Suspense**: 첫 진입 시에만 로딩 그라디언트 화면을 보여주어 사용자 경험을 매끄럽게 합니다.
- **업데이트 시 Suspense 전파 방지**: 프로젝트나 북마크를 생성, 수정, 삭제하는 과정에서는 화면이 로딩 상태로 깜빡이지 않도록 `placeholderData: keepPreviousData` 및 `startTransition` 설정을 적절히 조화하여 UI의 연속성을 보장합니다.

### 2. Firestore API 연동을 위한 함수형 설계

- **Query & Mutation**: 쿼리는 `QueryFunction` 타입, 생성/삭제/수정은 `MutationFunction` 타입의 시그니처로 구성하여 단일 인자 구조를 정규화하였습니다.

---

## 🚀 실행 및 실행 방법 (How to Run)

### 1. 환경 변수 설정

프로젝트 루트 폴더에 `.env` 파일을 만들고 아래 Firebase 설정을 입력합니다:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. 패키지 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 코드 스타일 포맷팅
npm run format

# 3. 로컬 개발 서버 시작 (Port: 3000)
npm run dev

# 4. 프로덕션 빌드 및 검증
npm run build
```
