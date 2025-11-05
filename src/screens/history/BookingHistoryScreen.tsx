import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type Booking = {
  id: string;
  customerName: string;
  serviceName: string;
  bookingDate: string;
  status: string;
  details: {
    phone: string;
    email: string;
    vehicleType: string;
    licensePlate: string;
    serviceType: string;
    address: string;
    notes?: string;
  };
};

// Mock data for bookings
const mockBookings = [
  {
    id: '1',
    customerName: 'Nguyễn Văn A',
    serviceName: 'Bảo dưỡng định kỳ',
    bookingDate: '2023-11-05T10:00:00',
    status: 'Đã xác nhận',
    details: {
      phone: '0901234567',
      email: 'nguyenvana@example.com',
      vehicleType: 'Toyota Vios',
      licensePlate: '51A-12345',
      serviceType: 'Tại trung tâm',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      notes: 'Cần kiểm tra thêm hệ thống phanh'
    }
  },
  // Add more mock data as needed
];

export default function BookingHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [bookings] = useState<Booking[]>(mockBookings);

  const renderItem: ListRenderItem<Booking> = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookingItem}
      onPress={() => navigation.navigate('BookingDetail', { booking: item })}
    >
      <Text style={styles.customerName}>{item.customerName}</Text>
      <Text style={styles.serviceName}>{item.serviceName}</Text>
      <View style={styles.row}>
        <Text style={styles.date}>{new Date(item.bookingDate).toLocaleDateString()}</Text>
        <Text style={[styles.status, item.status === 'Đã xác nhận' ? styles.statusConfirmed : styles.statusPending]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lịch sử đặt lịch</Text>
      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  list: {
    padding: 10,
  },
  bookingItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  serviceName: {
    color: '#666',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: '#888',
    fontSize: 12,
  },
  status: {
    fontSize: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  statusConfirmed: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
});
