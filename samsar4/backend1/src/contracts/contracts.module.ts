import { Module, Injectable, Controller, Post, Get, Param, Body, Request, UseGuards, NotFoundException } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ParseIntPipe } from '@nestjs/common';
import { Contract } from '../common/entities/contract.entity';
import { Agent } from '../common/entities/agent.entity';
import { Property } from '../common/entities/property.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators';

class CreateContractDto {
  @IsString() type: string;
  @IsString() clientName: string;
  @IsOptional() @IsString() clientPhone?: string;
  @IsOptional() @IsNumber() propertyId?: number;
  @IsOptional() price?: number;
}

function generateContent(type: string, data: any): string {
  const d = new Date().toLocaleDateString('fr-MA');
  switch (type) {
    case 'sale': return `COMPROMIS DE VENTE\nDate: ${d}\n\nVENDEUR (Agent): ${data.agentName}\nACQUÉREUR: ${data.clientName} — Tél: ${data.clientPhone || '-'}\nBIEN: ${data.propertyAddress || 'À définir'}\nPRIX: ${data.price ? Number(data.price).toLocaleString('fr-MA') + ' MAD' : 'À définir'}\n\nConditions:\n- Acompte de 10% à la signature\n- Acte notarié dans les 90 jours\n- Frais de notaire à la charge de l'acquéreur\n\nFait à ${data.city || 'Maroc'}, le ${d}\n\nSignature Vendeur: _______________   Signature Acquéreur: _______________`;
    case 'rent': return `CONTRAT DE LOCATION\nDate: ${d}\n\nBAILLEUR: ${data.agentName}\nLOCATAIRE: ${data.clientName} — Tél: ${data.clientPhone || '-'}\nBIEN: ${data.propertyAddress || 'À définir'}\nLOYER MENSUEL: ${data.price ? Number(data.price).toLocaleString('fr-MA') + ' MAD' : 'À définir'}\nDURÉE: 1 an renouvelable\nDÉPÔT DE GARANTIE: 2 mois de loyer\n\nFait à ${data.city || 'Maroc'}, le ${d}`;
    case 'mandate': return `MANDAT DE VENTE\nDate: ${d}\n\nMANDANT: ${data.clientName} — Tél: ${data.clientPhone || '-'}\nMANDATAIRE (Agent): ${data.agentName}\nBIEN: ${data.propertyAddress || 'À définir'}\nPRIX DE VENTE: ${data.price ? Number(data.price).toLocaleString('fr-MA') + ' MAD' : 'À définir'}\nDURÉE: 3 mois\nHONORAIRES: 2.5% TTC du prix de vente\n\nFait à ${data.city || 'Maroc'}, le ${d}`;
    default: return `DOCUMENT\nDate: ${d}\nClient: ${data.clientName}`;
  }
}

@Injectable()
class ContractsService {
  constructor(
    @InjectRepository(Contract) private repo: Repository<Contract>,
    @InjectRepository(Agent) private agentRepo: Repository<Agent>,
    @InjectRepository(Property) private propRepo: Repository<Property>,
  ) {}

  async create(userId: number, dto: CreateContractDto) {
    const agent = await this.agentRepo.findOne({ where: { userId } });
    if (!agent) throw new NotFoundException('Agent introuvable');
    let propertyAddress: string | undefined;
    let price = dto.price;
    if (dto.propertyId) {
      const prop = await this.propRepo.findOne({ where: { id: dto.propertyId, agentId: agent.id } });
      if (prop) { propertyAddress = `${prop.title} — ${prop.city}`; if (!price) price = prop.price; }
    }
    const content = generateContent(dto.type, { clientName: dto.clientName, clientPhone: dto.clientPhone, propertyAddress, price, agentName: agent.name, city: agent.city });
    return this.repo.save(this.repo.create({ agentId: agent.id, type: dto.type, clientName: dto.clientName, clientPhone: dto.clientPhone, propertyId: dto.propertyId, content, status: 'draft' }));
  }

  async findAll(userId: number) {
    const agent = await this.agentRepo.findOne({ where: { userId } });
    if (!agent) throw new NotFoundException();
    return this.repo.find({ where: { agentId: agent.id }, order: { createdAt: 'DESC' } });
  }

  async findOne(userId: number, id: number) {
    const agent = await this.agentRepo.findOne({ where: { userId } });
    if (!agent) throw new NotFoundException();
    const c = await this.repo.findOne({ where: { id, agentId: agent.id } });
    if (!c) throw new NotFoundException('Contrat introuvable');
    return c;
  }

  async sign(userId: number, id: number) {
    const agent = await this.agentRepo.findOne({ where: { userId } });
    if (!agent) throw new NotFoundException();
    const c = await this.repo.findOne({ where: { id, agentId: agent.id } });
    if (!c) throw new NotFoundException();
    await this.repo.update(id, { status: 'signed', signedAt: new Date().toISOString() });
    return this.repo.findOne({ where: { id } });
  }
}

@ApiTags('Contracts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('agent')
@Controller('contracts')
class ContractsController {
  constructor(private svc: ContractsService) {}

  @Post() @ApiOperation({ summary: 'Generate contract with auto content' })
  create(@Body() dto: CreateContractDto, @Request() req) { return this.svc.create(req.user.id, dto); }

  @Get() @ApiOperation({ summary: 'List my contracts' })
  findAll(@Request() req) { return this.svc.findAll(req.user.id); }

  @Get(':id') @ApiOperation({ summary: 'Get contract detail' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) { return this.svc.findOne(req.user.id, id); }

  @Post(':id/sign') @ApiOperation({ summary: 'Sign contract' })
  sign(@Param('id', ParseIntPipe) id: number, @Request() req) { return this.svc.sign(req.user.id, id); }
}

@Module({
  imports: [TypeOrmModule.forFeature([Contract, Agent, Property])],
  providers: [ContractsService],
  controllers: [ContractsController],
})
export class ContractsModule {}
