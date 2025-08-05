// src/chat/chat.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepo: Repository<Chat>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

    async sendProjectMessage(senderId: number, projectId: number, message: string) {
    const sender = await this.userRepo.findOneBy({ id: senderId });
    if (!sender) throw new NotFoundException('Sender not found');

    const project = await this.projectRepo.findOne({
        where: { id: projectId },
        relations: ['collaborators'],
    });
    if (!project) throw new NotFoundException('Project not found');

    const isCollaborator = project.collaborators.some(c => c.id === senderId);
    if (!isCollaborator) throw new ForbiddenException('Not a project collaborator');

    const chat = this.chatRepo.create({
        message,
        sender,
        project,
    });

    return this.chatRepo.save(chat);
    }


  async sendDirectMessage(senderId: number, recipientId: number, message: string) {
    const sender = await this.userRepo.findOneBy({ id: senderId });
    const recipient = await this.userRepo.findOneBy({ id: recipientId });

    if (!sender || !recipient) throw new NotFoundException('User not found');

    const chat = this.chatRepo.create({ message, sender, recipient });
    return this.chatRepo.save(chat);
  }

  async getProjectMessages(projectId: number) {
    return this.chatRepo.find({
      where: { project: { id: projectId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async getDirectMessages(user1Id: number, user2Id: number) {
    return this.chatRepo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.sender', 'sender')
      .where(
        '(chat.senderId = :user1 AND chat.recipientId = :user2) OR (chat.senderId = :user2 AND chat.recipientId = :user1)',
        { user1: user1Id, user2: user2Id },
      )
      .orderBy('chat.createdAt', 'ASC')
      .getMany();
  }
}
