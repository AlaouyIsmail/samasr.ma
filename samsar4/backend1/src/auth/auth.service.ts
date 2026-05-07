import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../common/entities/user.entity';
import { Agent } from '../common/entities/agent.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Agent) private agentRepo: Repository<Agent>,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, name: string, phone?: string, city?: string) {
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) throw new ConflictException('Email déjà utilisé');
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepo.save(this.userRepo.create({ email, password: hashed, role: 'agent' }));
    const agent = await this.agentRepo.save(this.agentRepo.create({ userId: user.id, name, phone, city, planActive: false }));
    const token = this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
    const { password: _, ...safeUser } = user;
    return { token, user: safeUser, agent };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Identifiants invalides');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');
    const agent = user.role === 'agent' ? await this.agentRepo.findOne({ where: { userId: user.id } }) : null;
    const token = this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
    const { password: _, ...safeUser } = user;
    return { token, user: safeUser, agent };
  }

  async me(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    const agent = user.role === 'agent' ? await this.agentRepo.findOne({ where: { userId } }) : null;
    const { password, ...safeUser } = user;
    return { user: safeUser, agent };
  }
}
