import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { ServiceType, VehicleType } from '../models';
import { success } from '../utils/response.util';

type PlainServiceType = any;

function buildTree(items: PlainServiceType[], parentId: string | null = null): PlainServiceType[] {
  const nodes = items.filter((it) => (it.parentId ?? null) === parentId);
  return nodes.map((n) => ({
    ...n,
    children: buildTree(items, n.serviceTypeId),
  }));
}

export async function getServiceTypesTreeByVehicleType(req: Request, res: Response) {
  const vehicleTypeId = req.params.vehicleTypeId;
  const page = Math.max(0, parseInt((req.query.page as string) || '0', 10));
  const pageSize = Math.max(1, parseInt((req.query.pageSize as string) || '10', 10));
  const keyword = (req.query.keyword as string) || '';
  const isActiveParam = (req.query.isActive as string) ?? 'true';

  const where: any = { vehicleTypeId, isDeleted: false };
  if (keyword) {
    where[Op.or] = [
      { serviceName: { [Op.iLike]: `%${keyword}%` } },
      { description: { [Op.iLike]: `%${keyword}%` } },
    ];
  }
  where.isActive = String(isActiveParam).toLowerCase() === 'true';

  const { rows, count } = await ServiceType.findAndCountAll({
    where,
    offset: page * pageSize,
    limit: pageSize,
    order: [['createdAt', 'DESC']],
    include: [{ model: VehicleType, as: 'vehicleType' }],
  });

  const plain = rows.map((r) => {
    const v = r.get({ plain: true }) as any;
    const { id, vehicleType, ...rest } = v;
    const vehicleTypeResponse = vehicleType
      ? (({ id: vtId, ...other }) => ({ vehicleTypeId: vtId, ...other }))(vehicleType)
      : null;
    return {
      serviceTypeId: id,
      ...rest,
      vehicleTypeResponse,
      serviceTypeVehiclePartResponses: [],
    };
  });

  const tree = buildTree(plain);
  return success(res, {
    data: tree,
    page,
    size: pageSize,
    totalElements: count,
    totalPages: Math.ceil(count / pageSize),
    last: page * pageSize + rows.length >= count,
  }, 'Service types retrieved successfully');
}

