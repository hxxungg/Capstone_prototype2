import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { chatbotResponses, defaultResponse } from '../data/chatbotData';
import { colors, spacing, fontSize, borderRadius, shadow } from '../components/theme';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const QUICK_TOPICS = [
  { label: '주식이란?', query: '주식이란' },
  { label: 'PER 설명', query: 'PER이란' },
  { label: '금리 영향', query: '금리란' },
  { label: 'ETF란?', query: 'ETF란' },
  { label: '분산투자', query: '분산투자란' },
  { label: '인플레이션', query: '인플레이션이란' },
];

function getBotResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const item of chatbotResponses) {
    if (item.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return item.response;
    }
  }
  return defaultResponse;
}

function formatBotMessage(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <Text key={i} style={styles.boldText}>
          {line.slice(2, -2)}{'\n'}
        </Text>
      );
    }
    if (line.includes('**')) {
      const parts = line.split('**');
      return (
        <Text key={i}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <Text key={j} style={styles.boldText}>{part}</Text>
              : <Text key={j}>{part}</Text>
          )}
          {'\n'}
        </Text>
      );
    }
    return <Text key={i}>{line}{i < lines.length - 1 ? '\n' : ''}</Text>;
  });
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: '안녕하세요! 👋 저는 경제 학습 도우미 챗봇이에요.\n\n궁금한 경제 용어나 투자 개념을 물어보세요!\n\n아래 빠른 질문 버튼을 눌러도 됩니다.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponseText = getBotResponse(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  const formatTime = (date: Date) =>
    `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <View style={styles.botAvatar}>
          <Text style={styles.botAvatarText}>🤖</Text>
        </View>
        <View>
          <Text style={styles.botName}>경제 학습 챗봇</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>온라인</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.chatArea}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.messageRow,
              msg.isUser ? styles.userRow : styles.botRow,
            ]}
          >
            {!msg.isUser && (
              <View style={styles.botAvatarSmall}>
                <Text style={styles.botAvatarSmallText}>🤖</Text>
              </View>
            )}
            <View style={[
              styles.bubble,
              msg.isUser ? styles.userBubble : styles.botBubble,
            ]}>
              <Text style={msg.isUser ? styles.userBubbleText : styles.botBubbleText}>
                {msg.isUser ? msg.text : formatBotMessage(msg.text)}
              </Text>
              <Text style={[
                styles.timestamp,
                msg.isUser ? styles.timestampUser : styles.timestampBot,
              ]}>
                {formatTime(msg.timestamp)}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageRow, styles.botRow]}>
            <View style={styles.botAvatarSmall}>
              <Text style={styles.botAvatarSmallText}>🤖</Text>
            </View>
            <View style={[styles.bubble, styles.botBubble, styles.typingBubble]}>
              <Text style={styles.typingText}>● ● ●</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.quickTopics}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {QUICK_TOPICS.map(topic => (
            <TouchableOpacity
              key={topic.label}
              style={styles.quickBtn}
              onPress={() => sendMessage(topic.query)}
              activeOpacity={0.8}
            >
              <Text style={styles.quickBtnText}>{topic.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="경제 용어나 개념을 물어보세요..."
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={200}
          onSubmitEditing={() => sendMessage(inputText)}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim()}
          activeOpacity={0.85}
        >
          <Text style={styles.sendBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    alignItems: 'center',
    gap: spacing.md,
  },
  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botAvatarText: {
    fontSize: 24,
  },
  botName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  statusText: {
    fontSize: fontSize.xs,
    color: colors.secondary,
    fontWeight: '500',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginBottom: 4,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  botAvatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  botAvatarSmallText: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadow.sm,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  typingBubble: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  userBubbleText: {
    fontSize: fontSize.md,
    color: colors.white,
    lineHeight: 22,
  },
  botBubbleText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: '700',
    color: colors.primary,
  },
  typingText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    letterSpacing: 3,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  timestampUser: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
  },
  timestampBot: {
    color: colors.textMuted,
  },
  quickTopics: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quickBtn: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  quickBtnText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
    color: colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow.sm,
  },
  sendBtnDisabled: {
    backgroundColor: colors.border,
  },
  sendBtnText: {
    fontSize: fontSize.xl,
    color: colors.white,
    fontWeight: '700',
    lineHeight: 26,
  },
});
