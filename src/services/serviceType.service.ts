import { Op } from 'sequelize';
import { ServiceType } from '../models';

export function buildServiceTypeWhere(vehicleTypeId: string, keyword?: string, isActive?: boolean) {
  const where: any = { vehicleTypeId, isDeleted: false };
  if (keyword) {
    where[Op.or] = [
      { serviceName: { [Op.iLike]: `%${keyword}%` } },
      { description: { [Op.iLike]: `%${keyword}%` } },
    ];
  }
  if (typeof isActive === 'boolean') where.isActive = isActive;
  return where;
}

export async function findServiceTypes(where: any, offset: number, limit: number) {
  return ServiceType.findAndCountAll({ where, offset, limit, order: [['createdAt', 'DESC']] });
}

