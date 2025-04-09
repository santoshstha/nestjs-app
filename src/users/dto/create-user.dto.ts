import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'test@example.com' })
  email: string;

  @ApiProperty({ description: 'User password', example: '123456' })
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    default: Role.USER,
    required: false,
  })
  role?: Role;
}