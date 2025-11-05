import mongoose, { Schema, model } from 'mongoose';
import { ServiceMode } from '../enums/ServiceMode';

// VehicleType
const VehicleTypeSchema = new Schema(
  {
    vehicleTypeName: { type: String, required: true },
    manufacturer: String,
    modelYear: Number,
    batteryCapacity: Number,
    maintenanceIntervalKm: Number,
    maintenanceIntervalMonths: Number,
    description: String,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: String,
    updatedBy: String,
  },
  { timestamps: true }
);

export const VehicleTypeModel = model('VehicleType', VehicleTypeSchema);

// ServiceType
const ServiceTypeSchema = new Schema(
  {
    serviceName: { type: String, required: true },
    description: String,
    estimatedDurationMinutes: Number,
    parentId: { type: Schema.Types.ObjectId, ref: 'ServiceType', default: null },
    vehicleTypeId: { type: Schema.Types.ObjectId, ref: 'VehicleType', required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ServiceTypeModel = model('ServiceType', ServiceTypeSchema);

// Appointment
const AppointmentSchema = new Schema(
  {
    customerFullName: { type: String, required: true },
    customerPhoneNumber: { type: String, required: true },
    customerEmail: { type: String, required: true },
    vehicleTypeId: { type: Schema.Types.ObjectId, ref: 'VehicleType', required: true },
    vehicleNumberPlate: { type: String, required: true },
    vehicleKmDistances: { type: String, required: true },
    userAddress: { type: String, required: true },
    serviceMode: { type: String, enum: Object.values(ServiceMode), required: true },
    scheduledAt: { type: Date, required: true },
    notes: String,
    status: { type: String, default: 'PENDING' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AppointmentModel = model('Appointment', AppointmentSchema);

// User
const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true },
    numberPhone: { type: String },
    avatarUrl: { type: String },
    provider: { type: String, default: 'local' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

export const UserModel = model('User', UserSchema);

