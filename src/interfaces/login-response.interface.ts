import { Auth } from '../auth/entities/auth.entity';

export interface LoginResponseInterface {
  user: Auth;
  token: string;
}
