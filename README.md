# Rolki z ogłoszeń

한국어로 만든 중고차 매물 숏폼 제작기입니다. 사진을 업로드하고 차량 정보를 입력한 뒤, 게시물 형식과 스타일을 고르면 브라우저에서 세로형 영상과 다른 화면 비율의 WebM 결과물을 생성하고 미리 보고 내려받을 수 있습니다.

## 사용 방법

1. [Rolki z ogłoszeń 열기](https://bobaekimboae.github.io/rolki-z-ogloszen/)
2. 매물 주소를 붙여넣거나 사진을 직접 올립니다.
3. 차량 정보, 영상 형식, 스토리 버전, 글꼴, 색상, 배경 음악을 선택합니다.
4. 요약 화면에서 제작을 시작하고 미리보기 또는 다운로드를 선택합니다.

## 실제 동작 범위

- JPG, PNG, WebP 사진 최대 40장 업로드, 순서 변경 및 삭제
- 차량 정보와 판매자 이름 입력
- 세로형, 피드형, 와이드 형식 다중 선택 및 스토리 버전 생성
- 글꼴, 포인트 색상, 배경 음악 선택
- Canvas와 MediaRecorder를 사용한 브라우저 내 WebM 생성, 재생 및 다운로드
- 외부 매물 링크는 현재 주소 형식만 확인합니다. 다른 사이트의 매물 사진과 차량 정보를 자동 수집하는 기능은 사이트별 API/백엔드 연동이 필요합니다.
- MP4 인코딩과 AI 음성 해설은 이 정적 브라우저 앱에 포함되어 있지 않습니다.

## 로컬 실행

```bash
npm ci
npm run dev
```

빌드 및 테스트:

```bash
npm run build
npm run test:sites
```

GitHub Pages는 `main`에 변경 사항을 올리면 GitHub Actions가 빌드 후 배포합니다. Vite의 base 경로는 `/rolki-z-ogloszen/`입니다.

