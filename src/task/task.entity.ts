// src/task/task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';
import { File } from '../file/file.entity';
import { Comment } from 'src/comment/comment.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'todo' }) // 'todo', 'in_progress', 'done'
  status: string;

  @ManyToOne(() => Project, project => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  @ManyToOne(() => User, user => user.tasks, { onDelete: 'SET NULL' })
  assignedTo: User;

  @OneToMany(() => Comment, comment => comment.task, { cascade: true })
  comments: Comment[];

  @OneToMany(() => File, file => file.task)
  files: File[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
