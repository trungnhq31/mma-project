import 'dotenv/config';
import { connectMongo } from '../config/database';
import { VehicleTypeModel, ServiceTypeModel } from '../models/mongoose';

async function run() {
  try {
    await connectMongo();

    const vt1 =
      (await VehicleTypeModel.findOne({ vehicleTypeName: 'Tesla Model 3' })) ||
      (await VehicleTypeModel.create({
        vehicleTypeName: 'Tesla Model 3',
        manufacturer: 'Tesla',
        modelYear: 2024,
        batteryCapacity: 82,
        maintenanceIntervalKm: 15000,
        maintenanceIntervalMonths: 12,
        description: 'Popular EV sedan',
        isActive: true,
        isDeleted: false,
      }));

    const vt2 =
      (await VehicleTypeModel.findOne({ vehicleTypeName: 'VinFast VF 8' })) ||
      (await VehicleTypeModel.create({
        vehicleTypeName: 'VinFast VF 8',
        manufacturer: 'VinFast',
        modelYear: 2024,
        batteryCapacity: 90,
        maintenanceIntervalKm: 12000,
        maintenanceIntervalMonths: 12,
        description: 'Vietnam EV SUV',
        isActive: true,
        isDeleted: false,
      }));

    // Service types for vt1
    const inspection =
      (await ServiceTypeModel.findOne({ serviceName: 'Kiểm tra tổng quát', vehicleTypeId: vt1._id })) ||
      (await ServiceTypeModel.create({ serviceName: 'Kiểm tra tổng quát', vehicleTypeId: vt1._id, isActive: true, isDeleted: false }));

    const battery =
      (await ServiceTypeModel.findOne({ serviceName: 'Bảo dưỡng pin', vehicleTypeId: vt1._id })) ||
      (await ServiceTypeModel.create({ serviceName: 'Bảo dưỡng pin', vehicleTypeId: vt1._id, isActive: true, isDeleted: false }));

    await ServiceTypeModel.updateOne(
      { serviceName: 'Kiểm tra hệ thống làm mát', vehicleTypeId: vt1._id, parentId: inspection._id },
      {
        $setOnInsert: {
          serviceName: 'Kiểm tra hệ thống làm mát',
          vehicleTypeId: vt1._id,
          parentId: inspection._id,
          estimatedDurationMinutes: 30,
          isActive: true,
          isDeleted: false,
        },
      },
      { upsert: true }
    );

    await ServiceTypeModel.updateOne(
      { serviceName: 'Kiểm tra điện áp cao', vehicleTypeId: vt1._id, parentId: inspection._id },
      {
        $setOnInsert: {
          serviceName: 'Kiểm tra điện áp cao',
          vehicleTypeId: vt1._id,
          parentId: inspection._id,
          estimatedDurationMinutes: 45,
          isActive: true,
          isDeleted: false,
        },
      },
      { upsert: true }
    );

    await ServiceTypeModel.updateOne(
      { serviceName: 'Kiểm tra tình trạng pin', vehicleTypeId: vt1._id, parentId: battery._id },
      {
        $setOnInsert: {
          serviceName: 'Kiểm tra tình trạng pin',
          vehicleTypeId: vt1._id,
          parentId: battery._id,
          estimatedDurationMinutes: 40,
          isActive: true,
          isDeleted: false,
        },
      },
      { upsert: true }
    );

    // Service types for vt2 (simple)
    await ServiceTypeModel.updateOne(
      { serviceName: 'Kiểm tra tổng quát', vehicleTypeId: vt2._id },
      { $setOnInsert: { serviceName: 'Kiểm tra tổng quát', vehicleTypeId: vt2._id, isActive: true, isDeleted: false } },
      { upsert: true }
    );

    console.log('Seed completed');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();


