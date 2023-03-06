import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('audit')
export class Audit {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column({ name: 'api', type: 'varchar', length: 255, nullable: true })
  @ApiProperty()
  api?: string;

  @Column({ name: 'created_at', type: 'varchar', nullable: false })
  @ApiProperty()
  createdAt?: string;

  @Column({ name: 'error', type: 'varchar', length: 255, nullable: false })
  @ApiProperty()
  error?: string;

  @Column({ name: 'method', type: 'varchar', length: 20, nullable: false })
  @ApiProperty()
  method?: string;

  @Column({ name: 'request', type: 'varchar', length: 255, nullable: true })
  @ApiProperty()
  request?: string;

  @Column({ name: 'status', type: 'int', nullable: false })
  @ApiProperty()
  status?: number;

  @Column({ name: 'uri', type: 'varchar', length: 255, nullable: false })
  @ApiProperty()
  uri?: string;

  @Column({ name: 'user', type: 'varchar', length: 255, nullable: false })
  @ApiProperty()
  user?: string;

  @Column({ name: 'ip', type: 'varchar', length: 255, nullable: false })
  @ApiProperty()
  ip?: string;
}
