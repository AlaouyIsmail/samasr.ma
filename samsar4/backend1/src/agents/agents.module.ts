import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../common/entities/agent.entity';
import { AgentStats } from '../common/entities/agent-stats.entity';
import { Property } from '../common/entities/property.entity';
import { PropertyStats } from '../common/entities/property-stats.entity';
import { Notification } from '../common/entities/notification.entity';
import { AgentsService } from './agents.service';
import { AgentsController, AgentsPublicController } from './agents.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, AgentStats, Property, PropertyStats, Notification])],
  providers: [AgentsService],
  controllers: [AgentsController, AgentsPublicController],
})
export class AgentsModule {}
