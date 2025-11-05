import { Platform } from 'react-native';

// API Base URL - Load from environment variable
// Set EXPO_PUBLIC_API_BASE_URL in your .env file
// Examples:
//   Android Emulator: EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000/api/v1
//   iOS Simulator: EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
//   Physical Device: EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:3000/api/v1
const getApiBaseUrl = (): string => {
  // Priority 1: Environment variable (recommended)
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  
  // Priority 2: Auto-detect based on platform (fallback)
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return 'http://10.0.2.2:3000/api/v1';
  } else if (Platform.OS === 'ios') {
    // iOS simulator can use localhost
    return 'http://localhost:3000/api/v1';
  }
  
  // Default fallback
  return 'http://10.0.2.2:3000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();
console.log(`[API Config] Platform: ${Platform.OS}, Base URL: ${API_BASE_URL}`);
console.log(`[API Config] Using .env: ${process.env.EXPO_PUBLIC_API_BASE_URL ? 'YES' : 'NO (using fallback)'}`);

// ============ TYPES ============

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
  createdBy?: string;
  updatedBy?: string;
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

// ============ API FUNCTIONS ============

// Auth token & userId (simple in-memory)
let AUTH_TOKEN: string | null = null;
let AUTH_USER_ID: string | null = null;
export const setAuthToken = (token: string | null) => {
  AUTH_TOKEN = token;
};
export const setAuthUserId = (userId: string | null) => {
  AUTH_USER_ID = userId;
};
export const getAuthUserId = () => AUTH_USER_ID;
export const clearAuth = () => {
  AUTH_TOKEN = null;
  AUTH_USER_ID = null;
};

const withAuthHeaders = (extra: Record<string, string> = {}) => ({
  'Content-Type': 'application/json',
  ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
  ...extra,
});

/**
 * GET /api/v1/vehicle-type
 * Lấy danh sách loại xe (phân trang, tìm kiếm)
 */
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
  
  const url = `${API_BASE_URL}/vehicle-type?${params}`;
  console.log('Fetching vehicle types from:', url);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: withAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error: any) {
    console.error('getVehicleTypes error:', error);
    if (error.message === 'Network request failed' || error.message?.includes('Network')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy và API URL đúng.');
    }
    throw error;
  }
};

/**
 * GET /api/v1/appointment/service-mode
 * Lấy danh sách Service Mode enum
 */
