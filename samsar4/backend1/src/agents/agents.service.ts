import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../common/entities/agent.entity';
import { AgentStats } from '../common/entities/agent-stats.entity';
import { Property } from '../common/entities/property.entity';
import { PropertyStats } from '../common/entities/property-stats.entity';
import { Notification } from '../common/entities/notification.entity';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent) private agentRepo: Repository<Agent>,
    @InjectRepository(AgentStats) private agentStatsRepo: Repository<AgentStats>,
    @InjectRepository(Property) private propRepo: Repository<Property>,
    @InjectRepository(PropertyStats) private propStatsRepo: Repository<PropertyStats>,
    @InjectRepository(Notification) private notifRepo: Repository<Notification>,
  ) {}

  async getDashboard(userId: number) {
    const agent = await this.agentRepo.findOne({ where: { userId } });
    if (!agent) throw new NotFoundException('Agent introuvable');
    const props = await this.propRepo.find({ where: { agentId: agent.id }, order: { createdAt: 'DESC' } });
    let totalViews = 0, totalLikes = 0, totalSaves = 0, totalWa = 0;
    const propsWithStats = await Promise.all(props.map(async (p) => {
      let stats = await this.propStatsRepo.findOne({ where: { propertyId: p.id } });
      if (!stats) stats = await this.propStatsRepo.save(this.propStatsRepo.create({ propertyId: p.id }));
      totalViews += stats.views; totalLikes += stats.likes;
      totalSaves += stats.saves; totalWa += stats.whatsappClicks;
      return { ...p, images: JSON.parse(p.images || '[]'), stats };
    }));
    const agentStats = await this.agentStatsRepo.findOne({ where: { agentId: agent.id } });
    const unreadNotifs = await this.notifRepo.count({ where: { agentId: agent.id, isRead: false } });
    return {
      agent, stats: { totalViews, totalLikes, totalSaves, totalWhatsapp: totalWa,
        totalProperties: props.length, activeProperties: props.filter(p => p.status === 'AVAILABLE').length,
        profileViews: agentStats?.profileViews || 0, unreadNotifications: unreadNotifs },
      properties: propsWithStats,
    };
  }

  async getProfile(userId: number) {
    const agent = await this.agentRepo.findOne({ where: { userId } });
    if (!agent) throw new NotFoundException('Agent introuvable');
    return agent;
  }

  async updateProfile(userId: number, dto: any) {
    const agent = await this.agentRepo.findOne({ where: { userId } });
    if (!agent) throw new NotFoundException('Agent introuvable');
    await this.agentRepo.update(agent.id, dto);
    return this.agentRepo.findOne({ where: { id: agent.id } });
  }

  async getNotifications(userId: number) {
    const agent = await this.agentRepo.findOne({ where: { userId } });
    if (!agent) throw new NotFoundException();
    return this.notifRepo.find({ where: { agentId: agent.id }, order: { createdAt: 'DESC' }, take: 50 });
  }

  async readAll(userId: number) {
    const agent = await this.agentRepo.findOne({ where: { userId } });
    if (!agent) throw new NotFoundException();
    await this.notifRepo.update({ agentId: agent.id, isRead: false }, { isRead: true });
    return { message: 'Toutes les notifications marquées comme lues' };
  }

  async getPublicProfile(agentId: number) {
    const agent = await this.agentRepo.findOne({ where: { id: agentId } });
    if (!agent) throw new NotFoundException('Agent introuvable');
    const stats = await this.agentStatsRepo.findOne({ where: { agentId } });
    if (stats) { stats.profileViews++; await this.agentStatsRepo.save(stats); }
    const props = await this.propRepo.find({ where: { agentId, status: 'AVAILABLE' }, order: { createdAt: 'DESC' } });
    return { agent, stats, properties: props.map(p => ({ ...p, images: JSON.parse(p.images || '[]') })) };
  }
}
