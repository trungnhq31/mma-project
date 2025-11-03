## MmaProject — React Native App (VN)

Ứng dụng React Native khởi tạo bằng `@react-native-community/cli`. App đã cấu hình điều hướng (React Navigation) và 4 màn hình tham khảo từ client EVCare: `Home`, `Appointments`, `Vehicles`, `Support` (tham chiếu: [`evcare` client](https://evcare.vercel.app/client)).

### Yêu cầu môi trường
- Node.js >= 20
- Android Studio (Android SDK, Platform-Tools, Emulator)
- JDK 17 (đi kèm Android Studio)

Thiết lập biến môi trường (Windows):
- `ANDROID_HOME` → `C:\Users\<USERNAME>\AppData\Local\Android\Sdk`
- Thêm vào `PATH`: `%ANDROID_HOME%\platform-tools`, `%ANDROID_HOME%\emulator`

Kiểm tra nhanh:
```bash
adb --version
emulator -version
```

### Cài đặt dependencies
```bash
npm install
```

### Chạy app trên Android Emulator
1) Mở Android Studio > Device Manager > tạo AVD (vd: Pixel 6, Android 14/15) rồi Start
2) Tại thư mục dự án:
```bash
npm run android
# hoặc chạy Metro riêng
npm start
# cửa sổ khác
npx react-native run-android
```

### Chạy trên iOS (chỉ macOS)
```bash
npm run ios
```

### Chạy test (Jest)
```bash
npm test
# watch mode
npm test -- --watch
# coverage
npm test -- --coverage
```

### Scripts hữu ích
- `npm start`: chạy Metro bundler
- `npm run android`: build & cài app lên emulator/device Android
- `npm run ios`: chạy iOS simulator (macOS)
- `npm test`: chạy Jest test
- `npm run lint`: ESLint

### Cấu trúc thư mục chính
```
MmaProject/
  src/
    screens/
      HomeScreen.tsx
      AppointmentsScreen.tsx
      VehiclesScreen.tsx
      SupportScreen.tsx
  App.tsx
  android/
  ios/
```

### Điều hướng
- `App.tsx` cấu hình `NavigationContainer` + `Native Stack`
- `HomeTabs`: `createBottomTabNavigator` với 4 tab: Home, Appointments, Vehicles, Support

### Các màn hình đã có
- Home: thẻ thống kê nhanh, hành động nhanh
- Appointments: danh sách lịch hẹn + trạng thái
- Vehicles: thông tin xe, pin, tầm hoạt động
- Support: FAQ + liên hệ hỗ trợ

### Khắc phục sự cố nhanh
- SDK not found: kiểm tra `ANDROID_HOME` và `PATH`
- Không thấy emulator: mở AVD trong Android Studio hoặc `emulator -avd <Tên_AVD>`
- Lỗi Gradle/build:
```bash
cd android && gradlew.bat clean && cd ..
npx react-native run-android
```
- Reset cache Metro:
```bash
npx react-native start --reset-cache
```
- Nhiều thiết bị cùng lúc:
```bash
adb devices
npx react-native run-android --deviceId <id>
```

### Ghi chú
- Dự án dùng TypeScript, Jest, ESLint
- Cảm hứng UI từ trang client: [`evcare`](https://evcare.vercel.app/client)
