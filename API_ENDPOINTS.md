# EVCare Backend API Endpoints

Base URL: `http://localhost:3000/api/v1`

## 1. GET /vehicle-type
**Lấy danh sách loại xe (phân trang, tìm kiếm)**

**Query Parameters:**
- `page` (number, default: 0)
- `pageSize` (number, default: 10)
- `keyword` (string, optional) - Tìm kiếm theo tên, nhà sản xuất, mô tả

**Response:**
```json
{
  "success": true,
  "message": "Vehicle types retrieved successfully",
  "data": {
    "data": [
      {
        "vehicleTypeId": "string",
        "vehicleTypeName": "string",
        "manufacturer": "string",
        "modelYear": 0,
        "batteryCapacity": 0,
        "maintenanceIntervalKm": 0,
        "maintenanceIntervalMonths": 0,
        "description": "string",
        "isActive": true,
        "isDeleted": false,
        "createdAt": "2025-11-04T...",
        "updatedAt": "2025-11-04T...",
        "createdBy": "string",
        "updatedBy": "string"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 0,
    "totalPages": 0,
    "last": true
  },
  "timestamp": "2025-11-04T...",
  "errorCode": null
}
```

---

## 2. GET /appointment/service-mode
**Lấy danh sách Service Mode enum**

**Response:**
```json
{
  "success": true,
  "message": "Service modes retrieved",
  "data": ["AT_CENTER", "MOBILE"],
  "timestamp": "2025-11-04T...",
  "errorCode": null
}
```

---

## 3. GET /service-type/vehicle_type/:vehicleTypeId
**Lấy danh sách dịch vụ theo loại xe (cấu trúc cây)**

**Path Parameters:**
- `vehicleTypeId` (string, required) - MongoDB ObjectId

**Query Parameters:**
- `page` (number, default: 0)
- `pageSize` (number, default: 10)
- `keyword` (string, optional)
- `isActive` (boolean, default: true)

**Response:**
```json
{
  "success": true,
  "message": "Service types retrieved successfully",
  "data": {
    "data": [
      {
        "serviceTypeId": "string",
        "serviceName": "string",
        "description": "string",
        "estimatedDurationMinutes": 0,
        "parentId": "string | null",
        "vehicleTypeId": "string",
        "vehicleTypeResponse": {
          "vehicleTypeId": "string",
          "vehicleTypeName": "string",
          ...
        },
        "isActive": true,
        "isDeleted": false,
        "children": [...],
        "serviceTypeVehiclePartResponses": []
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 0,
    "totalPages": 0,
    "last": true
  },
  "timestamp": "2025-11-04T...",
  "errorCode": null
}
```

---

## 4. POST /appointment
**Tạo cuộc hẹn mới**

**Request Body:**
```json
{
  "customerId": "string (optional)",
  "customerFullName": "string",
  "customerPhoneNumber": "string",
  "customerEmail": "string",
  "vehicleTypeId": "string (MongoDB ObjectId)",
  "vehicleNumberPlate": "string",
  "vehicleKmDistances": "string",
  "userAddress": "string",
  "serviceMode": "AT_CENTER | MOBILE",
  "scheduledAt": "2025-12-01T10:00:00.000Z (ISO date string)",
  "notes": "string (optional)",
  "serviceTypeIds": ["string (MongoDB ObjectId)"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment created",
  "data": "appointment-id (MongoDB ObjectId)",
  "timestamp": "2025-11-04T...",
  "errorCode": null
}
```

---

## Lỗi thường gặp:

1. **ECONNREFUSED 127.0.0.1:3000**
   - Backend chưa chạy → Chạy `npm run dev` ở nhánh BE-se183262
   - MongoDB chưa chạy → Khởi động MongoDB

2. **Validation Error**
   - Kiểm tra `vehicleTypeId` là MongoDB ObjectId hợp lệ (24 hex chars)
   - Kiểm tra `serviceMode` là "AT_CENTER" hoặc "MOBILE"
   - Kiểm tra `scheduledAt` là ISO date string

3. **Database connection failed**
   - Kiểm tra MongoDB đang chạy
   - Kiểm tra `MONGO_URI` trong file `.env`

