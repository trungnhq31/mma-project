import { Op } from 'sequelize';
import { VehicleType } from '../models';

export async function findVehicleTypes(where: any, offset: number, limit: number) {
  return VehicleType.findAndCountAll({ where, offset, limit, order: [['createdAt', 'DESC']] });
}

export const VehicleTypeWhere = (keyword?: string) => {
  const where: any = { isDeleted: false };
  if (keyword) {
    where[Op.or] = [
      { vehicleTypeName: { [Op.iLike]: `%${keyword}%` } },
      { manufacturer: { [Op.iLike]: `%${keyword}%` } },
      { description: { [Op.iLike]: `%${keyword}%` } },
    ];
  }
  return where;
};

