import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateAuditDto {
  @IsString()
  api?: string;

  @IsDate()
  createdAt?: string;

  @IsString()
  error?: string;

  @IsString()
  method?: string;

  @IsString()
  request?: string;

  @IsNumber()
  status?: number;

  @IsString()
  uri?: string;

  @IsString()
  user?: string;

  @IsString()
  ip?: string;
}
