import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tổng quan</Text>
      <View style={styles.grid}>
        <Card title="Sức khỏe xe" value="Good" subtitle="Pin 82%" color="#1e90ff" />
        <Card title="Lịch hẹn" value="2" subtitle="Tuần này" color="#8a2be2" />
        <Card title="Sạc gần đây" value="4" subtitle="7 ngày qua" color="#00b894" />
        <Card title="Thông báo" value="1" subtitle="Chưa đọc" color="#ff8c00" />
      </View>

      <Text style={styles.sectionTitle}>Hành động nhanh</Text>
      <View style={styles.actions}>
        <PrimaryButton label="Đặt lịch bảo dưỡng" />
        <PrimaryButton label="Tìm trạm sạc" />
        <PrimaryButton label="Liên hệ hỗ trợ" />
      </View>
    </ScrollView>
  );
}

function Card({ title, value, subtitle, color }: { title: string; value: string; subtitle: string; color: string }) {
  return (
    <View style={[styles.card, { borderColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  );
}

function PrimaryButton({ label }: { label: string }) {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  actions: {
    gap: 10,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


