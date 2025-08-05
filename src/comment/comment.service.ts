// src/comment/comment.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

async create(content: string, taskId: number, authorId: number): Promise<Comment> {
  const task = await this.taskRepo.findOne({
    where: { id: taskId },
    relations: ['project', 'project.collaborators'],
  });

  if (!task) throw new NotFoundException('Task not found');

    const isCollaborator = task.project.collaborators.some(user => user.id === authorId);
    const isCreator = task.project.createdBy?.id === authorId;

    if (!isCollaborator && !isCreator) {
    throw new ForbiddenException('Only project collaborators or the creator can comment');
    }

  const user = await this.userRepo.findOneBy({ id: authorId });
  if (!user) throw new NotFoundException('User not found');

  const comment = this.commentRepo.create({ content, task, author: user });
  return this.commentRepo.save(comment);
}

  findByTask(taskId: number): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { task: { id: taskId } },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment || comment.author.id !== userId) {
      throw new NotFoundException('Comment not found or access denied');
    }

    await this.commentRepo.remove(comment);
  }
}
