import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { stockChallenges, StockChallenge } from '../data/stockData';
import { colors, spacing, fontSize, borderRadius, shadow } from '../components/theme';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - spacing.lg * 2 - 8;

type GameState = 'playing' | 'revealed';

export default function StockGameScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [userPrediction, setUserPrediction] = useState<'up' | 'down' | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const challenge: StockChallenge = stockChallenges[currentIndex];

  const showRevealAnimation = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handlePredict = (prediction: 'up' | 'down') => {
    setUserPrediction(prediction);
    setGameState('revealed');
    const isCorrect = prediction === challenge.trend;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    showRevealAnimation();
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % stockChallenges.length;
    setCurrentIndex(nextIndex);
    setGameState('playing');
    setUserPrediction(null);
  };

  const chartData = gameState === 'revealed'
    ? [...challenge.historicalData, ...challenge.futureData]
    : challenge.historicalData;

  const allPrices = chartData.map(d => d.price);
  const displayData = {
    labels: chartData.filter((_, i) => i % 4 === 0).map(d => d.date),
    datasets: [
      {
        data: chartData.map(d => d.price),
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 2.5,
      },
    ],
  };

  const revealData = gameState === 'revealed' ? {
    labels: challenge.futureData.map(d => d.date),
    datasets: [
      {
        data: challenge.futureData.map(d => d.price),
        color: (opacity = 1) => challenge.trend === 'up'
          ? `rgba(239, 68, 68, ${opacity})`
          : `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  } : null;

  const isCorrect = userPrediction === challenge.trend;
  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  const lastHistoricalPrice = challenge.historicalData[challenge.historicalData.length - 1].price;
  const lastFuturePrice = challenge.futureData[challenge.futureData.length - 1].price;
  const actualChangePercent = ((lastFuturePrice - lastHistoricalPrice) / lastHistoricalPrice * 100).toFixed(1);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.stockSymbol}>{challenge.symbol}</Text>
            <Text style={styles.stockName}>{challenge.name}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>{score.correct}/{score.total}</Text>
            <Text style={styles.scoreLabel}>{accuracy}% 정확도</Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          {stockChallenges.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i === currentIndex && styles.progressDotActive,
                i < currentIndex && styles.progressDotDone,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.chartContainer}>
        {gameState === 'playing' && (
          <View style={styles.hiddenZone}>
            <Text style={styles.hiddenText}>? ? ?</Text>
          </View>
        )}

        <Text style={styles.chartTitle}>
          {gameState === 'playing' ? '📊 과거 주가 데이터 (최근 20일)' : '📊 실제 결과 공개'}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={displayData}
            width={Math.max(CHART_WIDTH, chartData.length * 22)}
            height={200}
            chartConfig={{
              backgroundColor: colors.surface,
              backgroundGradientFrom: colors.surface,
              backgroundGradientTo: colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: '3',
                strokeWidth: '1',
                stroke: colors.primary,
              },
              propsForBackgroundLines: {
                strokeDasharray: '3,3',
                stroke: colors.border,
                strokeWidth: 1,
              },
            }}
            bezier
            style={styles.chart}
            withInnerLines
            withOuterLines={false}
            withVerticalLabels
            withHorizontalLabels
          />
        </ScrollView>

        {gameState === 'revealed' && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={[
              styles.resultBanner,
              { backgroundColor: challenge.trend === 'up' ? colors.upColor + '15' : colors.downColor + '15' }
            ]}>
              <Text style={styles.resultIcon}>
                {challenge.trend === 'up' ? '📈' : '📉'}
              </Text>
              <View>
                <Text style={[
                  styles.resultTrend,
                  { color: challenge.trend === 'up' ? colors.upColor : colors.downColor }
                ]}>
                  {challenge.trend === 'up' ? '상승' : '하락'} {Math.abs(Number(actualChangePercent))}%
                </Text>
                <Text style={styles.resultSubtext}>실제 5일 후 변화율</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </View>

      {gameState === 'playing' ? (
        <View style={styles.predictionSection}>
          <Text style={styles.predictionTitle}>이 주식, 앞으로 어떻게 될까요?</Text>
          <Text style={styles.predictionSubtitle}>5일 후 주가를 예측해보세요</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.predictBtn, styles.upBtn]}
              onPress={() => handlePredict('up')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnIcon}>📈</Text>
              <Text style={styles.btnLabel}>상승</Text>
              <Text style={styles.btnSubLabel}>더 오를 것 같아요</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.predictBtn, styles.downBtn]}
              onPress={() => handlePredict('down')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnIcon}>📉</Text>
              <Text style={styles.btnLabel}>하락</Text>
              <Text style={styles.btnSubLabel}>내릴 것 같아요</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Animated.View style={[styles.resultSection, { opacity: fadeAnim }]}>
          <View style={[
            styles.correctBanner,
            { backgroundColor: isCorrect ? colors.secondary + '15' : colors.danger + '15' }
          ]}>
            <Text style={styles.correctIcon}>{isCorrect ? '🎉' : '😅'}</Text>
            <Text style={[
              styles.correctText,
              { color: isCorrect ? colors.secondary : colors.danger }
            ]}>
              {isCorrect ? '정답!' : '틀렸어요'}
            </Text>
            <Text style={styles.correctSub}>
              {isCorrect ? '훌륭한 예측이에요!' : `정답은 ${challenge.trend === 'up' ? '상승' : '하락'}이었어요`}
            </Text>
          </View>

          <View style={[styles.interpretCard, shadow.sm]}>
            <Text style={styles.interpretTitle}>📖 전문가 해석</Text>
            <Text style={styles.interpretText}>{challenge.interpretation}</Text>
          </View>

          <TouchableOpacity style={[styles.nextBtn, shadow.md]} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.nextBtnText}>다음 종목 도전하기 →</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 16,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stockSymbol: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
  },
  stockName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scoreBox: {
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  scoreText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: fontSize.xs,
    color: colors.primary,
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  progressDotDone: {
    backgroundColor: colors.secondary,
  },
  chartContainer: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadow.md,
    overflow: 'hidden',
  },
  hiddenZone: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '30%',
    backgroundColor: colors.background + 'ee',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderTopRightRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  hiddenText: {
    fontSize: fontSize.xxl,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 4,
  },
  chartTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  chart: {
    borderRadius: borderRadius.md,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  resultIcon: {
    fontSize: 28,
  },
  resultTrend: {
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  resultSubtext: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  predictionSection: {
    paddingHorizontal: spacing.lg,
  },
  predictionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  predictionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  predictBtn: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 4,
    ...shadow.md,
  },
  upBtn: {
    backgroundColor: colors.upColor,
  },
  downBtn: {
    backgroundColor: colors.downColor,
  },
  btnIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  btnLabel: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.white,
  },
  btnSubLabel: {
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  resultSection: {
    paddingHorizontal: spacing.lg,
  },
  correctBanner: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.md,
  },
  correctIcon: {
    fontSize: 40,
    marginBottom: 4,
  },
  correctText: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
  },
  correctSub: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  interpretCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  interpretTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  interpretText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
  },
  nextBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  nextBtnText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.white,
  },
});
