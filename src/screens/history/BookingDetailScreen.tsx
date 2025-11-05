import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { getBookingDetail } from '../../services/api';

type Booking = any;

type RootStackParamList = {
  BookingDetail: { booking: Booking };
};

type BookingDetailScreenRouteProp = RouteProp<RootStackParamList, 'BookingDetail'>;

interface BookingDetailProps {
  route: BookingDetailScreenRouteProp;
}

export default function BookingDetailScreen({ route }: BookingDetailProps) {
  const { booking } = route.params;
  const [detail, setDetail] = useState<any>(booking?.raw || null);

  useEffect(() => {
    const load = async () => {
      try {
        if (booking?.id) {
          const res = await getBookingDetail(booking.id);
          setDetail(res.data);
        }
      } catch {
        // ignore
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.id]);

  const phone = detail?.customerPhoneNumber || '';
  const email = detail?.customerEmail || '';
  const vehicleTypeName = detail?.vehicleTypeName || '';
  const licensePlate = detail?.vehicleNumberPlate || '';
  const serviceMode = detail?.serviceMode === 'MOBILE' ? 'Tại nhà' : 'Tại trung tâm';
  const address = detail?.userAddress || '';
  const notes = detail?.notes || '';
  const bookingDate = detail?.scheduledAt || booking?.bookingDate;
  const status = detail?.status || booking?.status;
  const orderId = detail?.appointmentId || booking?.id;
  const customerName = detail?.customerFullName || booking?.customerName;
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin đặt lịch</Text>
        <DetailRow label="Mã đơn hàng" value={orderId} />
        <DetailRow label="Ngày đặt" value={new Date(bookingDate).toLocaleString()} />
        <DetailRow 
          label="Trạng thái" 
          value={status}
          valueStyle={status === 'Đã xác nhận' ? styles.statusConfirmed : styles.statusPending}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        <DetailRow label="Họ và tên" value={customerName} />
        {!!phone && <DetailRow label="Số điện thoại" value={phone} />}
        {!!email && <DetailRow label="Email" value={email} />}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin xe</Text>
        {!!vehicleTypeName && <DetailRow label="Dòng xe" value={vehicleTypeName} />}
        {!!licensePlate && <DetailRow label="Biển số xe" value={licensePlate} />}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin dịch vụ</Text>
        {!!booking?.serviceName && <DetailRow label="Dịch vụ" value={booking.serviceName} />}
        <DetailRow label="Hình thức" value={serviceMode} />
        {serviceMode === 'Tại nhà' && !!address && (
          <DetailRow label="Địa chỉ" value={address} />
        )}
        {!!notes && (
          <DetailRow label="Ghi chú" value={notes} />
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
