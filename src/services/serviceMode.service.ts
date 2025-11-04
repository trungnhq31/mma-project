import { ServiceMode } from '../models/enums/ServiceMode';

export function listServiceModes() {
  return Object.values(ServiceMode);
}

