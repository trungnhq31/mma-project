import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const width = Dimensions.get('window').width;
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  bannerWrapper: {
    height: 180,
    marginBottom: 16,
  },
  banner: {
    height: 180,
    marginRight: 12,
    borderRadius: 12,
  },
  features: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  featureItem: {
    gap: 6,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  featureDesc: {
    color: '#666',
  },
});

export default HomeScreen;


