import 'dotenv/config';
import { sequelize } from '../config/database';
import { VehicleType, ServiceType } from '../models';

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const [vt1] = await VehicleType.findOrCreate({
      where: { vehicleTypeName: 'Tesla Model 3' },
      defaults: {
        vehicleTypeName: 'Tesla Model 3',
        manufacturer: 'Tesla',
        modelYear: 2024,
        batteryCapacity: 82,
        maintenanceIntervalKm: 15000,
        maintenanceIntervalMonths: 12,
        description: 'Popular EV sedan',
        isActive: true,
        isDeleted: false,
      },
    });

    const [vt2] = await VehicleType.findOrCreate({
      where: { vehicleTypeName: 'VinFast VF 8' },
      defaults: {
        vehicleTypeName: 'VinFast VF 8',
        manufacturer: 'VinFast',
        modelYear: 2024,
        batteryCapacity: 90,
        maintenanceIntervalKm: 12000,
        maintenanceIntervalMonths: 12,
        description: 'Vietnam EV SUV',
        isActive: true,
        isDeleted: false,
      },
    });

    // Service types for vt1
    const inspection = await ServiceType.findOrCreate({
      where: { serviceName: 'General Inspection', vehicleTypeId: vt1.id },
      defaults: { serviceName: 'General Inspection', vehicleTypeId: vt1.id, isActive: true, isDeleted: false },
    }).then(([s]) => s);

    const battery = await ServiceType.findOrCreate({
      where: { serviceName: 'Battery Maintenance', vehicleTypeId: vt1.id },
      defaults: { serviceName: 'Battery Maintenance', vehicleTypeId: vt1.id, isActive: true, isDeleted: false },
    }).then(([s]) => s);

    await ServiceType.findOrCreate({
      where: { serviceName: 'Cooling System Check', vehicleTypeId: vt1.id, parentId: inspection.id },
      defaults: {
        serviceName: 'Cooling System Check',
        vehicleTypeId: vt1.id,
        parentId: inspection.id,
        estimatedDurationMinutes: 30,
        isActive: true,
        isDeleted: false,
      },
    });

    await ServiceType.findOrCreate({
      where: { serviceName: 'High Voltage Inspection', vehicleTypeId: vt1.id, parentId: inspection.id },
      defaults: {
        serviceName: 'High Voltage Inspection',
        vehicleTypeId: vt1.id,
        parentId: inspection.id,
        estimatedDurationMinutes: 45,
        isActive: true,
        isDeleted: false,
      },
    });

    await ServiceType.findOrCreate({
      where: { serviceName: 'Battery Health Check', vehicleTypeId: vt1.id, parentId: battery.id },
      defaults: {
        serviceName: 'Battery Health Check',
        vehicleTypeId: vt1.id,
        parentId: battery.id,
        estimatedDurationMinutes: 40,
        isActive: true,
        isDeleted: false,
      },
    });

    // Service types for vt2 (simple)
    await ServiceType.findOrCreate({
      where: { serviceName: 'General Inspection', vehicleTypeId: vt2.id },
      defaults: { serviceName: 'General Inspection', vehicleTypeId: vt2.id, isActive: true, isDeleted: false },
    });

    console.log('Seed completed');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();


