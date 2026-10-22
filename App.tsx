import { useRef, type ComponentRef } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BlurTargetView, BlurView } from 'expo-blur';

const COLORS = ['#e63946', '#f4a261', '#2a9d8f', '#264653', '#8338ec', '#ff006e', '#3a86ff', '#06d6a0'];

/**
 * A header over scrolling content, blurred with `blurMethod="dimezisBlurViewSdk31Plus"`.
 * That method should only blur on Android 12 (API 31) and newer. Below API 31 the
 * header should just show its tint.
 */
export default function App() {
  const target = useRef<ComponentRef<typeof View>>(null);
  return (
    <View style={styles.root}>
      <BlurTargetView ref={target} style={StyleSheet.absoluteFill}>
        <ScrollView contentContainerStyle={styles.content}>
          {Array.from({ length: 40 }, (_, i) => (
            <View key={i} style={[styles.row, { backgroundColor: COLORS[i % COLORS.length] }]}>
              <Text style={styles.rowText}>Row {i + 1}</Text>
            </View>
          ))}
        </ScrollView>
      </BlurTargetView>
      <BlurView blurTarget={target} blurMethod="dimezisBlurViewSdk31Plus" intensity={60} tint="light" style={styles.header}>
        <Text style={styles.title}>Android API {String(Platform.Version)}</Text>
        <Text style={styles.subtitle}>blurMethod: dimezisBlurViewSdk31Plus</Text>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  content: { paddingTop: 140, paddingHorizontal: 16, gap: 12, paddingBottom: 40 },
  row: { height: 72, borderRadius: 12, justifyContent: 'center', paddingHorizontal: 16 },
  rowText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  header: { position: 'absolute', top: 0, left: 0, right: 0, height: 130, justifyContent: 'flex-end', padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14 },
});
