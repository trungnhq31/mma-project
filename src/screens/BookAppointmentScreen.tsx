import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

type VehicleType = {
  vehicleTypeId: string;
  vehicleTypeName: string;
  manufacturer: string;
  modelYear: string;
};

interface ServiceType {
  serviceTypeId: string;
  serviceName: string;
  description?: string;
  estimatedDurationMinutes?: number;
  parentId: string | null;
  children?: ServiceType[];
  isActive: boolean;
  isDeleted: boolean;
  serviceTypeVehiclePartResponses?: Array<{
    serviceTypeVehiclePartId: string;
    vehiclePart: {
      vehiclePartId: string;
      vehiclePartName: string;
    };
    requiredQuantity: number;
    estimatedTimeDefault: number;
  }>;
}

type BookingFormData = {
  // Customer Information
  fullName: string;
  phoneNumber: string;
  email: string;
  
  // Vehicle Information
  vehicleTypeId: string;
  mileage?: string;
  licensePlate: string;
  
  // Service Selection
  selectedServices: string[];
  serviceType: 'onsite' | 'mobile';
  address: string;
  
  // Appointment Details
  appointmentDate: Date | null;
  notes: string;
};

// Mock data
const VEHICLE_TYPES: VehicleType[] = [
  { vehicleTypeId: '1', vehicleTypeName: 'VinFast VF e34', manufacturer: 'VinFast', modelYear: '2022' },
  { vehicleTypeId: '2', vehicleTypeName: 'VinFast VF 8', manufacturer: 'VinFast', modelYear: '2023' },
  { vehicleTypeId: '3', vehicleTypeName: 'VinFast VF 9', manufacturer: 'VinFast', modelYear: '2023' },
];

const SERVICE_TYPES: ServiceType[] = [
  {
    serviceTypeId: 's1',
    serviceName: 'Bảo dưỡng định kỳ',
    parentId: null,
    isActive: true,
    isDeleted: false,
    children: [
      { 
        serviceTypeId: 's1-1', 
        serviceName: 'Bảo dưỡng 10.000 km',
        parentId: 's1',
        isActive: true,
        isDeleted: false
      },
      { 
        serviceTypeId: 's1-2', 
        serviceName: 'Bảo dưỡng 20.000 km',
        parentId: 's1',
        isActive: true,
        isDeleted: false
      },
      { 
        serviceTypeId: 's1-3', 
        serviceName: 'Bảo dưỡng 30.000 km',
        parentId: 's1',
        isActive: true,
        isDeleted: false
      },
    ],
  },
  {
    serviceTypeId: 's2',
    serviceName: 'Sửa chữa',
    parentId: null,
    isActive: true,
    isDeleted: false,
    children: [
      { 
        serviceTypeId: 's2-1', 
        serviceName: 'Thay lọc gió',
        parentId: 's2',
        isActive: true,
        isDeleted: false
      },
      { 
        serviceTypeId: 's2-2', 
        serviceName: 'Thay dầu phanh',
        parentId: 's2',
        isActive: true,
        isDeleted: false
      },
      { 
        serviceTypeId: 's2-3', 
        serviceName: 'Kiểm tra hệ thống điện',
        parentId: 's2',
        isActive: true,
        isDeleted: false
      },
    ],
  },
  {
    serviceTypeId: 's3',
    serviceName: 'Vệ sinh',
    parentId: null,
    isActive: true,
    isDeleted: false,
    children: [
      { 
        serviceTypeId: 's3-1', 
        serviceName: 'Vệ sinh nội thất',
        parentId: 's3',
        isActive: true,
        isDeleted: false
      },
      { 
        serviceTypeId: 's3-2', 
        serviceName: 'Vệ sinh động cơ',
        parentId: 's3',
        isActive: true,
        isDeleted: false
      },
      { 
        serviceTypeId: 's3-3', 
        serviceName: 'Đánh bóng sơn',
        parentId: 's3',
        isActive: true,
        isDeleted: false
      },
    ],
  },
];

const SERVICE_CENTER_ADDRESS = '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM';

