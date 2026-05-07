import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../common/entities/property.entity';
import { PropertyStats } from '../common/entities/property-stats.entity';
import { Agent } from '../common/entities/agent.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property) private propRepo: Repository<Property>,
    @InjectRepository(PropertyStats) private statsRepo: Repository<PropertyStats>,
    @InjectRepository(Agent) private agentRepo: Repository<Agent>,
  ) {}

  async findAll(query: any) {
    const { city, type, propertyType, minPrice, maxPrice, page = 1, limit = 20 } = query;
    let qb = this.propRepo.createQueryBuilder('p').where('p.status = :status', { status: 'AVAILABLE' });
    if (city) qb = qb.andWhere('p.city LIKE :city', { city: `%${city}%` });
    if (type) qb = qb.andWhere('p.type = :type', { type });
    if (propertyType) qb = qb.andWhere('p.propertyType = :pt', { pt: propertyType });
    if (minPrice) qb = qb.andWhere('p.price >= :min', { min: +minPrice });
    if (maxPrice) qb = qb.andWhere('p.price <= :max', { max: +maxPrice });
    qb = qb.orderBy('p.isFeatured', 'DESC').addOrderBy('p.createdAt', 'DESC');
    qb = qb.skip((+page - 1) * +limit).take(+limit);
    const [items, total] = await qb.getManyAndCount();
    const withStats = await Promise.all(items.map(async (p) => {
      const stats = await this.getOrCreateStats(p.id);
      const agent = await this.agentRepo.findOne({ where: { id: p.agentId } });
      return { ...p, images: this.parseImages(p.images), stats,
        agent: agent ? { id: agent.id, name: agent.name, phone: agent.phone, city: agent.city, photo: agent.photo } : null };
    }));
    return { data: withStats, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) };
  }

  async findOne(id: number) {
    const prop = await this.propRepo.findOne({ where: { id } });
    if (!prop) throw new NotFoundException('Annonce introuvable');
    const stats = await this.getOrCreateStats(id);
    stats.views++;
    await this.statsRepo.save(stats);
    const agent = await this.agentRepo.findOne({ where: { id: prop.agentId } });
    return { ...prop, images: this.parseImages(prop.images), stats,
      agent: agent ? { id: agent.id, name: agent.name, phone: agent.phone, city: agent.city, photo: agent.photo, bio: agent.bio } : null };
  }

  async like(id: number) {
    const stats = await this.getOrCreateStats(id);
    stats.likes++; await this.statsRepo.save(stats);
    return { likes: stats.likes };
  }

  async save(id: number) {
    const stats = await this.getOrCreateStats(id);
    stats.saves++; await this.statsRepo.save(stats);
    return { saves: stats.saves };
  }

  async whatsappClick(id: number) {
    const stats = await this.getOrCreateStats(id);
    stats.whatsappClicks++; await this.statsRepo.save(stats);
    return { whatsappClicks: stats.whatsappClicks };
  }

  async create(userId: number, dto: any) {
    const agent = await this.agentRepo.findOne({ where: { userId } });
    if (!agent) throw new ForbiddenException('Profil agent introuvable');
    if (!agent.planActive) throw new ForbiddenException('Plan non actif');
    if (agent.planExpiresAt && new Date(agent.planExpiresAt) < new Date()) {
      await this.agentRepo.update(agent.id, { planActive: false });
      throw new ForbiddenException('Plan expiré');
    }
    const prop = this.propRepo.create({ ...dto, agentId: agent.id, images: JSON.stringify(dto.images || []) });
    const saved = await this.propRepo.save(prop);
    // await this.getOrCreateStats(saved.id);
    return { ...saved, images: dto.images || [] };
  }

  async update(id: number, userId: number, dto: any) {
    const agent = await this.agentRepo.findOne({ where: { userId } });
    if (!agent) throw new ForbiddenException('Agent introuvable');
    const prop = await this.propRepo.findOne({ where: { id, agentId: agent.id } });
    if (!prop) throw new NotFoundException('Annonce introuvable');
    if (dto.images) dto.images = JSON.stringify(dto.images);
    await this.propRepo.update(id, dto);
    const updated = await this.propRepo.findOne({ where: { id } });
    return { ...updated, images: this.parseImages(updated.images) };
  }

  async remove(id: number, userId: number) {
    const agent = await this.agentRepo.findOne({ where: { userId } });
    if (!agent) throw new ForbiddenException('Agent introuvable');
    const prop = await this.propRepo.findOne({ where: { id, agentId: agent.id } });
    if (!prop) throw new NotFoundException('Annonce introuvable');
    await this.propRepo.update(id, { status: 'INACTIVE' });
    return { message: 'Annonce supprimée' };
  }

  async findByAgent(userId: number) {
    const agent = await this.agentRepo.findOne({ where: { userId } });
    if (!agent) throw new NotFoundException('Agent introuvable');
    const props = await this.propRepo.find({ where: { agentId: agent.id }, order: { createdAt: 'DESC' } });
    return Promise.all(props.map(async (p) => {
      const stats = await this.getOrCreateStats(p.id);
      return { ...p, images: this.parseImages(p.images), stats };
    }));
  }

  private parseImages(raw: string): string[] {
    try { return JSON.parse(raw || '[]'); } catch { return []; }
  }

  private async getOrCreateStats(propertyId: number): Promise<PropertyStats> {
    let stats = await this.statsRepo.findOne({ where: { propertyId } });
    if (!stats) stats = await this.statsRepo.save(this.statsRepo.create({ propertyId }));
    return stats;
  }
}
