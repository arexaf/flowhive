// src/file/file.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @ManyToOne(() => Task, task => task.files, { onDelete: 'CASCADE' })
  task: Task;

  @ManyToOne(() => User)
  uploadedBy: User;

  @CreateDateColumn()
  uploadedAt: Date;
}
