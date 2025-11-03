import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

type Appointment = {
  id: string;
  title: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
};

const DATA: Appointment[] = [
  { id: '1', title: 'Bảo dưỡng định kỳ', date: '10/11/2025 09:00', status: 'scheduled' },
  { id: '2', title: 'Kiểm tra pin', date: '28/10/2025 14:00', status: 'completed' },
];

export default function AppointmentsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Lịch hẹn</Text>
        <TouchableOpacity style={styles.primary}>
          <Text style={styles.primaryLabel}>+ Tạo lịch hẹn</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <AppointmentItem item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}

function AppointmentItem({ item }: { item: Appointment }) {
  const color = item.status === 'scheduled' ? '#1e90ff' : item.status === 'completed' ? '#00b894' : '#e17055';
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.date}</Text>
      </View>
      <View style={[styles.status, { backgroundColor: color + '22', borderColor: color }]}> 
        <Text style={[styles.statusText, { color }]}>{labelOf(item.status)}</Text>
      </View>
    </View>
  );
}

function labelOf(s: Appointment['status']) {
  switch (s) {
    case 'scheduled':
      return 'Đã lên lịch';
    case 'completed':
      return 'Hoàn tất';
    case 'cancelled':
      return 'Đã hủy';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  primary: { backgroundColor: '#1e90ff', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  primaryLabel: { color: '#fff', fontWeight: '600' },
  card: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  status: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  statusText: { fontSize: 12, fontWeight: '700' },
});


