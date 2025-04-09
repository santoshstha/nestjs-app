import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './user.entity'; // Import Role enum
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(email: string, password: string, role: Role): Promise<User> { // Use Role enum instead of string
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      role, // TypeScript now knows role is of type Role
    });
    return this.usersRepository.save(user); // Save returns Promise<User>
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}