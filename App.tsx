import { useRef, type ComponentRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { BlurTargetView, BlurView } from 'expo-blur';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const COLORS = ['#e63946', '#f4a261', '#2a9d8f', '#264653', '#8338ec', '#ff006e', '#3a86ff', '#06d6a0'];

/**
 * A frosted header over scrolling content that grows with the scroll, like a bar that
 * grows behind controls docking under it. It is blurred with
 * `blurMethod="dimezisBlurViewSdk31Plus"`, which should not blur below Android 12
 * (API 31). Its height follows the scroll on the UI thread (Reanimated).
 */
export default function App() {
  const target = useRef<ComponentRef<typeof View>>(null);
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const headerHeight = useAnimatedStyle(() => ({ height: 120 + Math.min(200, Math.max(0, scrollY.value / 2)) }));

  return (
    <View style={styles.root}>
      <BlurTargetView ref={target} style={StyleSheet.absoluteFill}>
        <Animated.ScrollView contentContainerStyle={styles.content} onScroll={onScroll} scrollEventThrottle={16}>
          {Array.from({ length: 60 }, (_, i) => (
            <View key={i} style={[styles.row, { backgroundColor: COLORS[i % COLORS.length] }]}>
              <Text style={styles.rowText}>Row {i + 1}</Text>
            </View>
          ))}
        </Animated.ScrollView>
      </BlurTargetView>
      <AnimatedBlurView
        blurTarget={target}
        blurMethod="dimezisBlurViewSdk31Plus"
        intensity={60}
        tint="light"
        style={[styles.header, headerHeight]}
      >
        <Text style={styles.title}>Android API {String(Platform.Version)}</Text>
        <Text style={styles.subtitle}>blurMethod: dimezisBlurViewSdk31Plus</Text>
      </AnimatedBlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  content: { paddingTop: 140, paddingHorizontal: 16, gap: 12, paddingBottom: 40 },
  row: { height: 72, borderRadius: 12, justifyContent: 'center', paddingHorizontal: 16 },
  rowText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  header: { position: 'absolute', top: 0, left: 0, right: 0, justifyContent: 'flex-end', padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14 },
});
