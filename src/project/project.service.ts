// src/project/project.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { Workspace } from '../workspace/workspace.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    @InjectRepository(Workspace)
    private workspaceRepo: Repository<Workspace>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(workspaceId: number, data: Partial<Project>): Promise<Project> {
    const workspace = await this.workspaceRepo.findOne({ where: { id: workspaceId } });
    if (!workspace) throw new NotFoundException('Workspace not found');

    const project = this.projectRepo.create({ ...data, workspace });
    return this.projectRepo.save(project);
  }

  findAll(): Promise<Project[]> {
    return this.projectRepo.find({ relations: ['workspace'] });
  }

  findOne(id: number): Promise<Project | null> {
    return this.projectRepo.findOne({ where: { id }, relations: ['workspace'] });
  }

  async update(id: number, data: Partial<Project>): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    Object.assign(project, data);
    return this.projectRepo.save(project);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Project not found');
  }

  // project.service.ts
  async addCollaborator(projectId: number, userId: number): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['collaborators'],
    });

    const user = await this.userRepo.findOneBy({ id: userId });

    if (!project || !user) throw new NotFoundException('Project or User not found');

    if (!project.collaborators.some(u => u.id === user.id)) {
      project.collaborators.push(user);
    }

    return this.projectRepo.save(project);
  }

}
