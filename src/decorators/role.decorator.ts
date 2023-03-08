import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../interfaces/roles.enum';

export function IncludeRoles(...role: ROLES[]) {
  return SetMetadata('roles', role);
}
