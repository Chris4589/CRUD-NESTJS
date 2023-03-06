export interface AuditInterface {
  api?: string;
  createdAt?: Date;
  error?: string;
  method?: string;
  request?: string;
  status?: number;
  uri?: string;
  user?: string;
  ip?: string;
}
