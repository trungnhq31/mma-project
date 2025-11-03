import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VehiclesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xe của tôi</Text>
      <View style={styles.card}>
        <Text style={styles.carName}>EV Sedan 2024</Text>
        <Text style={styles.meta}>Biển số: 30A-123.45</Text>
        <View style={styles.row}> 
          <Metric label="Pin" value="82%" color="#00b894" />
          <Metric label="Tầm hoạt động" value="310 km" color="#1e90ff" />
          <Metric label="Trạng thái" value="Good" color="#8a2be2" />
        </View>
      </View>
    </View>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.metric, { borderColor: color }]}> 
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, backgroundColor: '#fff' },
  carName: { fontSize: 18, fontWeight: '700' },
  meta: { color: '#666', marginTop: 4 },
  row: { flexDirection: 'row', gap: 10, marginTop: 12 },
  metric: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 12, backgroundColor: '#fff' },
  metricLabel: { fontSize: 12, color: '#666' },
  metricValue: { fontSize: 16, fontWeight: '700', marginTop: 4 },
});


