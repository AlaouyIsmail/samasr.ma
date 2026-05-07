import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn() id: number;
  @Column() agentId: number;
  @Column() type: string;
  @Column() clientName: string;
  @Column({ nullable: true }) clientPhone: string;
  @Column({ nullable: true }) propertyId: number;
  @Column('text') content: string;
  @Column({ default: 'draft' }) status: string;
  @Column({ nullable: true }) signedAt: string;
  @CreateDateColumn() createdAt: Date;
}
