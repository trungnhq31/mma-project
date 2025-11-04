import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { ServiceType } from '../models';
import { success } from '../utils/response.util';

type ServiceTypeNode = any;

function buildTree(items: ServiceType[], parentId: string | null = null): ServiceTypeNode[] {
  const nodes = items.filter((it) => (it.parentId ?? null) === parentId);
  return nodes.map((n) => ({
    id: n.id,
    serviceName: n.serviceName,
    description: n.description,
    estimatedDurationMinutes: n.estimatedDurationMinutes,
    vehicleTypeId: n.vehicleTypeId,
    parentId: n.parentId,
    isActive: n.isActive,
    isDeleted: n.isDeleted,
    children: buildTree(items, n.id),
    serviceTypeVehiclePartResponses: [], // placeholder as yêu cầu nhắc nhưng chưa có model vehicle part
  }));
}

export async function getServiceTypesTreeByVehicleType(req: Request, res: Response) {
  const vehicleTypeId = req.params.vehicleTypeId;
  const page = Math.max(0, parseInt((req.query.page as string) || '0', 10));
  const pageSize = Math.max(1, parseInt((req.query.pageSize as string) || '1000', 10));
  const keyword = (req.query.keyword as string) || '';
  const isActive = (req.query.isActive as string) ?? undefined;

  const where: any = { vehicleTypeId, isDeleted: false };
  if (keyword) {
    where[Op.or] = [
      { serviceName: { [Op.iLike]: `%${keyword}%` } },
      { description: { [Op.iLike]: `%${keyword}%` } },
    ];
  }
  if (typeof isActive !== 'undefined') {
    where.isActive = String(isActive).toLowerCase() === 'true';
  }

  const { rows, count } = await ServiceType.findAndCountAll({
    where,
    offset: page * pageSize,
    limit: pageSize,
    order: [['createdAt', 'DESC']],
  });

  const tree = buildTree(rows);
  return success(res, {
    data: tree,
    page,
    size: pageSize,
    totalElements: count,
    totalPages: Math.ceil(count / pageSize),
    last: page * pageSize + rows.length >= count,
  }, 'Service types retrieved successfully');
}

