import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../navigation/types';

const HomeScreen = () => {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, 'Home'>>();
  const width = Dimensions.get('window').width;

  const handleBookNow = () => {
    navigation.navigate('BookAppointment');
  };
  const banners = useMemo(
    () => [
      // Bạn có thể thay bằng ảnh trong assets khi đã thêm vào dự án
      'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615800098778-cf3b96c3c173?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1f4?q=80&w=1200&auto=format&fit=crop',
    ],
    []
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>Dịch vụ bảo dưỡng xe điện</Text>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.bannerWrapper}
      >
        {banners.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={[styles.banner, { width: width - 32 }]} />
        ))}
      </ScrollView>

      <View style={styles.features}>
        <View style={styles.featureItem}>
          <Ionicons name="shield-checkmark" size={28} color="#007AFF" />
          <Text style={styles.featureTitle}>Bảo dưỡng định kỳ</Text>
          <Text style={styles.featureDesc}>Quy trình chuẩn, phụ tùng chính hãng.</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="construct" size={28} color="#007AFF" />
          <Text style={styles.featureTitle}>Dịch vụ lưu động</Text>
          <Text style={styles.featureDesc}>Hỗ trợ tận nơi khi bạn cần.</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="time" size={28} color="#007AFF" />
          <Text style={styles.featureTitle}>Đặt lịch nhanh</Text>
          <Text style={styles.featureDesc}>Đặt hẹn chỉ trong vài bước.</Text>
        </View>
      </View>

      {/* Maintenance Tips Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mẹo bảo dưỡng xe điện</Text>
        <View style={styles.tipsContainer}>
          <View style={styles.tipCard}>
            <MaterialIcons name="battery-charging-full" size={32} color="#4CAF50" />
            <Text style={styles.tipTitle}>Pin xe điện</Text>
            <Text style={styles.tipText}>Sạc pin đúng cách, tránh để pin cạn kiệt hoàn toàn.</Text>
          </View>
          <View style={styles.tipCard}>
            <FontAwesome5 name="tint" size={32} color="#2196F3" />
            <Text style={styles.tipTitle}>Hệ thống làm mát</Text>
            <Text style={styles.tipText}>Kiểm tra định kỳ hệ thống làm mát pin và động cơ.</Text>
          </View>
          <View style={styles.tipCard}>
            <MaterialIcons name="tire-repair" size={32} color="#FF9800" />
            <Text style={styles.tipTitle}>Lốp và phanh</Text>
            <Text style={styles.tipText}>Kiểm tra áp suất lốp và độ mòn phanh thường xuyên.</Text>
          </View>
        </View>
      </View>

      {/* Service Packages */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gói dịch vụ</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.packagesContainer}>
          <View style={styles.packageCard}>
            <Text style={styles.packageTitle}>Cơ bản</Text>
            <Text style={styles.packagePrice}>500.000đ</Text>
            <Text style={styles.packageDesc}>• Kiểm tra tổng thể</Text>
            <Text style={styles.packageDesc}>• Vệ sinh cơ bản</Text>
            <Text style={styles.packageDesc}>• Kiểm tra hệ thống phanh</Text>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={handleBookNow}
            >
              <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.packageCard, styles.popularPackage]}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>Phổ biến</Text>
            </View>
            <Text style={styles.packageTitle}>Tiêu chuẩn</Text>
            <Text style={styles.packagePrice}>1.200.000đ</Text>
            <Text style={styles.packageDesc}>• Tất cả gói Cơ bản</Text>
            <Text style={styles.packageDesc}>• Kiểm tra pin chi tiết</Text>
            <Text style={styles.packageDesc}>• Bảo dưỡng hệ thống điện</Text>
            <Text style={styles.packageDesc}>• Thay dầu hộp số (nếu có)</Text>
            <TouchableOpacity 
              style={[styles.bookButton, styles.popularButton]}
              onPress={handleBookNow}
            >
              <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.packageCard}>
            <Text style={styles.packageTitle}>Cao cấp</Text>
            <Text style={styles.packagePrice}>2.500.000đ</Text>
            <Text style={styles.packageDesc}>• Tất cả gói Tiêu chuẩn</Text>
            <Text style={styles.packageDesc}>• Kiểm tra toàn diện</Text>
            <Text style={styles.packageDesc}>• Vệ sinh hệ thống làm mát</Text>
            <Text style={styles.packageDesc}>• Bảo dưỡng phanh đĩa</Text>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={handleBookNow}
            >
              <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Why Choose Us */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tại sao chọn chúng tôi?</Text>
        <View style={styles.whyUsContainer}>
          <View style={styles.whyUsItem}>
            <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
            <View style={styles.whyUsText}>
              <Text style={styles.whyUsTitle}>Đội ngũ kỹ thuật viên chuyên nghiệp</Text>
              <Text style={styles.whyUsDesc}>Được đào tạo bài bản, giàu kinh nghiệm về xe điện</Text>
            </View>
          </View>
          <View style={styles.whyUsItem}>
            <Ionicons name="settings" size={28} color="#2196F3" />
            <View style={styles.whyUsText}>
              <Text style={styles.whyUsTitle}>Thiết bị hiện đại</Text>
              <Text style={styles.whyUsDesc}>Trang thiết bị chuyên dụng cho bảo dưỡng xe điện</Text>
            </View>
          </View>
          <View style={styles.whyUsItem}>
            <Ionicons name="star" size={28} color="#FFC107" />
            <View style={styles.whyUsText}>
              <Text style={styles.whyUsTitle}>Bảo hành dài hạn</Text>
              <Text style={styles.whyUsDesc}>Chính sách bảo hành lên đến 12 tháng</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  bannerWrapper: {
    height: 180,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  banner: {
    height: 180,
    width: '100%',
    borderRadius: 12,
  },
  features: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureItem: {
    gap: 8,
    paddingVertical: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  featureDesc: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  tipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  tipCard: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
    color: '#333',
    textAlign: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  packagesContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  packageCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#eee',
    position: 'relative',
  },
  popularPackage: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 16,
    textAlign: 'center',
  },
  packageDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  popularButton: {
    backgroundColor: '#4CAF50',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  whyUsContainer: {
    gap: 16,
  },
  whyUsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  whyUsText: {
    flex: 1,
  },
  whyUsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  whyUsDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default HomeScreen;


