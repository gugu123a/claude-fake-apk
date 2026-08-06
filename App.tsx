import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  AppState,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import ChatMessage from './src/components/ChatMessage';
import ChatInput from './src/components/ChatInput';
import EmptyState from './src/components/EmptyState';
import ThinkingIndicator from './src/components/ThinkingIndicator';
import { streamChat } from './src/services/deepseek';
import type { Message } from './src/types/chat';
import { colors, fontFamily, fontSize } from './src/constants/theme';

let idCounter = 0;
function nextId() {
  return `msg_${Date.now()}_${++idCounter}`;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    AnthropicSans: require('./assets/fonts/AnthropicSans-Roman.ttf'),
    AnthropicSansItalic: require('./assets/fonts/AnthropicSans-Italic.ttf'),
    AnthropicSerif: require('./assets/fonts/AnthropicSerif-Roman.ttf'),
    AnthropicSerifItalic: require('./assets/fonts/AnthropicSerif-Italic.ttf'),
    AnthropicMono: require('./assets/fonts/AnthropicMono-Roman.ttf'),
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const streamingIdRef = useRef<string | null>(null);
  const cancelRef = useRef<(() => void) | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, []);

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages, scrollToBottom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelRef.current?.();
  }, []);

  // Cancel on app backgrounding (HyperOS may kill network)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background' && isLoading) {
        cancelRef.current?.();
        cancelRef.current = null;
      }
    });
    return () => sub.remove();
  }, [isLoading]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
      </View>
    );
  }

  const handleSend = (text: string) => {
    if (isLoading || !text.trim()) return;

    const userMsg: Message = {
      id: nextId(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };

    const streamId = nextId();
    streamingIdRef.current = streamId;

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Add a placeholder message for the streaming response
    setMessages((prev) => [
      ...prev,
      { id: streamId, role: 'assistant', content: '', timestamp: Date.now() },
    ]);

    const cancel = streamChat(
      [...messages, userMsg],
      {
        onContent: (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamId ? { ...m, content: m.content + chunk } : m
            )
          );
        },
        onReasoning: (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamId
                ? { ...m, reasoning: (m.reasoning || '') + chunk }
                : m
            )
          );
        },
        onDone: (content, reasoning) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamId
                ? {
                    ...m,
                    id: nextId(),
                    content,
                    reasoning: reasoning || undefined,
                  }
                : m
            )
          );
          streamingIdRef.current = null;
          setIsLoading(false);
        },
        onError: (err) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamId
                ? {
                    ...m,
                    id: nextId(),
                    content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
                  }
                : m
            )
          );
          streamingIdRef.current = null;
          setIsLoading(false);
        },
      }
    );

    cancelRef.current = cancel;
  };

  const isStreaming = (id: string) => id === streamingIdRef.current;

  const renderItem = ({ item }: { item: Message }) => {
    if (item.role === 'assistant' && item.content === '' && isLoading && isStreaming(item.id)) {
      // This is the streaming placeholder - show thinking indicator
      return <ThinkingIndicator />;
    }
    return (
      <ChatMessage
        message={item}
        isStreaming={isLoading && isStreaming(item.id)}
      />
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return <EmptyState />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'android' ? undefined : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Claude</Text>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          style={styles.list}
          contentContainerStyle={
            messages.length === 0 ? styles.listEmpty : styles.listContent
          }
          onContentSizeChange={scrollToBottom}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  flex: {
    flex: 1,
  },
  header: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.canvas,
  },
  headerTitle: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.title,
    fontWeight: '300',
    color: colors.ink,
    letterSpacing: -0.3,
  },
  list: {
    flex: 1,
  },
  listEmpty: {
    flexGrow: 1,
  },
  listContent: {
    paddingTop: 24,
    paddingBottom: 8,
  },
});
