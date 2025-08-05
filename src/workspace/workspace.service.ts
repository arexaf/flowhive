// src/workspace/workspace.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './workspace.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepo: Repository<Workspace>,
  ) {}

  async create(name: string, owner: User): Promise<Workspace> {
    const workspace = this.workspaceRepo.create({ name, owner });
    return this.workspaceRepo.save(workspace);
  }

  async findByUser(userId: number): Promise<Workspace[]> {
    return this.workspaceRepo.find({
      where: { owner: { id: userId } },
    });
  }

  async findOne(id: number): Promise<Workspace> {
    const workspace = await this.workspaceRepo.findOne({ where: { id } });
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }

  async delete(id: number): Promise<void> {
    const result = await this.workspaceRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Workspace not found');
  }
}
