// src/analytics/analytics.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Analytics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  event: string;


  @Column({ type: 'text', nullable: true })
  metadata: string | null;

  @CreateDateColumn()
  timestamp: Date;
}
