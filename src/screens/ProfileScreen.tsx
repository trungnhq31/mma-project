import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserProfile, getAuthUserId, updateUserProfile } from '../services/api';
import { TextInput, TouchableOpacity } from 'react-native';

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

  const inferredUserId = getAuthUserId() || '';
  const [avatarEditing, setAvatarEditing] = useState(false);
  const [avatarInput, setAvatarInput] = useState('');
  const [profileEditing, setProfileEditing] = useState(false);
  const [formFullName, setFormFullName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');

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
        {profileEditing ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              value={formFullName}
              onChangeText={setFormFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={formEmail}
              onChangeText={setFormEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={formPhone}
              onChangeText={setFormPhone}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#4CAF50', flex: 1 }]}
                onPress={async () => {
                  try {
                    if (!inferredUserId) return;
                    await updateUserProfile(inferredUserId, {
                      fullName: formFullName,
                      email: formEmail,
                      numberPhone: formPhone,
                    });
                    const res = await getUserProfile(inferredUserId);
                    setUser(res.data);
                    setProfileEditing(false);
                  } catch (e: any) {
                    Alert.alert('Lỗi', e?.message || 'Cập nhật thông tin thất bại');
                  }
                }}
              >
                <Text style={styles.actionText}>Lưu thông tin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#9e9e9e', flex: 1 }]}
                onPress={() => setProfileEditing(false)}
              >
                <Text style={styles.actionText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <InfoRow icon="person-outline" label="Họ và tên" value={name} />
            <InfoRow icon="mail-outline" label="Email" value={email} />
            {!!phone && <InfoRow icon="call-outline" label="Số điện thoại" value={phone} />}
            {!!address && <InfoRow icon="location-outline" label="Địa chỉ" value={address} />}
          </>
        )}
      </View>

      <View style={styles.actionsContainer}>
        {profileEditing ? null : avatarEditing ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.input}
              placeholder="Dán URL ảnh avatar..."
              value={avatarInput}
              onChangeText={setAvatarInput}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
              onPress={async () => {
                try {
                  if (!inferredUserId) return;
                  await updateUserProfile(inferredUserId, { avatarUrl: avatarInput });
                  const res = await getUserProfile(inferredUserId);
                  setUser(res.data);
                  setAvatarEditing(false);
                  setAvatarInput('');
                } catch (e: any) {
                  Alert.alert('Lỗi', e?.message || 'Cập nhật avatar thất bại');
                }
              }}
            >
              <Text style={styles.actionText}>Lưu avatar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => {
                setProfileEditing(true);
                setFormFullName(user?.fullName || '');
                setFormEmail(user?.email || '');
                setFormPhone(user?.numberPhone || '');
              }}
            >
              <Ionicons name="pencil" size={20} color="white" />
              <Text style={styles.actionText}>Chỉnh sửa thông tin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#2196f3' }]}
              onPress={() => {
                setAvatarEditing(true);
                setAvatarInput(user?.avatarUrl || '');
              }}
            >
              <Ionicons name="image" size={20} color="white" />
              <Text style={styles.actionText}>Thêm/Cập nhật avatar</Text>
            </TouchableOpacity>
          </>
        )}
        
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
  editRow: {
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#fff',
  },
  actionText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: '500',
  },
});

export default ProfileScreen;
