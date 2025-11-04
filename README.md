# EVCare Backend API

Backend API cho hệ thống quản lý bảo dưỡng và dịch vụ xe điện - EVCare

## Tech Stack

- **Node.js** v20+
- **TypeScript**
- **Express.js**
- **MongoDB** + **Mongoose**
- **Winston** (Logging)
- **Express Validator** (Validation)

## Setup

### 1. Clone repository

```bash
git clone https://github.com/TuanNguyen212204/SDN-GroupProject-Backend.git
cd SDN-GroupProject-Backend
```

### 2. Cài đặt dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Tạo file `.env`

Tạo file `.env` trong thư mục gốc:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/evcare_db
JWT_SECRET=your_very_secure_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret
```

### 4. Seed dữ liệu mẫu

```bash
npm run seed
```

### 5. Chạy server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

### 1. GET `/vehicle-type`
Lấy danh sách loại xe (phân trang, tìm kiếm)

**Query Parameters:**
- `page` (number, default: 0)
- `pageSize` (number, default: 10)
- `keyword` (string, optional)

### 2. GET `/appointment/service-mode`
Lấy danh sách Service Mode enum

**Response:**
```json
{
  "success": true,
  "data": ["AT_CENTER", "MOBILE"],
  ...
}
```

### 3. GET `/service-type/vehicle_type/:vehicleTypeId`
Lấy danh sách dịch vụ theo loại xe (cấu trúc cây)

**Path Parameters:**
- `vehicleTypeId` (string, required) - MongoDB ObjectId

**Query Parameters:**
- `page` (number, default: 0)
- `pageSize` (number, default: 10)
- `keyword` (string, optional)
- `isActive` (boolean, default: true)

### 4. POST `/appointment`
Tạo cuộc hẹn mới

**Request Body:**
```json
{
  "customerFullName": "string",
  "customerPhoneNumber": "string",
  "customerEmail": "string",
  "vehicleTypeId": "string (MongoDB ObjectId)",
  "vehicleNumberPlate": "string",
  "vehicleKmDistances": "string",
  "userAddress": "string",
  "serviceMode": "AT_CENTER | MOBILE",
  "scheduledAt": "2025-12-01T10:00:00.000Z (ISO date)",
  "notes": "string (optional)",
  "serviceTypeIds": ["string (MongoDB ObjectId)"],
  "customerId": "string (optional)"
}
```

## Scripts

- `npm run dev` - Chạy development server (auto-reload)
- `npm run build` - Build TypeScript → JavaScript
- `npm start` - Chạy production server
- `npm run seed` - Seed dữ liệu mẫu vào MongoDB
- `npm run lint` - Lint code
- `npm run format` - Format code với Prettier

## Cấu trúc Project

```
src/
├── server.ts              # Entry point
├── config/               # Configuration (database, etc.)
├── controllers/          # Request handlers
├── services/             # Business logic
├── models/               # MongoDB models (Mongoose)
├── routes/               # API routes
├── validations/          # Request validators
├── middlewares/          # Express middlewares
├── utils/                # Utilities (logger, response)
└── seeds/                # Seed scripts
```

## Database Models

- **VehicleType**: Loại xe điện
- **ServiceType**: Loại dịch vụ (có cấu trúc cây với parent-child)
- **Appointment**: Cuộc hẹn bảo dưỡng

## Response Format

Tất cả API responses đều theo format:

```json
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-04T...",
  "errorCode": null
}
```

## Lưu ý

- MongoDB phải đang chạy trước khi start server
- Đảm bảo file `.env` có đúng cấu hình
- Port mặc định: 3000 (có thể thay đổi trong `.env`)

## Author

SDN302 Group Project - FPT University
