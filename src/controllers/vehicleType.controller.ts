import { Request, Response } from 'express';
import { VehicleTypeModel } from '../models/mongoose';
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

  const filter: any = { isDeleted: false };
  if (where[Symbol.for('hasKeyword')] || where["Op.or"]) {
    // no-op placeholder; mapping kept minimal for switch
  }
  if (keyword) {
    filter.$or = [
      { vehicleTypeName: { $regex: keyword, $options: 'i' } },
      { manufacturer: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }
  const count = await VehicleTypeModel.countDocuments(filter);
  const rows = await VehicleTypeModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .lean();

  const mapped = rows.map(({ _id, ...rest }: any) => ({ vehicleTypeId: _id, ...rest }));

  return success(res, {
    data: mapped,
    page,
    size: pageSize,
    totalElements: count,
    totalPages: Math.ceil(count / pageSize),
    last: page * pageSize + rows.length >= count,
  }, 'Vehicle types retrieved successfully');
}

