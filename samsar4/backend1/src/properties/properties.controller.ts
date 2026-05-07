import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators';
import { PropertiesService } from './properties.service';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private svc: PropertiesService) {}

  @Get() @ApiOperation({ summary: 'List properties with filters' })
  findAll(@Query() q: any) { return this.svc.findAll(q); }

  @Get(':id') @ApiOperation({ summary: 'Get property detail + increment view' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }

  @Post(':id/like') @ApiOperation({ summary: 'Like a property' })
  like(@Param('id', ParseIntPipe) id: number) { return this.svc.like(id); }

  @Post(':id/save') @ApiOperation({ summary: 'Save a property' })
  save(@Param('id', ParseIntPipe) id: number) { return this.svc.save(id); }

  @Post(':id/whatsapp-click') @ApiOperation({ summary: 'Track WhatsApp click' })
  wa(@Param('id', ParseIntPipe) id: number) { return this.svc.whatsappClick(id); }

  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('agent') @ApiBearerAuth()
  @ApiOperation({ summary: 'Create property (agent)' })
  create(@Body() dto: any, @Request() req) { return this.svc.create(req.user.id, dto); }

  @Patch(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('agent') @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own property' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Request() req) { return this.svc.update(id, req.user.id, dto); }

  @Delete(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('agent') @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete own property' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) { return this.svc.remove(id, req.user.id); }
}
