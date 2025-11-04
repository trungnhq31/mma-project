export type RootStackParamList = {
  Home: undefined;
  Appointments: undefined;
  Vehicles: undefined;
  Support: undefined;
  BookAppointment: undefined;
};

export type TabIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

export type Vehicle = {
  id: string;
  model: string;
  batteryLevel: number;
  lastCharge: string;
  image?: string;
};

export type Appointment = {
  id: string;
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

export type VehicleType = {
  vehicleTypeId: string;
  vehicleTypeName: string;
  manufacturer: string;
  modelYear: string;
};

export type ServiceType = {
  serviceTypeId: string;
  serviceName: string;
  description?: string;
  children?: ServiceType[];
};

export type BookingFormData = {
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
