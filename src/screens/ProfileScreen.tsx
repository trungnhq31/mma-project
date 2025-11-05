import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserProfile, getAuthUserId, updateUserProfile, logout as apiLogout, clearAuth, changePassword } from '../services/api';
import { TextInput, TouchableOpacity } from 'react-native';
import * as yup from 'yup';

// Validation schemas
const profileSchema = yup.object().shape({
  fullName: yup.string().required('Vui lòng nhập họ và tên'),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ'),
  phone: yup
    .string()
    .matches(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ')
    .nullable(),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
});

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
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form field handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  // Password field handlers
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  // Toggle password modal
  const togglePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
    if (!showPasswordModal) {
      // Reset password form when opening
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      // Reset errors
      setErrors({});
      
      // Validate form
      await profileSchema.validate(formData, { abortEarly: false });
      
      // Show loading state
      setIsUpdating(true);
      
      // Call API to update profile
      await updateUserProfile(inferredUserId, {
        fullName: formData.fullName,
        email: formData.email,
        numberPhone: formData.phone || undefined,
      });
      
      // Update local user data
      setUser(prev => prev ? {
        ...prev,
        fullName: formData.fullName,
        email: formData.email,
        numberPhone: formData.phone || undefined,
      } : null);
      
      // Exit edit mode
      setProfileEditing(false);
      
      // Show success message
      Alert.alert('Thành công', 'Cập nhật thông tin thành công');
    } catch (error: any) {
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err: any) => {
          if (err.path) newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        // Handle API errors
        Alert.alert('Lỗi', error.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.');
      }
    } finally {
      // Reset loading state
      setIsUpdating(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async () => {
    try {
      // Reset errors
      setPasswordErrors({});
      
      // Validate form
      await passwordSchema.validate(passwordData, { abortEarly: false });
      
      // Show loading state
      setIsUpdating(true);
      
      // Call API to change password
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Reset form and show success message
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Close modal
      setShowPasswordModal(false);
      
      // Show success message
      Alert.alert('Thành công', 'Đổi mật khẩu thành công');
    } catch (error: any) {
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err: any) => {
          if (err.path) newErrors[err.path] = err.message;
        });
        setPasswordErrors(newErrors);
      } else {
        // Handle API errors
        Alert.alert('Lỗi', error.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
      }
    } finally {
      // Reset loading state
      setIsUpdating(false);
    }
  };

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
              style={[styles.input, errors.fullName && styles.inputError]}
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              placeholder="Họ và tên"
            />
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity 
                style={[styles.saveButton, isUpdating && styles.disabledButton]} 
                onPress={handleUpdateProfile}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Lưu thông tin</Text>
                )}
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
                setFormData({
                  fullName: user?.fullName || '',
                  email: user?.email || '',
                  phone: user?.numberPhone || '',
                });
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

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#f44336' }]}
              onPress={togglePasswordModal}
            >
              <Ionicons name="lock-open" size={20} color="white" />
              <Text style={styles.actionText}>Đổi mật khẩu</Text>
            </TouchableOpacity>
          </>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: '#f44336'}]}
          onPress={async () => {
            try {
              if (!user?.userId) return;
              await apiLogout(user.userId);
            } catch {}
            clearAuth();
            try { (global as any).__SET_LOGGED_IN__?.(false); } catch {}
            Alert.alert('Thông báo', 'Đã đăng xuất');
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.actionText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={togglePasswordModal}
      >
        <TouchableWithoutFeedback onPress={togglePasswordModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
          <TextInput
            style={[styles.input, passwordErrors.currentPassword && styles.inputError]}
            value={passwordData.currentPassword}
            onChangeText={(text) => handlePasswordChange('currentPassword', text)}
            placeholder="Mật khẩu hiện tại"
            secureTextEntry
          />
          {passwordErrors.currentPassword && (
            <Text style={styles.errorText}>{passwordErrors.currentPassword}</Text>
          )}
          <TextInput
            style={[styles.input, passwordErrors.newPassword && styles.inputError]}
            value={passwordData.newPassword}
            onChangeText={(text) => handlePasswordChange('newPassword', text)}
            placeholder="Mật khẩu mới"
            secureTextEntry
          />
          {passwordErrors.newPassword && (
            <Text style={styles.errorText}>{passwordErrors.newPassword}</Text>
          )}
          <TextInput
            style={[styles.input, passwordErrors.confirmPassword && styles.inputError]}
            value={passwordData.confirmPassword}
            onChangeText={(text) => handlePasswordChange('confirmPassword', text)}
            placeholder="Xác nhận mật khẩu mới"
            secureTextEntry
          />
          {passwordErrors.confirmPassword && (
            <Text style={styles.errorText}>{passwordErrors.confirmPassword}</Text>
          )}
          <TouchableOpacity 
            style={styles.changePasswordButton} 
            onPress={handleUpdatePassword}
          >
            <Text style={styles.changePasswordButtonText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.changePasswordButton, { backgroundColor: '#9e9e9e' }]} 
            onPress={togglePasswordModal}
          >
            <Text style={styles.changePasswordButtonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  changePasswordButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  changePasswordButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
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
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  actionText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ProfileScreen;
