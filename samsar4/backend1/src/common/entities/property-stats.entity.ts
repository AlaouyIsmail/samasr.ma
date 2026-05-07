import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('property_stats')
export class PropertyStats {
  @PrimaryGeneratedColumn() id: number;
  @Column() propertyId: number;
  @Column({ default: 0 }) views: number;
  @Column({ default: 0 }) likes: number;
  @Column({ default: 0 }) saves: number;
  @Column({ default: 0 }) whatsappClicks: number;
}
