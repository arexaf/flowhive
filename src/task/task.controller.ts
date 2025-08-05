// src/task/task.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: number): Promise<Task[]> {
    return this.taskService.findByProject(projectId);
  }

  @Post()
  create(@Body() data: { title: string; description?: string; projectId: number; assignedToId?: number }): Promise<Task> {
    return this.taskService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Task>): Promise<Task> {
    return this.taskService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.taskService.remove(id);
  }
}
