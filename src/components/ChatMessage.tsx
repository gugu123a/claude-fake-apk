import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, fontSize, spacing, borderRadius } from '../constants/theme';
import type { Message } from '../types/chat';

type Props = {
  message: Message;
  isStreaming?: boolean;
};

export default function ChatMessage({ message, isStreaming }: Props) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAI]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>C</Text>
        </View>
      )}

      <View style={styles.bubbleGroup}>
        {/* Reasoning / thinking section */}
        {message.reasoning && !isUser && (
          <View style={styles.reasoningContainer}>
            <Text style={styles.reasoningLabel}>Claude thinking</Text>
            <Text style={styles.reasoningText} numberOfLines={8}>
              {message.reasoning}
            </Text>
          </View>
        )}

        {/* Main content */}
        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleAI,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.messageTextUser : styles.messageTextAI,
            ]}
          >
            {message.content}
            {isStreaming && (
              <Text style={styles.cursor}>▊</Text>
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAI: {
    justifyContent: 'flex-start',
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  avatarText: {
    fontFamily: fontFamily.serif,
    fontSize: 14,
    color: colors.coral,
    fontWeight: '400',
  },

  bubbleGroup: {
    maxWidth: '82%',
  },

  bubble: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  bubbleUser: {
    backgroundColor: colors.ink,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.sm,
  },
  bubbleAI: {
    backgroundColor: colors.surfaceCard,
    borderTopLeftRadius: borderRadius.sm,
    borderTopRightRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },

  messageText: {
    fontSize: fontSize.body,
    lineHeight: 24,
  },
  messageTextUser: {
    fontFamily: fontFamily.sans,
    color: colors.white,
  },
  messageTextAI: {
    fontFamily: fontFamily.serif,
    color: colors.ink,
  },

  cursor: {
    fontFamily: fontFamily.sans,
    color: colors.coral,
    opacity: 0.7,
    fontSize: 16,
  },

  reasoningContainer: {
    backgroundColor: colors.canvas,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: colors.mutedLight,
  },
  reasoningLabel: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.caption,
    color: colors.muted,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  reasoningText: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.bodySm,
    color: colors.muted,
    lineHeight: 20,
  },
});
