import { Module, Injectable, Controller, Get, Post, Delete, Param, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ParseIntPipe } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '../common/entities/user.entity';
import { Agent } from '../common/entities/agent.entity';
import { Property } from '../common/entities/property.entity';
import { Notification } from '../common/entities/notification.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators';

@Injectable()
class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Agent) private agentRepo: Repository<Agent>,
    @InjectRepository(Property) private propRepo: Repository<Property>,
    @InjectRepository(Notification) private notifRepo: Repository<Notification>,
  ) {}

  async getStats() {
    const totalAgents = await this.agentRepo.count();
    const activeAgents = await this.agentRepo.count({ where: { planActive: true } });
    const pendingAgents = await this.agentRepo.count({ where: { planActive: false } });
    const totalProperties = await this.propRepo.count();
    const activeProperties = await this.propRepo.count({ where: { status: 'AVAILABLE' } });
    const monthlyRevenue = activeAgents * 349;
    return { totalAgents, activeAgents, pendingAgents, totalProperties, activeProperties, monthlyRevenue };
  }

  async getAllAgents() {
    const agents = await this.agentRepo.find({ order: { createdAt: 'DESC' } });
    return Promise.all(agents.map(async (a) => {
      const user = await this.userRepo.findOne({ where: { id: a.userId } });
      const propCount = await this.propRepo.count({ where: { agentId: a.id } });
      return { ...a, email: user?.email, propertyCount: propCount };
    }));
  }

  async getPendingAgents() {
    const agents = await this.agentRepo.find({ where: { planActive: false }, order: { createdAt: 'DESC' } });
    return Promise.all(agents.map(async (a) => {
      const user = await this.userRepo.findOne({ where: { id: a.userId } });
      return { ...a, email: user?.email };
    }));
  }

  async activateAgent(id: number) {
    const agent = await this.agentRepo.findOne({ where: { id } });
    if (!agent) throw new NotFoundException('Agent introuvable');
    const exp = new Date(); exp.setDate(exp.getDate() + 30);
    await this.agentRepo.update(id, { planActive: true, planExpiresAt: exp.toISOString() });
    await this.notifRepo.save(this.notifRepo.create({
      agentId: id,
      message: '🎉 Votre compte est activé ! Vous pouvez maintenant publier vos annonces immobilières sur SAMSAR.',
      type: 'success',
    }));
    return { message: 'Plan activé pour 30 jours' };
  }

  async deactivateAgent(id: number) {
    const agent = await this.agentRepo.findOne({ where: { id } });
    if (!agent) throw new NotFoundException();
    await this.agentRepo.update(id, { planActive: false });
    await this.notifRepo.save(this.notifRepo.create({
      agentId: id,
      message: '⚠️ Votre plan a été suspendu. Contactez-nous pour le renouveler.',
      type: 'warning',
    }));
    return { message: 'Plan désactivé' };
  }

  async getAllProperties() {
    const props = await this.propRepo.find({ order: { createdAt: 'DESC' } });
    return props.map(p => ({ ...p, images: JSON.parse(p.images || '[]') }));
  }

  async sendNotification(agentId: number, message: string, type = 'info') {
    if (agentId === 0) {
      const agents = await this.agentRepo.find();
      await Promise.all(agents.map(a => this.notifRepo.save(this.notifRepo.create({ agentId: a.id, message, type }))));
      return { message: `Notification envoyée à ${agents.length} agents` };
    }
    await this.notifRepo.save(this.notifRepo.create({ agentId, message, type }));
    return { message: 'Notification envoyée' };
  }
}

@ApiTags('Admin (SECRET)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
class AdminController {
  constructor(private svc: AdminService) {}

  @Get('stats') stats() { return this.svc.getStats(); }
  @Get('agents') agents() { return this.svc.getAllAgents(); }
  @Get('agents/pending') pending() { return this.svc.getPendingAgents(); }
  @Post('activate-agent/:id') activate(@Param('id', ParseIntPipe) id: number) { return this.svc.activateAgent(id); }
  @Post('deactivate-agent/:id') deactivate(@Param('id', ParseIntPipe) id: number) { return this.svc.deactivateAgent(id); }
  @Get('properties') properties() { return this.svc.getAllProperties(); }
  @Post('notify') notify(@Body() body: { agentId: number; message: string; type?: string }) {
    return this.svc.sendNotification(body.agentId, body.message, body.type);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Agent, User, Property, Notification])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
