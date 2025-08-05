// src/project/project.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { Task } from 'src/task/task.entity';
import { TaskService } from 'src/task/task.service';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService
  ) {}

  @Get('project/:projectId/tasks')
  getProjectTasks(@Param('projectId') projectId: number): Promise<Task[]> {
    return this.taskService.findByProject(projectId);
  }

  @Post(':workspaceId')
  create(@Param('workspaceId') workspaceId: number, @Body() data: Partial<Project>): Promise<Project> {
    return this.projectService.create(workspaceId, data);
  }

  @Get()
  findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Project | null> {
    return this.projectService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Project>): Promise<Project> {
    return this.projectService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.projectService.remove(id);
  }

  // project.controller.ts
  @Put(':projectId/add-collaborator/:userId')
  async addCollaborator(
    @Param('projectId') projectId: number,
    @Param('userId') userId: number,
  ): Promise<Project> {
    return this.projectService.addCollaborator(projectId, userId);
  }

}
