import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsString, MinLength } from 'class-validator';
import { BeforeRecover } from 'typeorm';
import { Type } from 'class-transformer';

export class CreateAuthDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsArray()
  @Type(() => String)
  role: string[];
}
