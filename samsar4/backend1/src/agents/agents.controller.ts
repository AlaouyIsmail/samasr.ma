import { Controller, Get, Patch, Post, Param, Body, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators';
import { AgentsService } from './agents.service';

@ApiTags('Agent')
@Controller('agent')
export class AgentsController {
  constructor(private svc: AgentsService) {}

  @Get('dashboard') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('agent') @ApiBearerAuth()
  @ApiOperation({ summary: 'Agent dashboard: stats + properties' })
  dashboard(@Request() req) { return this.svc.getDashboard(req.user.id); }

  @Get('profile') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('agent') @ApiBearerAuth()
  profile(@Request() req) { return this.svc.getProfile(req.user.id); }

  @Patch('profile') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('agent') @ApiBearerAuth()
  updateProfile(@Body() dto: any, @Request() req) { return this.svc.updateProfile(req.user.id, dto); }

  @Get('notifications') @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  notifications(@Request() req) { return this.svc.getNotifications(req.user.id); }

  @Post('notifications/read-all') @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  readAll(@Request() req) { return this.svc.readAll(req.user.id); }
}

@ApiTags('Agents (public)')
@Controller('agents')
export class AgentsPublicController {
  constructor(private svc: AgentsService) {}

  @Get(':id') @ApiOperation({ summary: 'Public agent profile' })
  publicProfile(@Param('id', ParseIntPipe) id: number) { return this.svc.getPublicProfile(id); }
}
