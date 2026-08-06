import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, fontSize, spacing } from '../constants/theme';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>C</Text>
      </View>
      <Text style={styles.title}>How can I help you today?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconText: {
    fontFamily: fontFamily.serif,
    fontSize: 22,
    fontWeight: '300',
    color: colors.coral,
    lineHeight: 26,
  },
  title: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.heading,
    fontWeight: '300',
    color: colors.muted,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
});
