import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn() id: number;
  @Column() userId: number;
  @Column() name: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) city: string;
  @Column({ nullable: true }) bio: string;
  @Column({ nullable: true }) photo: string;
  @Column({ default: false }) planActive: boolean;
  @Column({ nullable: true }) planExpiresAt: string;
  @CreateDateColumn() createdAt: Date;
}
