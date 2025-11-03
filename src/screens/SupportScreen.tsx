import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hỗ trợ</Text>
      <View style={styles.card}> 
        <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>
        <Bullet text="Làm sao đặt lịch bảo dưỡng?" />
        <Bullet text="Sạc nhanh khác sạc thường như thế nào?" />
        <Bullet text="Kiểm tra tình trạng pin ở đâu?" />
      </View>

      <View style={styles.card}> 
        <Text style={styles.sectionTitle}>Liên hệ</Text>
        <Text style={styles.meta}>Email: support@example.com</Text>
        <Text style={styles.meta}>Hotline: 1900 1234</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonLabel}>Gửi yêu cầu hỗ trợ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.dot} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, backgroundColor: '#fff', marginBottom: 12 },
  meta: { color: '#666', marginBottom: 6 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#999', marginRight: 8 },
  bulletText: { color: '#333' },
  button: { backgroundColor: '#1e90ff', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonLabel: { color: '#fff', fontWeight: '600' },
});