// Validation schema
const schema = yup.object().shape({
  fullName: yup.string().required('Vui lòng nhập họ và tên'),
  phoneNumber: yup
    .string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^[0-9]{10,}$/, 'Số điện thoại không hợp lệ'),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ'),
  vehicleTypeId: yup.string().required('Vui lòng chọn loại xe'),
  mileage: yup.string().matches(/^[0-9]*$/, 'Số km phải là số'),
  licensePlate: yup
    .string()
    .required('Vui lòng nhập biển số xe')
    .matches(/^[0-9]{2}[A-Za-z][0-9A-Za-z]-[0-9]{4,5}$/, 'Biển số xe không hợp lệ (VD: 30A-12345)'),
  selectedServices: yup
    .array()
    .min(1, 'Vui lòng chọn ít nhất một dịch vụ'),
  serviceType: yup.string().required('Vui lòng chọn loại hình dịch vụ'),
  address: yup.string().when('serviceType', {
    is: 'mobile',
    then: yup.string().required('Vui lòng nhập địa chỉ gặp nạn'),
  }),
  appointmentDate: yup
    .date()
    .required('Vui lòng chọn ngày giờ hẹn')
    .min(new Date(), 'Ngày giờ hẹn phải trong tương lai'),
  notes: yup.string(),
});

