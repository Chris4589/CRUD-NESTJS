import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import * as bcrypt from 'bcrypt';

@Entity('auth')
export class Auth {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 255, name: 'username' })
  @ApiProperty()
  username: string;

  @Column('varchar', { length: 255, name: 'password' })
  @ApiProperty()
  password: string;

  @Column('varchar', { length: 255, unique: true, name: 'email' })
  @ApiProperty()
  email: string;

  @Column('varchar', { length: 255, name: 'role' })
  @ApiProperty()
  role: string;

  @BeforeInsert()
  transformRole() {
    this.role = this.role.toUpperCase();
    this.username = this.username.toLowerCase();
    this.email = this.email.toLowerCase();
    this.password = bcrypt.hashSync(this.password, 10);
  }

  public static fromCreateAuthDto(createAuthDto: CreateAuthDto): Auth {
    const user = new Auth();
    const { role, ...rest } = createAuthDto;
    Object.assign(user, rest);
    user.role = role.join(',');
    return user;
  }

  public static fromUpdateAuthDto(updateAuthDto: UpdateAuthDto): Auth {
    const user = new Auth();
    const { role, ...rest } = updateAuthDto;
    Object.assign(user, rest);
    user.role = role.join(',');
    return user;
  }
}
