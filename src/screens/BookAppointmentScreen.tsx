import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MaterialIcons } from '@expo/vector-icons';
import {
  getVehicleTypes,
  getServiceTypesByVehicleType,
  createAppointment,
  VehicleTypeResponse,
  ServiceTypeResponse,
} from '../services/api';

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

const SERVICE_CENTER_ADDRESS = '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM';

// Validation schema
const schema = yup.object().shape({
  fullName: yup
    .string()
    .required('Vui lòng nhập họ và tên')
    .matches(/^[\p{L} ]+$/u, 'Tên không được chứa số hoặc ký tự đặc biệt'),
  phoneNumber: yup
    .string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^0[0-9]{9}$/, 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 số')
    .matches(/^\d+$/, 'Chỉ được nhập số'),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ')
    .matches(/@gmail\.com$/, 'Email phải có định dạng @gmail.com'),
  vehicleTypeId: yup.string().required('Vui lòng chọn loại xe'),
  mileage: yup.string()
    .optional()
    .matches(/^[0-9]*$/, 'Số km phải là số'),
  licensePlate: yup
    .string()
    .required('Vui lòng nhập biển số xe')
    .matches(/^[0-9]{2}[A-Za-z][0-9A-Za-z]*-[0-9]{4,5}$/, 'Biển số xe không hợp lệ (VD: 72A-44444 hoặc 30A-12345)'),
  selectedServices: yup
    .array()
    .min(1, 'Vui lòng chọn ít nhất một dịch vụ'),
  serviceType: yup.string().required('Vui lòng chọn loại hình dịch vụ'),
  address: yup.string().when('serviceType', (serviceType, schema) => {
    return serviceType[0] === 'mobile' 
      ? schema.required('Vui lòng nhập địa chỉ gặp nạn')
      : schema;
  }),
  appointmentDate: yup
    .date()
    .required('Vui lòng chọn ngày giờ hẹn')
    .test('is-future', 'Ngày giờ hẹn phải trong tương lai', (value) => {
      if (!value) return false;
      const date = value instanceof Date ? value : new Date(value);
      return date > new Date();
    }),
  notes: yup.string(),
});

