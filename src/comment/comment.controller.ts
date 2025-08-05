// src/comment/comment.controller.ts
import { Controller, Post, Get, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwtauth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':taskId')
  create(@Param('taskId') taskId: number, @Body('content') content: string, @Request() req) {
    return this.commentService.create(content, taskId, req.user.id);
  }

  @Get('task/:taskId')
  findByTask(@Param('taskId') taskId: number) {
    return this.commentService.findByTask(taskId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number, @Request() req) {
    return this.commentService.delete(id, req.user.id);
  }
}
