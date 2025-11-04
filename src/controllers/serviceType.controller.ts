import { Request, Response } from 'express';
import { ServiceTypeModel, VehicleTypeModel } from '../models/mongoose';
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

  const filter: any = { vehicleTypeId, isDeleted: false, isActive: String(isActiveParam).toLowerCase() === 'true' };
  if (keyword) {
    filter.$or = [
      { serviceName: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  const count = await ServiceTypeModel.countDocuments(filter);
  const rows = await ServiceTypeModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .lean();

  const vehicleType = await VehicleTypeModel.findById(vehicleTypeId).lean();
  const vehicleTypeResponse = vehicleType
    ? (({ _id, ...other }: any) => ({ vehicleTypeId: _id, ...other }))(vehicleType)
    : null;

  const plain = rows.map(({ _id, ...rest }: any) => ({
    serviceTypeId: _id,
    ...rest,
    vehicleTypeResponse,
    serviceTypeVehiclePartResponses: [],
  }));

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