const BookAppointmentScreen = () => {
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState<Date>(new Date());
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState('');
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleTypeResponse[]>([]);
  const [isLoadingVehicleTypes, setIsLoadingVehicleTypes] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
    watch,
    trigger,
  } = useForm<BookingFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      vehicleTypeId: '',
      mileage: '',
      licensePlate: '',
      selectedServices: [],
      serviceType: 'onsite',
      address: SERVICE_CENTER_ADDRESS,
      appointmentDate: null,
      notes: '',
    },
  });

  const serviceType = watch('serviceType');
  const watchVehicleType = watch('vehicleTypeId');

  // Clear address when switching to mobile service, set default when switching to onsite
  useEffect(() => {
    if (serviceType === 'mobile') {
      const currentAddress = watch('address');
      if (currentAddress === SERVICE_CENTER_ADDRESS) {
        setValue('address', '', { shouldValidate: false });
      }
    } else if (serviceType === 'onsite') {
      setValue('address', SERVICE_CENTER_ADDRESS, { shouldValidate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType]);

  // Fetch vehicle types on mount
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      setIsLoadingVehicleTypes(true);
      try {
        const response = await getVehicleTypes(0, 100);
        if (response.success && response.data.data) {
          setVehicleTypes(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching vehicle types:', error);
        Alert.alert('Lỗi', 'Không thể tải danh sách loại xe. Vui lòng thử lại sau.');
      } finally {
        setIsLoadingVehicleTypes(false);
      }
    };
    fetchVehicleTypes();
  }, []);

  useEffect(() => {
    const vehicleId = watchVehicleType || '';
    setSelectedVehicleTypeId(vehicleId);
    
    // Clear selected services when vehicle changes
    if (vehicleId) {
      // Fetch services for the selected vehicle
      const fetchServices = async () => {
        setIsLoadingServices(true);
        try {
          const response = await getServiceTypesByVehicleType(vehicleId, 0, 1000, '', true);
          if (response.success && response.data.data) {
            // Map giữ đúng cấu trúc cây (không flatten) để tránh trùng lặp
            const mapTree = (items: ServiceTypeResponse[]): ServiceType[] =>
              items.map(item => ({
                serviceTypeId: item.serviceTypeId,
                serviceName: item.serviceName,
                description: item.description,
                estimatedDurationMinutes: item.estimatedDurationMinutes,
                parentId: item.parentId,
                isActive: item.isActive,
                isDeleted: item.isDeleted,
                children: item.children ? mapTree(item.children) : undefined,
              }));
            setServices(mapTree(response.data.data));
          }
        } catch (error) {
          console.error('Error fetching services:', error);
          Alert.alert('Lỗi', 'Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
          setServices([]);
        } finally {
          setIsLoadingServices(false);
        }
      };
      fetchServices();
    } else {
      // Clear selected services when no vehicle is selected
      setSelectedServices([]);
      setServices([]);
      setValue('selectedServices', [], { shouldValidate: true });
    }
  }, [watchVehicleType, setValue]);

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
  
  const collectDescendants = (s: ServiceType): string[] => {
    const ids: string[] = [];
    const walk = (node?: ServiceType) => {
      if (!node) return;
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          ids.push(child.serviceTypeId);
          walk(child);
        });
      }
    };
    walk(s);
    return ids;
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
    const descendants = collectDescendants(service);
    if (isCurrentlySelected) {
      // Bỏ chọn cha và toàn bộ hậu duệ
      const toRemove = new Set([serviceId, ...descendants]);
      const newSelected = selectedServices.filter(id => !toRemove.has(id));
      setSelectedServices(newSelected);
      setValue('selectedServices', newSelected, { shouldValidate: true });
    } else {
      // Chọn cha và toàn bộ hậu duệ
      const toAdd = [serviceId, ...descendants];
      const merged = Array.from(new Set([...selectedServices, ...toAdd]));
      setSelectedServices(merged);
      setValue('selectedServices', merged, { shouldValidate: true });
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

  const onSubmit: SubmitHandler<BookingFormData> = async (data) => {
    console.log('[BookAppointment] onSubmit called with data:', data);
    // Loading state already set in onPress handler
    try {
      // Map serviceType from 'onsite'/'mobile' to 'AT_CENTER'/'MOBILE'
      const serviceMode = data.serviceType === 'onsite' ? 'AT_CENTER' : 'MOBILE';
      
      // Prepare address - use service center address if onsite, otherwise use user input
      const address = data.serviceType === 'onsite' ? SERVICE_CENTER_ADDRESS : data.address;

      console.log('[BookAppointment] Calling API with payload:', {
        customerFullName: data.fullName,
        customerPhoneNumber: data.phoneNumber,
        customerEmail: data.email,
        vehicleTypeId: data.vehicleTypeId,
        vehicleNumberPlate: data.licensePlate,
        vehicleKmDistances: data.mileage || '0',
        userAddress: address,
        serviceMode,
        scheduledAt: data.appointmentDate!.toISOString(),
        notes: data.notes || '',
        serviceTypeIds: data.selectedServices,
      });

      // Call API
      const response = await createAppointment({
        customerFullName: data.fullName,
        customerPhoneNumber: data.phoneNumber,
        customerEmail: data.email,
        vehicleTypeId: data.vehicleTypeId,
        vehicleNumberPlate: data.licensePlate,
        vehicleKmDistances: data.mileage || '0',
        userAddress: address,
        serviceMode,
        scheduledAt: data.appointmentDate!.toISOString(),
        notes: data.notes || '',
        serviceTypeIds: data.selectedServices,
      });

      if (response.success) {
        Alert.alert(
          'Đặt lịch thành công! ✅',
          `Chúng tôi đã nhận được yêu cầu đặt lịch của bạn.\n\nMã cuộc hẹn: ${response.data}\n\nVui lòng kiểm tra email để xác nhận.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setValue('fullName', '');
                setValue('phoneNumber', '');
                setValue('email', '');
                setValue('vehicleTypeId', '');
                setValue('licensePlate', '');
                setValue('mileage', '');
                setValue('selectedServices', []);
                setValue('serviceType', 'onsite');
                setValue('address', SERVICE_CENTER_ADDRESS);
                setValue('appointmentDate', null);
                setValue('notes', '');
                setSelectedServices([]);
              },
            },
          ]
        );
      } else {
        throw new Error(response.message || 'Không thể tạo cuộc hẹn. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      
      // Xử lý các loại lỗi khác nhau
      let errorMessage = 'Đã có lỗi xảy ra khi đặt lịch. Vui lòng thử lại sau.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.errorCode === 'VALIDATION_ERROR') {
        errorMessage = 'Thông tin không hợp lệ. Vui lòng kiểm tra lại các trường đã nhập.';
      } else if (error.status === 400) {
        errorMessage = 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.';
      } else if (error.status === 500) {
        errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
      }
      
      Alert.alert(
        'Đặt lịch thất bại ❌',
        errorMessage,
        [{ text: 'Đóng', style: 'default' }]
      );
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
                  onBlur={() => {
                    onBlur();
                    trigger('fullName');
                  }}
                  onChangeText={(text) => {
                    onChange(text);
                    if (touchedFields.fullName) {
                      trigger('fullName');
                    }
                  }}
                  value={value}
                  placeholder="Nhập họ và tên"
                />
              </View>
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
              {value && !errors.fullName && <Text style={styles.validText}>✓ Hợp lệ</Text>}
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
                  onBlur={() => {
                    onBlur();
                    trigger('phoneNumber');
                  }}
                  onChangeText={(text) => {
                    // Only allow numbers
                    const numericValue = text.replace(/[^0-9]/g, '');
                    onChange(numericValue);
                    if (touchedFields.phoneNumber) {
                      trigger('phoneNumber');
                    }
                  }}
                  value={value}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              {errors.phoneNumber ? (
                <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
              ) : value ? (
                <Text style={styles.validText}>
                  {value.length === 10 ? '✓ Số điện thoại hợp lệ' : `${value.length}/10 số`}
                </Text>
              ) : null}
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
                  onBlur={() => {
                    onBlur();
                    trigger('email');
                  }}
                  onChangeText={(text) => {
                    onChange(text);
                    if (touchedFields.email) {
                      trigger('email');
                    }
                  }}
                  value={value}
                  placeholder="Nhập email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              ) : value && value.endsWith('@gmail.com') ? (
                <Text style={styles.validText}>✓ Email hợp lệ</Text>
              ) : value ? (
                <Text style={styles.hintText}>Vui lòng nhập địa chỉ @gmail.com</Text>
              ) : null}
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
                {isLoadingVehicleTypes ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#007AFF" />
                    <Text style={styles.loadingText}>Đang tải...</Text>
                  </View>
                ) : (
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Chọn loại xe" value="" />
                    {vehicleTypes.map(vehicle => (
                      <Picker.Item
                        key={vehicle.vehicleTypeId}
                        label={`${vehicle.manufacturer || ''} ${vehicle.vehicleTypeName}${vehicle.modelYear ? ` (${vehicle.modelYear})` : ''}`}
                        value={vehicle.vehicleTypeId}
                      />
                    ))}
                  </Picker>
                )}
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
          {isLoadingServices ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>Đang tải dịch vụ...</Text>
            </View>
          ) : services.length === 0 && selectedVehicleTypeId ? (
            <Text style={styles.emptyText}>Không có dịch vụ nào cho loại xe này</Text>
          ) : (
            <View style={styles.servicesList}>
              {services.map(service => renderServiceItem(service))}
            </View>
          )}
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
                onPress={() => {
                  const currentDate = value || new Date();
                  setDatePickerValue(currentDate instanceof Date ? currentDate : new Date(currentDate));
                  setShowDatePicker(true);
                }}
              >
                <Text style={value ? styles.dateTimeText : styles.placeholderText}>
                  {value ? new Date(value).toLocaleString('vi-VN') : 'Chọn ngày và giờ'}
                </Text>
                <MaterialIcons name="event" size={24} color="#666" />
              </TouchableOpacity>
              {errors.appointmentDate && (
                <Text style={styles.errorText}>{errors.appointmentDate.message}</Text>
              )}
              <DateTimePickerModal
                isVisible={showDatePicker}
                mode="datetime"
                date={datePickerValue}
                minimumDate={new Date()}
                onConfirm={(selectedDate) => {
                  onChange(selectedDate);
                  setShowDatePicker(false);
                }}
                onCancel={() => {
                  setShowDatePicker(false);
                }}
                locale="vi_VN"
              />
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
        onPress={async () => {
          // Prevent double/triple submission - check FIRST
          if (loading) {
            console.log('[BookAppointment] Already submitting, ignoring...');
            return;
          }

          // Set loading state IMMEDIATELY to prevent double submission
          setLoading(true);

          console.log('[BookAppointment] Submit button pressed');
          const formValues = watch();
          console.log('[BookAppointment] Form values:', formValues);
          console.log('[BookAppointment] Form errors:', errors);
          
          try {
            // Validate manually
            await schema.validate(formValues, { abortEarly: false });
            console.log('[BookAppointment] Manual validation passed');
            // If manual validation passes, call onSubmit directly
            await onSubmit(formValues as BookingFormData);
          } catch (validationError: any) {
            console.log('[BookAppointment] Manual validation failed:', validationError);
            // Reset loading on validation error so user can try again
            setLoading(false);
            
            if (validationError.errors) {
              Alert.alert(
                'Thông tin chưa hợp lệ',
                validationError.errors.join('\n'),
                [{ text: 'OK' }]
              );
            } else {
              // Fallback to handleSubmit
              console.log('[BookAppointment] Falling back to handleSubmit...');
              handleSubmit(
                (data) => {
                  console.log('[BookAppointment] ✅ Validation passed, calling onSubmit');
                  const formData: BookingFormData = {
                    fullName: data.fullName,
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    vehicleTypeId: data.vehicleTypeId,
                    mileage: data.mileage,
                    licensePlate: data.licensePlate,
                    selectedServices: data.selectedServices || [],
                    serviceType: data.serviceType as 'onsite' | 'mobile',
                    address: data.address,
                    appointmentDate: data.appointmentDate,
                    notes: data.notes
                  };
                  return onSubmit(formData);
                },
                (validationErrors) => {
                  console.log('[BookAppointment] ❌ Validation failed:', JSON.stringify(validationErrors, null, 2));
                  const errorMessages = Object.values(validationErrors)
                    .map((err: any) => err?.message)
                    .filter(Boolean)
                    .join('\n');
                  
                  console.log('[BookAppointment] Error messages:', errorMessages);
                  
                  Alert.alert(
                    'Thông tin chưa hợp lệ',
                    errorMessages || 'Vui lòng kiểm tra và điền đầy đủ các trường bắt buộc.',
                    [{ text: 'OK' }]
                  );
                }
              )();
            }
          }
        }}
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
  servicesList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    maxHeight: 200,
    overflow: 'hidden',
  },
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
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  validText: {
    color: '#34C759',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  hintText: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    padding: 20,
    fontStyle: 'italic',
  },
  iosPickerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  iosPickerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iosPickerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookAppointmentScreen;
