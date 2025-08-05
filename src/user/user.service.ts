import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Get all users
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Get one user by ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  // Create a new user
  create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  // Update an existing user
  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    const updated = this.userRepository.merge(user, userData);
    return this.userRepository.save(updated);
  }

  // Delete a user
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
  return this.userRepository.findOne({ where: { email } });
}

}
