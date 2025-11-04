import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

const { width } = Dimensions.get('window');

type VehicleScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Vehicles'>;

type Vehicle = {
  id: string;
  name: string;
  model: string;
  licensePlate: string;
  batteryLevel: number;
  range: number;
  image: any; // In a real app, this would be a require() or network image
  status: 'online' | 'offline' | 'charging';
  lastUpdated: string;
};

const VEHICLES: Vehicle[] = [
  {
    id: '1',
    name: 'Xe chính',
    model: 'EV Sedan 2024',
    licensePlate: '30A-123.45',
    batteryLevel: 82,
    range: 320,
    image: require('../../assets/car-placeholder.png'),
    status: 'online',
    lastUpdated: 'Cập nhật 5 phút trước'
  },
  // Add more vehicles as needed
];

export default function VehiclesScreen() {
  const navigation = useNavigation<VehicleScreenNavigationProp>();

  const handleAddVehicle = () => {
    console.log('Add new vehicle');
    // navigation.navigate('AddVehicle');
  };

  const renderVehicleCard = (vehicle: Vehicle) => {
    const getStatusColor = () => {
      switch (vehicle.status) {
        case 'online':
          return '#00b894';
        case 'charging':
          return '#0984e3';
        case 'offline':
          return '#dfe6e9';
        default:
          return '#b2bec3';
      }
    };

    const getStatusText = () => {
      switch (vehicle.status) {
        case 'online':
          return 'Đang hoạt động';
        case 'charging':
          return 'Đang sạc';
        case 'offline':
          return 'Ngoại tuyến';
        default:
          return 'Không xác định';
      }
    };

    return (
      <View key={vehicle.id} style={styles.vehicleCard}>
        <View style={styles.vehicleHeader}>
          <View>
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
            <Text style={styles.vehicleModel}>{vehicle.model}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        <View style={styles.vehicleImageContainer}>
          <Image 
            source={vehicle.image} 
            style={styles.vehicleImage} 
            resizeMode="contain"
          />
        </View>

        <View style={styles.licensePlate}>
          <Text style={styles.licensePlateText}>{vehicle.licensePlate}</Text>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Mức pin</Text>
            <View style={styles.batteryContainer}>
              <View 
                style={[
                  styles.batteryFill, 
                  { 
                    width: `${vehicle.batteryLevel}%`,
                    backgroundColor: vehicle.batteryLevel > 20 ? '#00b894' : '#ff7675'
                  }
                ]} 
              />
            </View>
            <Text style={styles.metricValue}>{vehicle.batteryLevel}%</Text>
          </View>
          
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Tầm hoạt động</Text>
            <View style={styles.rangeContainer}>
              <Ionicons name="navigate" size={16} color="#636e72" />
              <Text style={styles.rangeText}>{vehicle.range} km</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.lastUpdated}>{vehicle.lastUpdated}</Text>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Xem chi tiết</Text>
            <Ionicons name="chevron-forward" size={16} color="#1e90ff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Xe của tôi</Text>
        
        {VEHICLES.map(vehicle => renderVehicleCard(vehicle))}
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddVehicle}
        >
          <Ionicons name="add-circle-outline" size={24} color="#1e90ff" />
          <Text style={styles.addButtonText}>Thêm xe mới</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 20,
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
  },
  vehicleModel: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  licensePlate: {
    backgroundColor: '#f1f2f6',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  licensePlateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3436',
    letterSpacing: 1,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 16,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#636e72',
    marginBottom: 6,
  },
  batteryContainer: {
    height: 6,
    backgroundColor: '#dfe6e9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  batteryFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#b2bec3',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#1e90ff',
    fontWeight: '600',
    marginRight: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  addButtonText: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});


