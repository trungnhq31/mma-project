import 'dotenv/config';
import { connectMongo } from '../config/database';
import { ServiceTypeModel } from '../models/mongoose';

// Map tiếng Anh -> tiếng Việt
const NAME_MAP: Record<string, string> = {
  'General Inspection': 'Kiểm tra tổng quát',
  'Battery Maintenance': 'Bảo dưỡng pin',
  'Cooling System Check': 'Kiểm tra hệ thống làm mát',
  'High Voltage Inspection': 'Kiểm tra điện áp cao',
  'Battery Health Check': 'Kiểm tra tình trạng pin',
};

async function run() {
  try {
    await connectMongo();

    let updatedCount = 0;
    for (const [en, vi] of Object.entries(NAME_MAP)) {
      const res = await ServiceTypeModel.updateMany({ serviceName: en }, { $set: { serviceName: vi } });
      updatedCount += res.modifiedCount || 0;
    }

    console.log(`Normalized service types. Updated: ${updatedCount}`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();


