// src/chat/chat.controller.ts
import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwtauth.guard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('project/:projectId')
  sendProjectMessage(
    @Param('projectId') projectId: number,
    @Body('message') message: string,
    @Req() req,
  ) {
    return this.chatService.sendProjectMessage(req.user.id, +projectId, message);
  }

  @Post('dm/:recipientId')
  sendDirectMessage(
    @Param('recipientId') recipientId: number,
    @Body('message') message: string,
    @Req() req,
  ) {
    return this.chatService.sendDirectMessage(req.user.id, +recipientId, message);
  }

  @Get('project/:projectId')
  getProjectMessages(@Param('projectId') projectId: number) {
    return this.chatService.getProjectMessages(+projectId);
  }

  @Get('dm/:otherUserId')
  getDirectMessages(@Param('otherUserId') otherUserId: number, @Req() req) {
    return this.chatService.getDirectMessages(req.user.id, +otherUserId);
  }
}
