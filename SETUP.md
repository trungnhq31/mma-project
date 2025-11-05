# Hướng dẫn Setup và Chạy Dự án EVCare

## Cấu trúc Nhánh

- **BE-se183262**: Backend only (Node.js + Express + MongoDB)
- **feature/booking-management**: Frontend only (React Native + Expo)

## Cách chạy Backend

### Terminal 1:
```powershell
# Chuyển sang nhánh backend
git checkout BE-se183262

# Cài dependencies
npm install --legacy-peer-deps

# Tạo file .env (nếu chưa có)
# Nội dung:
# PORT=3000
# NODE_ENV=development
# MONGO_URI=mongodb://127.0.0.1:27017/evcare_db
# JWT_SECRET=your_very_secure_secret_key_here
# JWT_REFRESH_SECRET=your_refresh_secret
# SEPAY_API_KEY=your_sepay_api_key
# PAYMENT_BANK_NAME=Vietcombank
# PAYMENT_ACCOUNT_NUMBER=0010000000355

# Seed dữ liệu (lần đầu)
npm run seed

# Chạy backend
npm run dev
```

**Kiểm tra:** `http://localhost:3000/api/v1/appointment/service-mode`

### Webhook SePay
- Endpoint: `POST http://localhost:3000/api/v1/payment/webhook`
- Header: `Authorization: Apikey <SEPAY_API_KEY>` (nếu set trong `.env`)
- Body: JSON theo tài liệu SePay. Server phản hồi `{ "success": true }` với HTTP 201 khi thành công.
- Tham chiếu: [SePay Webhooks](https://docs.sepay.vn/tich-hop-webhooks.html)

### Tạo QR Payment (client gọi)
- Endpoint: `POST http://localhost:3000/api/v1/payment/create-qr`
- Body:
  ```json
  {
    "amount": 2277000,
    "description": "Thanh toan don #1234",
    "bank": "Vietcombank",            // optional, default từ .env
    "accountNumber": "0010000000355", // optional, default từ .env
    "referenceId": "ORDER_1234"       // optional
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "data": {
      "qrUrl": "https://qr.sepay.vn/img?acc=...&bank=...&amount=...&des=...",
      "amount": 2277000,
      "bank": "Vietcombank",
      "accountNumber": "0010000000355",
      "content": "Thanh toan don #1234 CODE:ABCD123456",
      "code": "ABCD123456"
    }
  }
  ```
- Lưu ý: Mã `code` sẽ được chèn vào nội dung chuyển khoản để đối soát khi nhận webhook.

---

## Cách chạy Frontend

### Terminal 2 (mở terminal mới):
```powershell
# Chuyển sang nhánh frontend
git checkout feature/booking-management

# Cài dependencies
npm install

# Chạy Expo
npm run expo:start
# hoặc
npm start
```

---

## Lưu ý quan trọng

### 1. Dependencies khác nhau
- **Backend nhánh:** có Express, Mongoose, Sequelize, etc.
- **Frontend nhánh:** có React Native, Expo, etc.
- **Giải pháp:** Mỗi lần chuyển nhánh → chạy `npm install` lại

### 2. MongoDB phải đang chạy
- Kiểm tra MongoDB service đang active
- Hoặc chạy `mongod` nếu cài local

### 3. File .env
- Backend cần `.env` (không commit vào git)
- Frontend KHÔNG cần `.env` nếu chạy trên emulator
- Frontend CẦN `.env` nếu test trên thiết bị thật:
  ```
  EXPO_PUBLIC_API_BASE_URL=http://<IP-MÁY-TÍNH>:3000/api/v1
  ```

### 4. Port
- Backend: `http://localhost:3000`
- Frontend API: mặc định `http://localhost:3000/api/v1` (trong `src/services/api.ts`)

---

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

1. **GET** `/vehicle-type` - Lấy danh sách loại xe
2. **GET** `/appointment/service-mode` - Lấy enum service mode
3. **GET** `/service-type/vehicle_type/:vehicleTypeId` - Lấy dịch vụ theo loại xe
4. **POST** `/appointment` - Tạo cuộc hẹn mới

---

## Troubleshooting

### Backend không chạy:
- ✅ Kiểm tra MongoDB đang chạy
- ✅ Kiểm tra file `.env` có đúng
- ✅ Xem log trong terminal

### Frontend không connect được backend:
- ✅ Kiểm tra backend đang chạy: `http://localhost:3000/api/v1/appointment/service-mode`
- ✅ Nếu test trên thiết bị thật: cập nhật API base URL trong `src/services/api.ts`

### Lỗi dependencies:
- ✅ Xóa `node_modules` và `package-lock.json`
- ✅ Chạy `npm install` lại (Backend: `npm install --legacy-peer-deps`)

---

## Workflow Development

1. **Backend:** Làm việc trên nhánh `BE-se183262`
2. **Frontend:** Làm việc trên nhánh `feature/booking-management`
3. **API Integration:** Frontend gọi API qua `src/services/api.ts`
4. **Test:** Dùng Postman test API, dùng Expo test UI

---

## Commit và Push

### Backend:
```powershell
git checkout BE-se183262
git add .
git commit -m "feat: your message"
git push origin BE-se183262
```

### Frontend:
```powershell
git checkout feature/booking-management
git add .
git commit -m "feat: your message"
git push origin feature/booking-management
```

