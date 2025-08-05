// src/workspace/workspace.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/jwtauth.guard';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  create(@Body('name') name: string, @Request() req) {
    return this.workspaceService.create(name, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.workspaceService.findByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.workspaceService.findOne(+id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.workspaceService.delete(+id);
  }
}
