import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';

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

type RootStackParamList = {
  BookingDetail: { booking: Booking };
};

type BookingDetailScreenRouteProp = RouteProp<RootStackParamList, 'BookingDetail'>;

interface BookingDetailProps {
  route: BookingDetailScreenRouteProp;
}

export default function BookingDetailScreen({ route }: BookingDetailProps) {
  const { booking } = route.params;
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin đặt lịch</Text>
        <DetailRow label="Mã đơn hàng" value={booking.id} />
        <DetailRow label="Ngày đặt" value={new Date(booking.bookingDate).toLocaleString()} />
        <DetailRow 
          label="Trạng thái" 
          value={booking.status}
          valueStyle={booking.status === 'Đã xác nhận' ? styles.statusConfirmed : styles.statusPending}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        <DetailRow label="Họ và tên" value={booking.customerName} />
        <DetailRow label="Số điện thoại" value={booking.details.phone} />
        <DetailRow label="Email" value={booking.details.email} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin xe</Text>
        <DetailRow label="Dòng xe" value={booking.details.vehicleType} />
        <DetailRow label="Biển số xe" value={booking.details.licensePlate} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin dịch vụ</Text>
        <DetailRow label="Dịch vụ" value={booking.serviceName} />
        <DetailRow label="Hình thức" value={booking.details.serviceType} />
        {booking.details.serviceType === 'Tại nhà' && (
          <DetailRow label="Địa chỉ" value={booking.details.address} />
        )}
        {booking.details.notes && (
          <DetailRow label="Ghi chú" value={booking.details.notes} />
        )}
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value, valueStyle = {} }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    color: '#666',
    flex: 1,
  },
  value: {
    flex: 2,
    textAlign: 'right',
    color: '#333',
  },
  statusConfirmed: {
    color: '#155724',
    backgroundColor: '#d4edda',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
  statusPending: {
    color: '#856404',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
});