export const getServiceModes = async (): Promise<ApiResponse<string[]>> => {
  const response = await fetch(`${API_BASE_URL}/appointment/service-mode`, {
    headers: withAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * GET /api/v1/service-type/vehicle_type/:vehicleTypeId
 * Lấy danh sách dịch vụ theo loại xe (cấu trúc cây)
 */
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
    `${API_BASE_URL}/service-type/vehicle_type/${vehicleTypeId}?${params}`,
    { headers: withAuthHeaders() }
  );
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * POST /api/v1/appointment
 * Tạo cuộc hẹn mới
 */
export const createAppointment = async (
  data: CreateAppointmentRequest
): Promise<ApiResponse<string>> => {
  const url = `${API_BASE_URL}/appointment`;
  console.log('[API] ============================================');
  console.log('[API] createAppointment - URL:', url);
  console.log('[API] createAppointment - Payload:', JSON.stringify(data, null, 2));
  console.log('[API] API_BASE_URL:', API_BASE_URL);
  console.log('[API] process.env.EXPO_PUBLIC_API_BASE_URL:', process.env.EXPO_PUBLIC_API_BASE_URL);
  console.log('[API] ============================================');
  
  try {
    console.log('[API] Sending fetch request...');
    const response = await fetch(url, {
      method: 'POST',
      headers: withAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    console.log('[API] Response received - Status:', response.status);
    console.log('[API] Response OK:', response.ok);
    
    const responseData = await response.json();
    console.log('[API] Response data:', responseData);
  
  if (!response.ok) {
      // Backend trả về format: { success: false, message, errorCode }
      const errorMessage = responseData.message || `Lỗi ${response.status}: Không thể tạo cuộc hẹn`;
      const error = new Error(errorMessage);
      (error as any).errorCode = responseData.errorCode;
      (error as any).status = response.status;
      throw error;
  }
  
    return responseData;
  } catch (error: any) {
    // Nếu là network error hoặc lỗi khác
    if (error.message === 'Network request failed' || error.message?.includes('Network')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy và API URL đúng.');
    }
    throw error;
  }
};

/**
 * GET /api/v1/appointment/history
 * Lấy lịch sử đặt lịch của user hiện tại (JWT)
 */
export interface AppointmentHistoryItem {
  appointmentId: string;
  customerFullName: string;
  customerPhoneNumber: string;
  customerEmail: string;
  vehicleTypeId: string;
  vehicleTypeName?: string;
  vehicleNumberPlate: string;
  serviceMode: 'AT_CENTER' | 'MOBILE';
  scheduledAt: string;
  status: string;
}

export const getBookingHistory = async (
  page = 0,
  pageSize = 10
): Promise<ApiResponse<{ items: AppointmentHistoryItem[]; page: number; pageSize: number; total: number }>> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  const url = `${API_BASE_URL}/appointment/history?${params.toString()}`;
  const response = await fetch(url, { headers: withAuthHeaders() });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * POST /api/v1/auth/login
 */
export const login = async (
  email: string,
  password: string
): Promise<ApiResponse<{ authenticated: boolean; token: string; refreshToken: string; isAdmin: boolean; userId?: string }>> => {
  const url = `${API_BASE_URL}/auth/login`;
  const response = await fetch(url, {
    method: 'POST',
    headers: withAuthHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message || `HTTP error! status: ${response.status}`);
  }
  if (json?.data?.token) setAuthToken(json.data.token);
  if (json?.data?.userId) setAuthUserId(json.data.userId);
  return json;
};

/**
 * POST /api/v1/auth/logout
 */
export const logout = async (
  userId: string
): Promise<ApiResponse<string>> => {
  const url = `${API_BASE_URL}/auth/logout`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: withAuthHeaders(),
    body: JSON.stringify({ userId }),
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json.message || `HTTP ${resp.status}`);
  return json;
};

/**
 * PATCH /api/v1/auth/change-password
 */
export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<ApiResponse<string>> => {
  const url = `${API_BASE_URL}/auth/change-password`;
  const resp = await fetch(url, {
    method: 'PATCH',
    headers: withAuthHeaders(),
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json.message || `HTTP ${resp.status}`);
  return json;
};

/**
 * PATCH /api/v1/user/profile/:id
 */
export const updateUserProfile = async (
  id: string,
  payload: { email?: string; fullName?: string; numberPhone?: string; address?: string; avatarUrl?: string }
): Promise<ApiResponse<{ userId: string; email: string; fullName: string; numberPhone?: string; address?: string; avatarUrl?: string }>> => {
  const url = `${API_BASE_URL}/user/profile/${id}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: withAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message || `HTTP error! status: ${response.status}`);
  }
  return json;
};

/**
 * GET /api/v1/user/profile/:id
 */
export const getUserProfile = async (
  id: string
): Promise<ApiResponse<{ userId: string; email: string; fullName: string; numberPhone?: string; address?: string; avatarUrl?: string }>> => {
  const url = `${API_BASE_URL}/user/profile/${id}`;
  const response = await fetch(url, { headers: withAuthHeaders() });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message || `HTTP error! status: ${response.status}`);
  }
  return json;
};

/**
 * POST /api/v1/auth/register
 */
export const register = async (
  fullName: string,
  email: string,
  password: string,
  numberPhone?: string
): Promise<ApiResponse<{ userId: string; email: string; fullName: string; token: string; refreshToken: string }>> => {
  const url = `${API_BASE_URL}/auth/register`;
  const username = email.split('@')[0];
  const response = await fetch(url, {
    method: 'POST',
    headers: withAuthHeaders(),
    body: JSON.stringify({ username, password, email, fullName, numberPhone, provider: 'local' }),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message || `HTTP error! status: ${response.status}`);
  }
  if (json?.data?.token) setAuthToken(json.data.token);
  return json;
};

// (removed duplicate changePassword definition)

/**
 * GET /api/v1/appointment/:id
 */
export const getBookingDetail = async (
  appointmentId: string
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}/appointment/${appointmentId}`;
  const response = await fetch(url, { headers: withAuthHeaders() });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message || `HTTP error! status: ${response.status}`);
  }
  return json;
};
