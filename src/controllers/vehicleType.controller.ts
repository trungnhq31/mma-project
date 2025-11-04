import { Request, Response } from 'express';
import { VehicleType } from '../models';
import { success } from '../utils/response.util';
import { Op } from 'sequelize';
import { DEFAULT_PAGE_SIZE } from '../constants';

export async function getVehicleTypes(req: Request, res: Response) {
  const page = Math.max(0, parseInt((req.query.page as string) || '0', 10));
  const pageSize = Math.max(1, parseInt((req.query.pageSize as string) || String(DEFAULT_PAGE_SIZE), 10));
  const keyword = (req.query.keyword as string) || '';

  const where: any = { isDeleted: false };
  if (keyword) {
    where[Op.or] = [
      { vehicleTypeName: { [Op.iLike]: `%${keyword}%` } },
      { manufacturer: { [Op.iLike]: `%${keyword}%` } },
      { description: { [Op.iLike]: `%${keyword}%` } },
    ];
  }

  const { rows, count } = await VehicleType.findAndCountAll({
    where,
    offset: page * pageSize,
    limit: pageSize,
    order: [['createdAt', 'DESC']],
  });

  const mapped = rows.map((r) => {
    const v = r.get({ plain: true }) as any;
    const { id, ...rest } = v;
    return { vehicleTypeId: id, ...rest };
  });

  return success(res, {
    data: mapped,
    page,
    size: pageSize,
    totalElements: count,
    totalPages: Math.ceil(count / pageSize),
    last: page * pageSize + rows.length >= count,
  }, 'Vehicle types retrieved successfully');
}

