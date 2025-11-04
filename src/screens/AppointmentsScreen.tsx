import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';

type AppointmentsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Appointments'>;

type Appointment = {
  id: string;
  title: string;
  date: string;
  time: string;
  service: string;
  status: 'scheduled' | 'completed' | 'cancelled';
};

const DATA: Appointment[] = [
  { 
    id: '1', 
    title: 'Bảo dưỡng định kỳ', 
    date: '10/11/2025',
    time: '09:00 - 10:30',
    service: 'Bảo dưỡng tổng thể',
    status: 'scheduled' 
  },
  { 
    id: '2', 
    title: 'Kiểm tra pin', 
    date: '28/10/2025',
    time: '14:00 - 15:30',
    service: 'Kiểm tra hệ thống pin',
    status: 'completed' 
  },
  { 
    id: '3', 
    title: 'Thay lốp', 
    date: '15/11/2025',
    time: '10:00 - 11:30',
    service: 'Thay lốp mùa đông',
    status: 'scheduled' 
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return { bg: '#e3f2fd', text: '#1976d2', label: 'Đã đặt lịch' };
    case 'completed':
      return { bg: '#e8f5e9', text: '#388e3c', label: 'Hoàn thành' };
    case 'cancelled':
      return { bg: '#ffebee', text: '#d32f2f', label: 'Đã hủy' };
    default:
      return { bg: '#f5f5f5', text: '#616161', label: 'Không xác định' };
  }
};

export default function AppointmentsScreen() {
  const navigation = useNavigation<AppointmentsScreenNavigationProp>();

  const handleCreateAppointment = () => {
    // Navigate to create appointment screen
    console.log('Navigate to create appointment');
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    const status = getStatusColor(item.status);
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => console.log('View appointment details', item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.text }]}>
              {status.label}
            </Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="construct-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.service}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          {item.status === 'scheduled' && (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, { borderColor: '#ff6b6b' }]}
                onPress={() => console.log('Cancel appointment', item.id)}
              >
                <Text style={[styles.actionButtonText, { color: '#ff6b6b' }]}>
                  Hủy lịch
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { borderColor: '#4dabf7' }]}
                onPress={() => console.log('Reschedule', item.id)}
              >
                <Text style={[styles.actionButtonText, { color: '#4dabf7' }]}>
                  Đổi lịch
                </Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity 
            style={[styles.actionButton, { borderColor: '#495057' }]}
            onPress={() => console.log('View details', item.id)}
          >
            <Text style={[styles.actionButtonText, { color: '#495057' }]}>
              Chi tiết
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lịch hẹn</Text>
        <PrimaryButton 
          label="Tạo lịch hẹn mới" 
          onPress={handleCreateAppointment}
          style={styles.addButton}
        />
      </View>
      
      {DATA.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#dee2e6" />
          <Text style={styles.emptyText}>Chưa có lịch hẹn nào</Text>
          <Text style={styles.emptySubtext}>Tạo lịch hẹn mới để bắt đầu</Text>
          <PrimaryButton 
            label="Tạo lịch hẹn" 
            onPress={handleCreateAppointment}
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <FlatList
          data={DATA}
          renderItem={renderAppointmentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>
              Tổng cộng {DATA.length} lịch hẹn
            </Text>
          }
        />
      )}
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
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
  },
  addButton: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#495057',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginLeft: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginBottom: 24,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#6c757d',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  emptyButton: {
    width: '60%',
    marginTop: 16,
  },
});


