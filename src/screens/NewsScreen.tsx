import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { newsItems, categoryLabels, categoryColors, NewsItem } from '../data/newsData';
import { colors, spacing, fontSize, borderRadius, shadow } from '../components/theme';

export default function NewsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const categories = ['all', 'stock', 'macro', 'crypto', 'real-estate', 'global'];

  const filteredNews = selectedCategory === 'all'
    ? newsItems
    : newsItems.filter(n => n.category === selectedCategory);

  const categoryEmojis: Record<string, string> = {
    all: '🌐',
    stock: '📈',
    macro: '🏛️',
    crypto: '₿',
    'real-estate': '🏠',
    global: '🌍',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>경제 뉴스</Text>
        <Text style={styles.headerDate}>2026년 3월 22일</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              selectedCategory === cat && {
                backgroundColor: categoryColors[cat] || colors.primary,
              },
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={styles.categoryEmoji}>{categoryEmojis[cat]}</Text>
            <Text style={[
              styles.categoryLabel,
              selectedCategory === cat && styles.categoryLabelActive,
            ]}>
              {categoryLabels[cat]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.newsList} showsVerticalScrollIndicator={false}>
        {filteredNews.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.newsCard, shadow.sm]}
            onPress={() => setSelectedNews(item)}
            activeOpacity={0.85}
          >
            <View style={styles.newsCardTop}>
              <View style={[
                styles.categoryBadge,
                { backgroundColor: (categoryColors[item.category] || colors.primary) + '18' }
              ]}>
                <Text style={[
                  styles.categoryBadgeText,
                  { color: categoryColors[item.category] || colors.primary }
                ]}>
                  {categoryEmojis[item.category]} {categoryLabels[item.category]}
                </Text>
              </View>
              <Text style={styles.newsDate}>{item.date}</Text>
            </View>

            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsSummary} numberOfLines={2}>{item.summary}</Text>

            <View style={styles.newsFooter}>
              <Text style={styles.newsSource}>📌 {item.source}</Text>
              <View style={styles.tagsRow}>
                {item.tags.slice(0, 2).map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal
        visible={selectedNews !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedNews(null)}
      >
        {selectedNews && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedNews(null)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
              <View style={[
                styles.modalCategoryBadge,
                { backgroundColor: (categoryColors[selectedNews.category] || colors.primary) + '18' }
              ]}>
                <Text style={[
                  styles.categoryBadgeText,
                  { color: categoryColors[selectedNews.category] || colors.primary }
                ]}>
                  {categoryEmojis[selectedNews.category]} {categoryLabels[selectedNews.category]}
                </Text>
              </View>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{selectedNews.title}</Text>
              <View style={styles.modalMeta}>
                <Text style={styles.modalSource}>📌 {selectedNews.source}</Text>
                <Text style={styles.modalDate}>{selectedNews.date}</Text>
              </View>

              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>요약</Text>
                <Text style={styles.summaryText}>{selectedNews.summary}</Text>
              </View>

              <Text style={styles.modalContent}>{selectedNews.content}</Text>

              <View style={styles.modalTagsRow}>
                {selectedNews.tags.map(tag => (
                  <View key={tag} style={styles.modalTag}>
                    <Text style={styles.modalTagText}>#{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={{ height: 48 }} />
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
  },
  headerDate: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  categoryScroll: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    maxHeight: 56,
  },
  categoryContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    alignItems: 'center',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryEmoji: {
    fontSize: 14,
  },
  categoryLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: colors.white,
    fontWeight: '700',
  },
  newsList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  newsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  newsCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  categoryBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  newsDate: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  newsTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  newsSummary: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsSource: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  tag: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modalCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  modalScroll: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 32,
    marginBottom: spacing.md,
  },
  modalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  modalSource: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modalDate: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  summaryBox: {
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  modalContent: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 26,
    marginBottom: spacing.lg,
  },
  modalTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  modalTag: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTagText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
