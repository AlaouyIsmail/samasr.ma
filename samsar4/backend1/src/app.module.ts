import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AgentsModule } from './agents/agents.module';
import { PropertiesModule } from './properties/properties.module';
import { ContractsModule } from './contracts/contracts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { UploadsModule } from './uploads/uploads.module';
import { User } from './common/entities/user.entity';
import { Agent } from './common/entities/agent.entity';
import { Property } from './common/entities/property.entity';
import { PropertyStats } from './common/entities/property-stats.entity';
import { AgentStats } from './common/entities/agent-stats.entity';
import { Contract } from './common/entities/contract.entity';
import { Notification } from './common/entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || 'samsar.db',
      entities: [User, Agent, Property, PropertyStats, AgentStats, Contract, Notification],
      synchronize: true,
      logging: false,
    }),
    AuthModule, AgentsModule, PropertiesModule, ContractsModule,
    NotificationsModule, AdminModule, UploadsModule,
  ],
})
export class AppModule {}
