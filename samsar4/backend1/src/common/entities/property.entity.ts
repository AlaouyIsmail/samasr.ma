import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn() id: number;
  @Column() agentId: number;
  @Column() title: string;
  @Column({ nullable: true }) description: string;
  @Column('float') price: number;
  @Column() city: string;
  @Column({ nullable: true }) district: string;
  @Column({ default: 'SALE' }) type: string;
  @Column({ default: 'apartment' }) propertyType: string;
  @Column('float', { nullable: true }) surface: number;
  @Column({ nullable: true }) rooms: number;
  @Column({ nullable: true }) bathrooms: number;
  @Column({ default: '[]' }) images: string;
  @Column({ default: 'AVAILABLE' }) status: string;
  @Column({ default: false }) isFeatured: boolean;
  @Column('float', { nullable: true }) lat: number;
  @Column('float', { nullable: true }) lng: number;
  @CreateDateColumn() createdAt: Date;
}
