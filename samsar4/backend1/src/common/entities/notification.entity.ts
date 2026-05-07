import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn() id: number;
  @Column() agentId: number;
  @Column('text') message: string;
  @Column({ default: 'info' }) type: string;
  @Column({ default: false }) isRead: boolean;
  @CreateDateColumn() createdAt: Date;
}
