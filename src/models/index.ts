import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { ServiceMode } from './enums/ServiceMode';

export interface VehicleTypeAttributes {
  id: string;
  vehicleTypeName: string;
  manufacturer?: string | null;
  modelYear?: number | null;
  batteryCapacity?: number | null;
  maintenanceIntervalKm?: number | null;
  maintenanceIntervalMonths?: number | null;
  description?: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
}

type VehicleTypeCreation = Optional<VehicleTypeAttributes, 'id' | 'isActive' | 'isDeleted'>;

export class VehicleType extends Model<VehicleTypeAttributes, VehicleTypeCreation> implements VehicleTypeAttributes {
  declare id: string;
  declare vehicleTypeName: string;
  declare manufacturer: string | null;
  declare modelYear: number | null;
  declare batteryCapacity: number | null;
  declare maintenanceIntervalKm: number | null;
  declare maintenanceIntervalMonths: number | null;
  declare description: string | null;
  declare isActive: boolean;
  declare isDeleted: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare createdBy?: string | null;
  declare updatedBy?: string | null;
}

VehicleType.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    vehicleTypeName: { type: DataTypes.STRING, allowNull: false },
    manufacturer: { type: DataTypes.STRING },
    modelYear: { type: DataTypes.INTEGER },
    batteryCapacity: { type: DataTypes.FLOAT },
    maintenanceIntervalKm: { type: DataTypes.INTEGER },
    maintenanceIntervalMonths: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdBy: { type: DataTypes.STRING },
    updatedBy: { type: DataTypes.STRING },
  },
  { sequelize, tableName: 'vehicle_types', timestamps: true }
);

export interface ServiceTypeAttributes {
  id: string;
  serviceName: string;
  description?: string | null;
  estimatedDurationMinutes?: number | null;
  parentId?: string | null;
  vehicleTypeId: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type ServiceTypeCreation = Optional<ServiceTypeAttributes, 'id' | 'isActive' | 'isDeleted'>;

export class ServiceType extends Model<ServiceTypeAttributes, ServiceTypeCreation> implements ServiceTypeAttributes {
  declare id: string;
  declare serviceName: string;
  declare description: string | null;
  declare estimatedDurationMinutes: number | null;
  declare parentId: string | null;
  declare vehicleTypeId: string;
  declare isActive: boolean;
  declare isDeleted: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

ServiceType.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    serviceName: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    estimatedDurationMinutes: { type: DataTypes.INTEGER },
    parentId: { type: DataTypes.UUID, allowNull: true },
    vehicleTypeId: { type: DataTypes.UUID, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, tableName: 'service_types', timestamps: true }
);

export interface AppointmentAttributes {
  id: string;
  customerFullName: string;
  customerPhoneNumber: string;
  customerEmail: string;
  vehicleTypeId: string;
  vehicleNumberPlate: string;
  vehicleKmDistances: string;
  userAddress: string;
  serviceMode: ServiceMode;
  scheduledAt: Date;
  notes?: string | null;
  status?: string | null;
  createdAt?: Date;
}

type AppointmentCreation = Optional<AppointmentAttributes, 'id' | 'status' | 'notes' | 'createdAt'>;

export class Appointment extends Model<AppointmentAttributes, AppointmentCreation> implements AppointmentAttributes {
  declare id: string;
  declare customerFullName: string;
  declare customerPhoneNumber: string;
  declare customerEmail: string;
  declare vehicleTypeId: string;
  declare vehicleNumberPlate: string;
  declare vehicleKmDistances: string;
  declare userAddress: string;
  declare serviceMode: ServiceMode;
  declare scheduledAt: Date;
  declare notes: string | null;
  declare status: string | null;
  declare createdAt?: Date;
}

Appointment.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    customerFullName: { type: DataTypes.STRING, allowNull: false },
    customerPhoneNumber: { type: DataTypes.STRING, allowNull: false },
    customerEmail: { type: DataTypes.STRING, allowNull: false },
    vehicleTypeId: { type: DataTypes.UUID, allowNull: false },
    vehicleNumberPlate: { type: DataTypes.STRING, allowNull: false },
    vehicleKmDistances: { type: DataTypes.STRING, allowNull: false },
    userAddress: { type: DataTypes.STRING, allowNull: false },
    serviceMode: { type: DataTypes.ENUM(...Object.values(ServiceMode)), allowNull: false },
    scheduledAt: { type: DataTypes.DATE, allowNull: false },
    notes: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: 'appointments', timestamps: false }
);

VehicleType.hasMany(ServiceType, { foreignKey: 'vehicleTypeId', as: 'serviceTypes' });
ServiceType.belongsTo(VehicleType, { foreignKey: 'vehicleTypeId', as: 'vehicleType' });
ServiceType.hasMany(ServiceType, { foreignKey: 'parentId', as: 'children' });
ServiceType.belongsTo(ServiceType, { foreignKey: 'parentId', as: 'parent' });

VehicleType.hasMany(Appointment, { foreignKey: 'vehicleTypeId', as: 'appointments' });
Appointment.belongsTo(VehicleType, { foreignKey: 'vehicleTypeId', as: 'vehicleType' });

export { ServiceMode };

