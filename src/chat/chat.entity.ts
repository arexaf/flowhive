// src/chat/chat.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => User, user => user.sentMessages)
  sender: User;

  @ManyToOne(() => Project, project => project.chats, { nullable: true })
  project: Project;

  @ManyToOne(() => User, { nullable: true })
  recipient: User;

  @CreateDateColumn()
  createdAt: Date;
}
