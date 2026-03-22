import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { quizQuestions } from '../data/quizData';
import { colors, spacing, fontSize, borderRadius, shadow } from '../components/theme';

const { width } = Dimensions.get('window');

type QuizState = 'start' | 'playing' | 'answered' | 'finished';

export default function QuizScreen() {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const question = quizQuestions[currentIndex];
  const totalQuestions = quizQuestions.length;
  const correctCount = answers.filter(Boolean).length;

  const difficultyColors: Record<string, string> = {
    easy: colors.secondary,
    medium: colors.accent,
    hard: colors.danger,
  };

  const difficultyLabels: Record<string, string> = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
  };

  const startQuiz = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setQuizState('playing');
  };

  const handleAnswer = (optionIndex: number) => {
    if (quizState !== 'playing') return;
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === question.correctIndex;
    setAnswers(prev => [...prev, isCorrect]);
    setQuizState('answered');
  };

  const handleNext = () => {
    fadeAnim.setValue(0);
    if (currentIndex + 1 >= totalQuestions) {
      setQuizState('finished');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setQuizState('playing');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const getOptionStyle = (index: number) => {
    if (quizState !== 'answered') return styles.optionDefault;
    if (index === question.correctIndex) return styles.optionCorrect;
    if (index === selectedOption && index !== question.correctIndex) return styles.optionWrong;
    return styles.optionDefault;
  };

  const getOptionTextStyle = (index: number) => {
    if (quizState !== 'answered') return styles.optionText;
    if (index === question.correctIndex) return styles.optionTextCorrect;
    if (index === selectedOption && index !== question.correctIndex) return styles.optionTextWrong;
    return styles.optionText;
  };

  const getScoreGrade = () => {
    const pct = (correctCount / totalQuestions) * 100;
    if (pct >= 90) return { grade: 'S', emoji: '🏆', message: '완벽해요! 경제 고수!', color: '#f59e0b' };
    if (pct >= 70) return { grade: 'A', emoji: '🥇', message: '훌륭해요! 대단합니다!', color: colors.secondary };
    if (pct >= 50) return { grade: 'B', emoji: '🥈', message: '잘 하고 있어요!', color: colors.primary };
    return { grade: 'C', emoji: '📚', message: '더 공부해봐요!', color: colors.accent };
  };

  if (quizState === 'start') {
    return (
      <View style={styles.container}>
        <View style={styles.startContainer}>
          <Text style={styles.startEmoji}>🎯</Text>
          <Text style={styles.startTitle}>경제 퀴즈</Text>
          <Text style={styles.startDesc}>
            실제 경제 뉴스를 기반으로 한{'\n'}
            {totalQuestions}개의 문제를 풀어보세요!
          </Text>

          <View style={styles.infoCards}>
            <View style={[styles.infoCard, { backgroundColor: colors.secondary + '15' }]}>
              <Text style={styles.infoIcon}>📰</Text>
              <Text style={styles.infoLabel}>뉴스 기반</Text>
              <Text style={styles.infoValue}>실전 문제</Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.primary + '15' }]}>
              <Text style={styles.infoIcon}>📝</Text>
              <Text style={styles.infoLabel}>총 문항</Text>
              <Text style={styles.infoValue}>{totalQuestions}문제</Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.accent + '15' }]}>
              <Text style={styles.infoIcon}>💡</Text>
              <Text style={styles.infoLabel}>해설 제공</Text>
              <Text style={styles.infoValue}>즉시 확인</Text>
            </View>
          </View>

          <View style={styles.categoryPreview}>
            <Text style={styles.categoryPreviewTitle}>포함 카테고리</Text>
            <View style={styles.categoryChips}>
              {['통화정책', '반도체', '암호화폐', '부동산', '주식시장', '환율'].map(cat => (
                <View key={cat} style={styles.categoryChip}>
                  <Text style={styles.categoryChipText}>{cat}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity style={[styles.startBtn, shadow.md]} onPress={startQuiz} activeOpacity={0.85}>
            <Text style={styles.startBtnText}>퀴즈 시작하기 🚀</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (quizState === 'finished') {
    const grade = getScoreGrade();
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.finishedContainer}>
        <Text style={styles.finishedEmoji}>{grade.emoji}</Text>
        <Text style={[styles.gradeText, { color: grade.color }]}>{grade.grade}등급</Text>
        <Text style={styles.gradeMessage}>{grade.message}</Text>

        <View style={[styles.scoreCircle, { borderColor: grade.color }]}>
          <Text style={[styles.scoreNum, { color: grade.color }]}>{correctCount}</Text>
          <Text style={styles.scoreDivider}>─────</Text>
          <Text style={styles.scoreTotal}>{totalQuestions}</Text>
        </View>

        <View style={styles.answerReview}>
          <Text style={styles.reviewTitle}>문제별 결과</Text>
          {quizQuestions.map((q, i) => (
            <View key={q.id} style={styles.reviewItem}>
              <Text style={[
                styles.reviewIcon,
                { color: answers[i] ? colors.secondary : colors.danger }
              ]}>
                {answers[i] ? '✓' : '✗'}
              </Text>
              <Text style={styles.reviewQuestion} numberOfLines={1}>{q.question}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[styles.startBtn, shadow.md]} onPress={startQuiz} activeOpacity={0.85}>
          <Text style={styles.startBtnText}>다시 도전하기 🔄</Text>
        </TouchableOpacity>
        <View style={{ height: 32 }} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.quizHeader}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentIndex) / totalQuestions) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentIndex + 1} / {totalQuestions}</Text>
      </View>

      <ScrollView style={styles.quizContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.questionCard}>
            <View style={styles.questionMeta}>
              <View style={[
                styles.difficultyBadge,
                { backgroundColor: difficultyColors[question.difficulty] + '20' }
              ]}>
                <Text style={[
                  styles.difficultyText,
                  { color: difficultyColors[question.difficulty] }
                ]}>
                  {difficultyLabels[question.difficulty]}
                </Text>
              </View>
              <Text style={styles.categoryTag}>{question.category}</Text>
            </View>

            <Text style={styles.questionText}>{question.question}</Text>
          </View>

          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.optionBtn, getOptionStyle(index)]}
                onPress={() => handleAnswer(index)}
                disabled={quizState === 'answered'}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.optionNumber,
                  quizState === 'answered' && index === question.correctIndex && styles.optionNumberCorrect,
                  quizState === 'answered' && index === selectedOption && index !== question.correctIndex && styles.optionNumberWrong,
                ]}>
                  <Text style={styles.optionNumberText}>
                    {['①', '②', '③', '④'][index]}
                  </Text>
                </View>
                <Text style={getOptionTextStyle(index)}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {quizState === 'answered' && (
            <Animated.View style={[styles.explanationCard, shadow.sm]}>
              <View style={styles.explanationHeader}>
                <Text style={[
                  styles.explanationResult,
                  { color: selectedOption === question.correctIndex ? colors.secondary : colors.danger }
                ]}>
                  {selectedOption === question.correctIndex ? '🎉 정답!' : '❌ 오답'}
                </Text>
                <Text style={styles.explanationTitle}>📖 해설</Text>
              </View>
              <Text style={styles.explanationText}>{question.explanation}</Text>

              <TouchableOpacity style={[styles.nextBtn, shadow.md]} onPress={handleNext}>
                <Text style={styles.nextBtnText}>
                  {currentIndex + 1 >= totalQuestions ? '결과 보기 🏁' : '다음 문제 →'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  startContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: 32,
  },
  startEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  startTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  startDesc: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  infoCards: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
    width: '100%',
  },
  infoCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  categoryPreview: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  categoryPreviewTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  categoryChip: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 48,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  startBtnText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.white,
  },
  quizHeader: {
    backgroundColor: colors.surface,
    paddingTop: 16,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  quizContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  difficultyText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  categoryTag: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  questionText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    ...shadow.sm,
  },
  optionDefault: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionCorrect: {
    backgroundColor: colors.secondary + '15',
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  optionWrong: {
    backgroundColor: colors.danger + '15',
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  optionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionNumberCorrect: {
    backgroundColor: colors.secondary,
  },
  optionNumberWrong: {
    backgroundColor: colors.danger,
  },
  optionNumberText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  optionText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  optionTextCorrect: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.secondary,
    fontWeight: '600',
    lineHeight: 22,
  },
  optionTextWrong: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.danger,
    fontWeight: '600',
    lineHeight: 22,
  },
  explanationCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  explanationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  explanationResult: {
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  explanationTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  explanationText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  nextBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.white,
  },
  finishedContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  finishedEmoji: {
    fontSize: 72,
    marginBottom: spacing.md,
  },
  gradeText: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  gradeMessage: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
    ...shadow.md,
  },
  scoreNum: {
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 52,
  },
  scoreDivider: {
    color: colors.border,
    fontSize: fontSize.xs,
    lineHeight: 12,
    marginVertical: -4,
  },
  scoreTotal: {
    fontSize: fontSize.xxl,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  answerReview: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    ...shadow.sm,
  },
  reviewTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  reviewIcon: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    width: 24,
  },
  reviewQuestion: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
