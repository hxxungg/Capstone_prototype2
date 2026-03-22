export interface QuizQuestion {
  id: string;
  newsId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    newsId: '1',
    question: 'FOMC(연방공개시장위원회)의 주요 역할은 무엇인가요?',
    options: [
      '미국 증시 상장 기업 감독',
      '미국의 통화정책(금리) 결정',
      '미국 정부 예산안 심의',
      '달러 환율 직접 통제',
    ],
    correctIndex: 1,
    explanation:
      'FOMC는 미국 연방준비제도(Fed)의 핵심 기구로, 미국의 기준금리를 결정합니다. 금리를 올리면 대출 비용이 증가해 경기를 식히고 인플레이션을 억제하며, 금리를 내리면 경기를 부양하는 효과가 있습니다.',
    difficulty: 'easy',
    category: '통화정책',
  },
  {
    id: 'q2',
    newsId: '1',
    question: "Fed가 목표로 하는 인플레이션율(물가상승률)은 얼마인가요?",
    options: ['0%', '1%', '2%', '5%'],
    correctIndex: 2,
    explanation:
      '미국 연준(Fed)을 비롯한 대부분의 중앙은행은 연간 2% 인플레이션을 목표로 합니다. 너무 낮으면 디플레이션(물가 하락) 위험이 있고, 너무 높으면 화폐 가치가 급격히 떨어지기 때문입니다.',
    difficulty: 'easy',
    category: '통화정책',
  },
  {
    id: 'q3',
    newsId: '2',
    question: 'HBM(고대역폭 메모리)이 일반 DRAM보다 유리한 점은?',
    options: [
      '저장 용량이 훨씬 크다',
      '데이터 전송 속도(대역폭)가 매우 높다',
      '전력 소비가 훨씬 많다',
      '제조 비용이 더 저렴하다',
    ],
    correctIndex: 1,
    explanation:
      'HBM은 여러 DRAM 칩을 수직으로 쌓아 넓은 데이터 통로(대역폭)를 구현합니다. AI·그래픽 작업에서는 대용량 데이터를 빠르게 처리하는 것이 핵심인데, HBM은 일반 GDDR 메모리보다 수배 높은 대역폭을 제공합니다.',
    difficulty: 'medium',
    category: '반도체',
  },
  {
    id: 'q4',
    newsId: '3',
    question: '비트코인 "반감기(Halving)"란 무엇을 의미하나요?',
    options: [
      '비트코인 가격이 절반으로 떨어지는 현상',
      '채굴 보상이 절반으로 줄어드는 이벤트',
      '비트코인 거래 수수료가 절반이 되는 것',
      '비트코인 총 발행량이 줄어드는 것',
    ],
    correctIndex: 1,
    explanation:
      '비트코인 반감기는 약 4년마다 채굴자에게 주어지는 보상(블록 보상)이 절반으로 줄어드는 이벤트입니다. 공급 감소로 인해 수요가 유지될 경우 가격 상승 압력이 생길 수 있어, 역사적으로 반감기 이후 비트코인 가격이 크게 상승한 사례가 많습니다.',
    difficulty: 'medium',
    category: '암호화폐',
  },
  {
    id: 'q5',
    newsId: '4',
    question: '부동산 투자에서 "레버리지(Leverage)"를 활용한다는 것은?',
    options: [
      '부동산 가격 하락 시 매도하는 전략',
      '대출을 이용해 자기자본 이상의 투자를 하는 것',
      '여러 부동산에 분산 투자하는 것',
      '임대 수익을 재투자하는 것',
    ],
    correctIndex: 1,
    explanation:
      '레버리지는 대출 등 타인의 자본을 활용해 자신의 투자 규모를 키우는 전략입니다. 예를 들어 자기자본 3억원으로 7억원의 대출을 받아 10억원 아파트를 사면, 아파트 가격이 10% 오를 때 자기자본 기준으로는 33%의 수익을 낼 수 있습니다. 단, 가격이 하락하면 손실도 확대됩니다.',
    difficulty: 'medium',
    category: '부동산',
  },
  {
    id: 'q6',
    newsId: '5',
    question: "중국의 경기 부양책에서 '바우처 지급'이 기대하는 경제 효과는?",
    options: [
      '수출 증가',
      '내수 소비 진작',
      '인플레이션 억제',
      '부동산 공급 확대',
    ],
    correctIndex: 1,
    explanation:
      '소비 바우처(쿠폰)는 국민들이 특정 품목이나 서비스를 구매할 때 할인을 제공하는 방식입니다. 이를 통해 소비 심리를 자극하고 내수 소비를 늘려 경기를 활성화하려는 목적입니다. 케인즈 경제학에서 말하는 "정부 지출을 통한 경기 부양"의 한 형태입니다.',
    difficulty: 'easy',
    category: '거시경제',
  },
  {
    id: 'q7',
    newsId: '6',
    question: '주식 시장에서 "외국인 순매수"가 주가에 미치는 일반적인 영향은?',
    options: [
      '주가 하락 요인',
      '주가 상승 요인',
      '환율 하락 요인',
      '금리 상승 요인',
    ],
    correctIndex: 1,
    explanation:
      '외국인 투자자들이 국내 주식을 순매수(매수 > 매도)하면 주식 수요가 증가해 주가 상승 압력이 생깁니다. 또한 외국인이 국내 주식을 사기 위해 외화를 원화로 바꾸므로 원화 가치가 상승(환율 하락)하는 부수 효과도 있습니다.',
    difficulty: 'easy',
    category: '주식시장',
  },
  {
    id: 'q8',
    newsId: '7',
    question: '기업의 주가수익비율(PER)이 높다는 것은 무엇을 의미하나요?',
    options: [
      '기업의 이익이 매우 높다',
      '주가가 이익 대비 고평가되어 있다',
      '배당금을 많이 준다',
      '부채비율이 낮다',
    ],
    correctIndex: 1,
    explanation:
      'PER(주가수익비율) = 주가 ÷ 주당순이익(EPS)입니다. PER이 높다는 것은 현재 이익에 비해 주가가 비싸다는 뜻입니다. 성장성이 높은 기업은 높은 PER이 정당화될 수 있지만, 거품(버블) 가능성도 함께 고려해야 합니다.',
    difficulty: 'medium',
    category: '주식분석',
  },
  {
    id: 'q9',
    newsId: '8',
    question: '원달러 환율 하락(원화 강세)이 국내 수출 기업에 미치는 영향은?',
    options: [
      '수출 경쟁력 상승',
      '원화 환산 수출 매출 감소',
      '수입 원자재 비용 증가',
      '해외 투자 수익 증가',
    ],
    correctIndex: 1,
    explanation:
      '수출 기업들은 해외에서 달러로 매출을 올린 후 이를 원화로 환전합니다. 원화 강세(환율 하락) 시 같은 달러 매출도 원화로 환산하면 적어집니다. 예를 들어 1달러의 환율이 1,400원→1,300원으로 떨어지면 100만 달러 매출이 14억원→13억원으로 줄어드는 효과가 있습니다.',
    difficulty: 'medium',
    category: '환율',
  },
  {
    id: 'q10',
    newsId: '1',
    question: "경제학에서 '연착륙(Soft Landing)'이란?",
    options: [
      '주식시장이 서서히 하락하는 것',
      '경기 과열을 진정시키면서도 경기침체를 피하는 것',
      '부동산 가격이 천천히 하락하는 것',
      '환율이 완만하게 변동하는 것',
    ],
    correctIndex: 1,
    explanation:
      '연착륙은 비행기가 부드럽게 착륙하는 것에서 따온 경제 용어로, 중앙은행이 금리를 올려 인플레이션을 잡으면서도 경기침체(실업 급증, 마이너스 성장)를 피하는 이상적인 시나리오를 말합니다. 반대로 경기침체가 발생하는 경우는 "경착륙(Hard Landing)"이라고 합니다.',
    difficulty: 'easy',
    category: '거시경제',
  },
];
