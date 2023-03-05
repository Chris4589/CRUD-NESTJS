import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ required: false })
  offset?: number;
}
