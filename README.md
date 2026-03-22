# 📈 StockEdu - 주식 투자 학습 앱

경제 공부와 주식 투자를 재미있게 배울 수 있는 React Native(Expo) 모바일 앱입니다.

---

## 주요 기능

### 1. 📊 주식 차트 예측 게임
- 실제 주식 데이터 기반의 라인 차트 제공 (AAPL, 삼성전자, TSLA, NAVER, NVDA)
- 미래 구간을 숨긴 채 상승/하락 예측
- 예측 후 실제 결과 공개 + 전문가 해석 제공
- 예측 정확도 및 점수 추적

### 2. 📰 경제 뉴스 모아보기
- 주식, 거시경제, 암호화폐, 부동산, 글로벌 뉴스 카테고리별 필터링
- 뉴스 카드 → 상세 페이지 전환
- 요약 + 본문 + 태그 제공

### 3. 🎯 경제 퀴즈
- 실제 뉴스 기반 10개 문제 (통화정책, 반도체, 암호화폐, 환율 등)
- 즉시 해설 제공
- 등급 시스템 (S/A/B/C)

### 4. 🤖 AI 경제 챗봇
- 경제 용어 질문·답변 (PER, PBR, ROE, 금리, 인플레이션 등)
- 빠른 질문 버튼 제공
- 실시간 타이핑 애니메이션

---

## 실행 방법

### 사전 요구사항
- [Node.js](https://nodejs.org/) 18 이상
- [Expo Go](https://expo.dev/go) 앱 (iOS/Android)

### 설치 및 실행

```bash
# 1. 프로젝트 폴더로 이동
cd StockEdu

# 2. 의존성 설치
npm install

# 3. 앱 시작
npx expo start
```

4. 터미널에 QR 코드가 표시되면:
   - **Android**: Expo Go 앱에서 QR 코드 스캔
   - **iOS**: 카메라 앱으로 QR 코드 스캔

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React Native (Expo) |
| 언어 | TypeScript |
| 네비게이션 | React Navigation (Bottom Tabs + Stack) |
| 차트 | react-native-chart-kit |
| 애니메이션 | React Native Reanimated |
| 스타일 | StyleSheet (커스텀 테마) |

---

## 프로젝트 구조

```
StockEdu/
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx     # 네비게이션 설정
│   ├── screens/
│   │   ├── HomeScreen.tsx       # 홈 화면
│   │   ├── StockGameScreen.tsx  # 주식 차트 게임
│   │   ├── NewsScreen.tsx       # 경제 뉴스
│   │   ├── QuizScreen.tsx       # 경제 퀴즈
│   │   └── ChatbotScreen.tsx    # 챗봇
│   ├── components/
│   │   └── theme.ts             # 디자인 시스템 (색상, 간격, 폰트)
│   └── data/
│       ├── stockData.ts         # 주식 목 데이터 + 해석
│       ├── newsData.ts          # 경제 뉴스 목 데이터
│       ├── quizData.ts          # 퀴즈 문제 + 해설
│       └── chatbotData.ts       # 챗봇 응답 데이터
├── App.tsx                      # 앱 진입점
├── babel.config.js
└── app.json
```

---

## 향후 개선 계획

- [ ] 실제 주식 API 연동 (Alpha Vantage, Yahoo Finance)
- [ ] 실제 뉴스 API 연동 (네이버 뉴스, RSS)
- [ ] 사용자 계정 및 학습 기록 저장
- [ ] GPT 기반 실제 AI 챗봇 연동
- [ ] 포트폴리오 시뮬레이션 기능
- [ ] 소셜 기능 (친구 랭킹, 예측 공유)
