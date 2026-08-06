import { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { colors, fontFamily, fontSize, spacing, borderRadius } from '../constants/theme';

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const canSend = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Message Claude…"
          placeholderTextColor={colors.muted}
          value={text}
          onChangeText={setText}
          onKeyPress={(e) => {
            if (e.nativeEvent.key === 'Enter' && !disabled) {
              handleSend();
            }
          }}
          multiline
          maxLength={10000}
          autoFocus={false}
          returnKeyType="send"
          editable={!disabled}
        />
        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          <Text style={[styles.sendIcon, !canSend && styles.sendIconDisabled]}>
            →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.canvas,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.sans,
    fontSize: fontSize.body,
    color: colors.ink,
    maxHeight: 120,
    paddingVertical: spacing.sm,
    lineHeight: 22,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.coral,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.coralDisabled,
  },
  sendIcon: {
    fontSize: 18,
    color: colors.white,
    lineHeight: 20,
  },
  sendIconDisabled: {
    color: colors.mutedLight,
  },
});
