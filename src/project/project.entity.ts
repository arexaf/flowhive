// project.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Workspace } from '../workspace/workspace.entity';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import { Chat } from 'src/chat/chat.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Workspace, workspace => workspace.projects)
  workspace: Workspace;

  @ManyToMany(() => User)
  @JoinTable()
  collaborators: User[];

  @OneToMany(() => Task, task => task.project)
  tasks: Task[];

  @OneToMany(() => Chat, chat => chat.project)
  chats: Chat[];


   @ManyToOne(() => User, { eager: false })
  createdBy: User;
}
