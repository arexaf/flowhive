// src/task/task.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(data: {
    title: string;
    description?: string;
    projectId: number;
    assignedToId?: number;
  }): Promise<Task> {
    const project = await this.projectRepo.findOne({
      where: { id: data.projectId },
      relations: ['collaborators'],
    });
    if (!project) throw new NotFoundException('Project not found');

    const task = this.taskRepo.create({
      title: data.title,
      description: data.description,
      project,
    });

    if (data.assignedToId) {
      const assignee = await this.userRepo.findOneBy({
        id: data.assignedToId,
      });
      if (!assignee) throw new NotFoundException('User not found');

      const isCollaborator = project.collaborators.some(
        (user) => user.id === assignee.id,
      );
      if (!isCollaborator) {
        throw new ForbiddenException(
          'User is not a collaborator on this project',
        );
      }

      task.assignedTo = assignee;
    }

    return this.taskRepo.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepo.find({ relations: ['project', 'assignedTo'] });
  }

  findByProject(projectId: number): Promise<Task[]> {
    return this.taskRepo.find({
      where: { project: { id: projectId } },
      relations: ['assignedTo'],
    });
  }

  async update(id: number, data: Partial<Task>): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['project', 'assignedTo', 'project.collaborators'],
    });
    if (!task) throw new NotFoundException('Task not found');

    if (data.assignedTo && data.assignedTo.id) {
      const assignee = await this.userRepo.findOneBy({
        id: data.assignedTo.id,
      });
      if (!assignee) throw new NotFoundException('User not found');

      const isCollaborator = task.project.collaborators.some(
        (user) => user.id === assignee.id,
      );
      if (!isCollaborator) {
        throw new ForbiddenException(
          'User is not a collaborator on this project',
        );
      }

      task.assignedTo = assignee;
    }

    Object.assign(task, data);
    return this.taskRepo.save(task);
  }

  async findById(id: number): Promise<Task> {
  const task = await this.taskRepo.findOne({
    where: { id },
    relations: ['project', 'assignedTo', 'project.collaborators'],
  });
  if (!task) throw new NotFoundException('Task not found');
  return task;
}


  async remove(id: number): Promise<void> {
    const result = await this.taskRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Task not found');
  }
}
