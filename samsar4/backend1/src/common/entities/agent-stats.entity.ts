import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('agent_stats')
export class AgentStats {
  @PrimaryGeneratedColumn() id: number;
  @Column() agentId: number;
  @Column({ default: 0 }) profileViews: number;
}
