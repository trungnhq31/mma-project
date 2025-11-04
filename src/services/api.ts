const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

export interface VehicleTypeResponse {
  vehicleTypeId: string;
  vehicleTypeName: string;
  manufacturer?: string;
  modelYear?: number;
  batteryCapacity?: number;
  maintenanceIntervalKm?: number;
  maintenanceIntervalMonths?: number;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceTypeResponse {
  serviceTypeId: string;
  serviceName: string;
  description?: string;
  estimatedDurationMinutes?: number;
  parentId: string | null;
  vehicleTypeId: string;
  isActive: boolean;
  isDeleted: boolean;
  children?: ServiceTypeResponse[];
  serviceTypeVehiclePartResponses?: any[];
  vehicleTypeResponse?: VehicleTypeResponse;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  errorCode: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Vehicle Types API
export const getVehicleTypes = async (
  page = 0,
  pageSize = 100,
  keyword = ''
): Promise<ApiResponse<PaginatedResponse<VehicleTypeResponse>>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(keyword && { keyword }),
  });
  const response = await fetch(`${API_BASE_URL}/vehicle-type?${params}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Service Modes API
export const getServiceModes = async (): Promise<ApiResponse<string[]>> => {
  const response = await fetch(`${API_BASE_URL}/appointment/service-mode`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Service Types API
export const getServiceTypesByVehicleType = async (
  vehicleTypeId: string,
  page = 0,
  pageSize = 1000,
  keyword = '',
  isActive = true
): Promise<ApiResponse<PaginatedResponse<ServiceTypeResponse>>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    isActive: isActive.toString(),
    ...(keyword && { keyword }),
  });
  const response = await fetch(
    `${API_BASE_URL}/service-type/vehicle_type/${vehicleTypeId}?${params}`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Create Appointment API
export interface CreateAppointmentRequest {
  customerId?: string;
  customerFullName: string;
  customerPhoneNumber: string;
  customerEmail: string;
  vehicleTypeId: string;
  vehicleNumberPlate: string;
  vehicleKmDistances: string;
  userAddress: string;
  serviceMode: 'AT_CENTER' | 'MOBILE';
  scheduledAt: string; // ISO date string
  notes?: string;
  serviceTypeIds: string[];
}

export const createAppointment = async (
  data: CreateAppointmentRequest
): Promise<ApiResponse<string>> => {
  const response = await fetch(`${API_BASE_URL}/appointment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

