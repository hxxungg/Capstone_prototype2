import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius, shadow } from '../components/theme';

const { width } = Dimensions.get('window');

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
  onPress: () => void;
}

function FeatureCard({ icon, title, description, bgColor, onPress }: FeatureCardProps) {
  return (
    <TouchableOpacity style={[styles.featureCard, shadow.md]} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.featureIcon, { backgroundColor: bgColor }]}>
        <Text style={styles.featureIconText}>{icon}</Text>
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

interface StatBadgeProps {
  label: string;
  value: string;
  color: string;
}

function StatBadge({ label, value, color }: StatBadgeProps) {
  return (
    <View style={[styles.statBadge, { borderColor: color + '33', backgroundColor: color + '11' }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>안녕하세요! 👋</Text>
            <Text style={styles.subtitle}>오늘도 경제 공부 해볼까요?</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>초보</Text>
            <Text style={styles.levelIcon}>🌱</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatBadge label="오늘 퀴즈" value="0/10" color={colors.primary} />
          <StatBadge label="연속 학습" value="0일" color={colors.secondary} />
          <StatBadge label="예측 정확도" value="0%" color={colors.accent} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 학습 메뉴</Text>

        <FeatureCard
          icon="📈"
          title="주식 차트 예측 게임"
          description="차트를 보고 상승/하락을 예측해보세요"
          bgColor="#6366f111"
          onPress={() => navigation.navigate('StockGame')}
        />
        <FeatureCard
          icon="📰"
          title="경제 뉴스 모아보기"
          description="오늘의 주요 경제 뉴스를 한눈에"
          bgColor="#10b98111"
          onPress={() => navigation.navigate('News')}
        />
        <FeatureCard
          icon="🎯"
          title="경제 퀴즈"
          description="뉴스 기반 퀴즈로 경제 지식 테스트"
          bgColor="#f59e0b11"
          onPress={() => navigation.navigate('Quiz')}
        />
        <FeatureCard
          icon="🤖"
          title="AI 경제 챗봇"
          description="궁금한 경제 용어를 바로 질문하세요"
          bgColor="#ef444411"
          onPress={() => navigation.navigate('Chatbot')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 오늘의 경제 한마디</Text>
        <View style={[styles.tipCard, shadow.sm]}>
          <Text style={styles.tipQuote}>"</Text>
          <Text style={styles.tipText}>
            주식 투자의 핵심은 좋은 기업을 찾아 오래 기다리는 것입니다. 단기적 가격 변동에 흔들리지 마세요.
          </Text>
          <Text style={styles.tipAuthor}>— 워런 버핏</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 오늘의 주요 지표</Text>
        <View style={[styles.marketCard, shadow.sm]}>
          <MarketItem label="KOSPI" value="2,728.31" change="+1.2%" up />
          <View style={styles.divider} />
          <MarketItem label="NASDAQ" value="18,045.12" change="+0.8%" up />
          <View style={styles.divider} />
          <MarketItem label="달러/원" value="1,342.5" change="-3.2" up={false} />
          <View style={styles.divider} />
          <MarketItem label="비트코인" value="$71,250" change="+2.4%" up />
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function MarketItem({ label, value, change, up }: { label: string; value: string; change: string; up: boolean }) {
  return (
    <View style={styles.marketItem}>
      <Text style={styles.marketLabel}>{label}</Text>
      <View style={styles.marketRight}>
        <Text style={styles.marketValue}>{value}</Text>
        <Text style={[styles.marketChange, { color: up ? colors.upColor : colors.downColor }]}>{change}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.8)',
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  levelIcon: {
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statBadge: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.white,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIconText: {
    fontSize: 26,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: 22,
    color: colors.textMuted,
    fontWeight: '300',
  },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  tipQuote: {
    fontSize: 40,
    color: colors.primary,
    lineHeight: 40,
    marginBottom: -8,
    fontFamily: 'serif',
  },
  tipText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  tipAuthor: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'right',
  },
  marketCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  marketLabel: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  marketRight: {
    alignItems: 'flex-end',
  },
  marketValue: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '600',
  },
  marketChange: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