const BookAppointmentScreen = () => {
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState('');
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      vehicleTypeId: '',
      licensePlate: '',
      selectedServices: [],
      serviceType: 'onsite',
      address: SERVICE_CENTER_ADDRESS,
      appointmentDate: null,
      notes: ''
    },
  });

  const serviceType = watch('serviceType');
  const watchVehicleType = watch('vehicleTypeId');

  useEffect(() => {
    const vehicleId = watchVehicleType || '';
    setSelectedVehicleTypeId(vehicleId);
    
    // Clear selected services when vehicle changes
    if (vehicleId) {
      // You might want to fetch services for the selected vehicle here
      // fetchServicesForVehicle(vehicleId);
    } else {
      // Clear selected services when no vehicle is selected
      setSelectedServices([]);
      setValue('selectedServices', [], { shouldValidate: true });
    }
  }, [watchVehicleType, setValue]);

  useEffect(() => {
    // Using mock data instead of API call
    if (selectedVehicleTypeId) {
      // Filter services based on the selected vehicle type if needed
      // For now, we'll use all services as mock data
      setServices(SERVICE_TYPES);
    } else {
      setServices([]);
    }
  }, [selectedVehicleTypeId]);

  const areAllChildrenSelected = (service: ServiceType): boolean => {
    if (!service.children || service.children.length === 0) {
      return selectedServices.includes(service.serviceTypeId);
    }
    
    return service.children.every(child => {
      if (child.children && child.children.length > 0) {
        return areAllChildrenSelected(child);
      }
      return selectedServices.includes(child.serviceTypeId);
    });
  };
  
  const selectAllChildren = (service: ServiceType, select: boolean) => {
    if (!service.children || service.children.length === 0) {
      if (select) {
        if (!selectedServices.includes(service.serviceTypeId)) {
          setSelectedServices(prev => [...prev, service.serviceTypeId]);
        }
      } else {
        setSelectedServices(prev => prev.filter(id => id !== service.serviceTypeId));
      }
      return;
    }
    
    // Process all children recursively
    service.children.forEach(child => selectAllChildren(child, select));
  };

  const toggleService = (serviceId: string) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const toggleServiceSelection = (serviceId: string, service: ServiceType) => {
    if (!selectedVehicleTypeId) return;
    
    const isCurrentlySelected = selectedServices.includes(serviceId);
    
    if (isCurrentlySelected) {
      // If service is selected, deselect it and all its children
      const newSelectedServices = selectedServices.filter(id => {
        // Keep services that are not this service and not its children
        if (id === serviceId) return false;
        
        // Check if this is a child of the service being toggled
        if (service.children) {
          const isChild = service.children.some(child => 
            child.serviceTypeId === id || 
            (child.children && child.children.some(grandChild => grandChild.serviceTypeId === id)
          ));
          return !isChild;
        }
        return true;
      });
      
      setSelectedServices(newSelectedServices);
      setValue('selectedServices', newSelectedServices, { shouldValidate: true });
    } else {
      // If service is not selected, select it and all its children
      const newSelectedServices = [...selectedServices, serviceId];
      
      // Add all children if it's a parent service
      if (service.children && service.children.length > 0) {
        const addChildren = (children: ServiceType[]) => {
          children.forEach(child => {
            if (!newSelectedServices.includes(child.serviceTypeId)) {
              newSelectedServices.push(child.serviceTypeId);
            }
            if (child.children) {
              addChildren(child.children);
            }
          });
        };
        addChildren(service.children);
      }
      
      setSelectedServices(newSelectedServices);
      setValue('selectedServices', newSelectedServices, { shouldValidate: true });
    }
  };

  const isServiceSelected = (service: ServiceType): 'checked' | 'unchecked' | 'indeterminate' => {
    // For services without children, just check if they're in selectedServices
    if (!service.children || service.children.length === 0) {
      return selectedServices.includes(service.serviceTypeId) ? 'checked' : 'unchecked';
    }
    
    // For parent services, check the state of all children
    const childStates = service.children.map(child => isServiceSelected(child));
    
    if (childStates.every(state => state === 'checked')) {
      return 'checked';
    }
    
    if (childStates.some(state => state !== 'unchecked')) {
      return 'indeterminate';
    }
    
    return 'unchecked';
  };

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Đặt lịch thành công',
        'Chúng tôi đã nhận được yêu cầu đặt lịch của bạn. Vui lòng kiểm tra email để xác nhận.'
      );
      
      // Reset form or navigate back
    } catch (error) {
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi đặt lịch. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const renderServiceItem = (service: ServiceType, level = 0) => {
    const hasChildren = service.children && service.children.length > 0;
    const isExpanded = expandedServices[service.serviceTypeId];
    const selectionState = isServiceSelected(service);
    const isDisabled = !selectedVehicleTypeId || !service.isActive || service.isDeleted;
    const isIndeterminate = selectionState === 'indeterminate';
    const isChecked = selectionState === 'checked';

    return (
      <View key={service.serviceTypeId} style={{ marginLeft: level * 16 }}>
        <View style={[
          styles.serviceItem,
          isDisabled && styles.disabledItem
        ]}>
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => !isDisabled && toggleServiceSelection(service.serviceTypeId, service)}
            disabled={isDisabled}
          >
            <View style={[
              styles.checkbox,
              (isChecked || isIndeterminate) && styles.checkboxSelected,
              isDisabled && styles.checkboxDisabled
            ]}>
              {isChecked && <MaterialIcons name="check" size={16} color="white" />}
              {isIndeterminate && <View style={styles.indeterminateLine} />}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.serviceNameContainer}
            onPress={() => hasChildren && toggleService(service.serviceTypeId)}
            disabled={isDisabled}
          >
            <Text style={[
              styles.serviceName, 
              hasChildren && styles.parentService,
              isDisabled && styles.disabledText
            ]}>
              {service.serviceName}
              {service.estimatedDurationMinutes && (
                <Text style={styles.durationText}> • {service.estimatedDurationMinutes} phút</Text>
              )}
            </Text>
          </TouchableOpacity>
          
          {hasChildren && (
            <TouchableOpacity 
              onPress={() => toggleService(service.serviceTypeId)}
              disabled={isDisabled}
            >
              <MaterialIcons
                name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={24}
                color={isDisabled ? '#999' : '#666'}
              />
            </TouchableOpacity>
          )}
        </View>
        
        {hasChildren && isExpanded && (
          <View style={styles.childServices}>
            {service.children?.map(child => renderServiceItem(child, level + 1))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionHeader}>Thông tin khách hàng</Text>
      <View style={styles.section}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Họ và tên *</Text>
              <View style={[styles.input, errors.fullName && styles.inputError]}>
                <TextInput
                  style={styles.textInput}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Nhập họ và tên"
                />
              </View>
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
            </View>
          )}
          name="fullName"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Số điện thoại *</Text>
              <View style={[styles.input, errors.phoneNumber && styles.inputError]}>
                <TextInput
                  style={styles.textInput}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}
            </View>
          )}
          name="phoneNumber"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
              <View style={[styles.input, errors.email && styles.inputError]}>
                <TextInput
                  style={styles.textInput}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Nhập email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            </View>
          )}
          name="email"
        />
      </View>

      <Text style={styles.sectionHeader}>Thông tin xe</Text>
      <View style={styles.section}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mẫu xe/Loại xe *</Text>
              <View style={[styles.pickerContainer, errors.vehicleTypeId && styles.inputError]}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Chọn loại xe" value="" />
                  {VEHICLE_TYPES.map(vehicle => (
                    <Picker.Item
                      key={vehicle.vehicleTypeId}
                      label={`${vehicle.manufacturer} ${vehicle.vehicleTypeName} (${vehicle.modelYear})`}
                      value={vehicle.vehicleTypeId}
                    />
                  ))}
                </Picker>
              </View>
              {errors.vehicleTypeId && <Text style={styles.errorText}>{errors.vehicleTypeId.message}</Text>}
            </View>
          )}
          name="vehicleTypeId"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Số km đã đi</Text>
              <View style={[styles.input, errors.mileage && styles.inputError]}>
                <TextInput
                  style={styles.textInput}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Nhập số km"
                  keyboardType="numeric"
                />
              </View>
              {errors.mileage && <Text style={styles.errorText}>{errors.mileage.message}</Text>}
            </View>
          )}
          name="mileage"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Biển số xe *</Text>
              <View style={[styles.input, errors.licensePlate && styles.inputError]}>
                <TextInput
                  style={styles.textInput}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="VD: 30A-12345"
                  autoCapitalize="characters"
                />
              </View>
              {errors.licensePlate && <Text style={styles.errorText}>{errors.licensePlate.message}</Text>}
            </View>
          )}
          name="licensePlate"
        />
      </View>

      <Text style={styles.sectionHeader}>Lựa chọn dịch vụ</Text>
      <View style={styles.section}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Danh mục dịch vụ *</Text>
          <View style={styles.servicesList}>
            {SERVICE_TYPES.map(service => renderServiceItem(service))}
          </View>
          {errors.selectedServices && (
            <Text style={styles.errorText}>{errors.selectedServices.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Loại hình dịch vụ *</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.serviceTypeContainer}>
                <TouchableOpacity
                  style={[styles.serviceTypeButton, value === 'onsite' && styles.serviceTypeButtonActive]}
                  onPress={() => onChange('onsite')}
                >
                  <Text style={[styles.serviceTypeText, value === 'onsite' && styles.serviceTypeTextActive]}>
                    Tại trung tâm
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.serviceTypeButton, value === 'mobile' && styles.serviceTypeButtonActive]}
                  onPress={() => onChange('mobile')}
                >
                  <Text style={[styles.serviceTypeText, value === 'mobile' && styles.serviceTypeTextActive]}>
                    Dịch vụ lưu động
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            name="serviceType"
          />
        </View>

        {serviceType === 'onsite' ? (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Địa chỉ trung tâm</Text>
            <View style={styles.addressContainer}>
              <MaterialIcons name="location-on" size={20} color="#666" style={styles.addressIcon} />
              <Text style={styles.addressText}>{SERVICE_CENTER_ADDRESS}</Text>
            </View>
          </View>
        ) : (
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Địa chỉ *</Text>
                <View style={[styles.input, styles.textAreaContainer, errors.address && styles.inputError]}>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Nhập địa chỉ nhận dịch vụ"
                    multiline
                    numberOfLines={3}
                  />
                </View>
                {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
              </View>
            )}
            name="address"
          />
        )}

      <Text style={styles.sectionHeader}>Chi tiết lịch hẹn</Text>
      <View style={styles.section}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ngày giờ hẹn *</Text>
              <TouchableOpacity
                style={[styles.input, styles.dateTimeInput, errors.appointmentDate && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={value ? styles.dateTimeText : styles.placeholderText}>
                  {value ? new Date(value).toLocaleString('vi-VN') : 'Chọn ngày và giờ'}
                </Text>
                <MaterialIcons name="event" size={24} color="#666" />
              </TouchableOpacity>
              {errors.appointmentDate && (
                <Text style={styles.errorText}>{errors.appointmentDate.message}</Text>
              )}
              {showDatePicker && (
                <DateTimePicker
                  value={value || new Date()}
                  mode="datetime"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    // On Android, the picker dismisses automatically
                    if (event.type === 'dismissed') {
                      setShowDatePicker(false);
                      return;
                    }
                    
                    setShowDatePicker(false);
                    if (selectedDate) {
                      onChange(selectedDate);
                    }
                  }}
                />
              )}
            </View>
          )}
          name="appointmentDate"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ghi chú/Thông tin thêm</Text>
              <View style={[styles.input, styles.textAreaContainer]}>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Nhập ghi chú (nếu có)"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
          )}
          name="notes"
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit(onSubmit as any)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>ĐẶT LỊCH NGAY</Text>
        )}
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ...
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 4,
  },
  disabledItem: {
    opacity: 0.5,
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceNameContainer: {
    flex: 1,
    paddingVertical: 4,
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxDisabled: {
    backgroundColor: '#e0e0e0',
    borderColor: '#a0a0a0',
    opacity: 0.6,
  },
  indeterminateLine: {
    width: 12,
    height: 2,
    backgroundColor: 'white',
    borderRadius: 1,
  },
  disabledText: {
    color: '#999',
  },
  durationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },
  serviceCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: '#555',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 5,
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: 'red',
  },
  textInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  servicesList: {
    marginTop: 10,
  },

  serviceName: {
    fontSize: 14,
    color: '#333',
  },
  parentService: {
    fontWeight: 'bold',
  },
  childServices: {
    marginLeft: 16,
  },
  serviceTypeContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
  },
  serviceTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  serviceTypeButtonActive: {
    backgroundColor: '#007AFF',
  },
  serviceTypeText: {
    color: '#666',
    fontWeight: '500',
  },
  serviceTypeTextActive: {
    color: '#fff',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addressIcon: {
    marginRight: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  textAreaContainer: {
    height: 100,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  textArea: {
    height: '100%',
    textAlignVertical: 'top',
  },
  dateTimeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 12,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#84c1ff',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookAppointmentScreen;
