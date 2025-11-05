import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserProfile } from '../services/api';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    userId: string;
    fullName: string;
    email: string;
    numberPhone?: string;
    address?: string;
    avatarUrl?: string;
  } | null>(null);

  // TODO: lấy userId thực tế từ state sau login; tạm thời giả sử backend trả về và đã lưu ở đâu đó
  // Ở bản tích hợp tối thiểu, bạn có thể truyền userId qua params hoặc lưu trong một store/context
  const inferredUserId = (global as any).__USER_ID__ || '';

  useEffect(() => {
    const load = async () => {
      try {
        if (!inferredUserId) {
          setLoading(false);
          return;
        }
        const res = await getUserProfile(inferredUserId);
        setUser(res.data);
      } catch (e: any) {
        Alert.alert('Lỗi', e?.message || 'Không tải được hồ sơ');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inferredUserId]);

  const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View style={styles.infoRow}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={20} color="#666" />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
      </View>
    );
  }

  const avatar = user?.avatarUrl || 'https://placehold.co/200x200?text=Avatar';
  const name = user?.fullName || '';
  const email = user?.email || '';
  const phone = user?.numberPhone || '';
  const address = user?.address || '';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
        
        <InfoRow icon="person-outline" label="Họ và tên" value={name} />
        
        <InfoRow icon="mail-outline" label="Email" value={email} />
        
        {!!phone && <InfoRow icon="call-outline" label="Số điện thoại" value={phone} />}
        
        {!!address && <InfoRow icon="location-outline" label="Địa chỉ" value={address} />}
      </View>

      <View style={styles.actionsContainer}>
        <View style={[styles.actionButton, {backgroundColor: '#4CAF50'}]}>
          <Ionicons name="pencil" size={20} color="white" />
          <Text style={styles.actionText}>Chỉnh sửa hồ sơ</Text>
        </View>
        
        <View style={[styles.actionButton, {backgroundColor: '#f44336'}]}>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.actionText}>Đăng xuất</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    color: '#666',
    fontSize: 14,
  },
  infoSection: {
    marginTop: 20,
    backgroundColor: 'white',
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  actionsContainer: {
    marginTop: 20,
    padding: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: '500',
  },
});

export default ProfileScreen;
