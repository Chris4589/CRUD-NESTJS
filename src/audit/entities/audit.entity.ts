import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audit')
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'api', type: 'varchar', length: 255, nullable: true })
  api?: string;

  @Column({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt?: Date;

  @Column({ name: 'error', type: 'varchar', length: 255, nullable: false })
  error?: string;

  @Column({ name: 'method', type: 'varchar', length: 20, nullable: false })
  method?: string;

  @Column({ name: 'request', type: 'varchar', length: 255, nullable: true })
  request?: string;

  @Column({ name: 'status', type: 'int', nullable: false })
  status?: number;

  @Column({ name: 'uri', type: 'varchar', length: 255, nullable: false })
  uri?: string;

  @Column({ name: 'user', type: 'varchar', length: 255, nullable: false })
  user?: string;

  @Column({ name: 'ip', type: 'varchar', length: 255, nullable: false })
  ip?: string;
}
