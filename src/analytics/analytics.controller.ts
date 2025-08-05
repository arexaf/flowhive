import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwtauth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard) // optional, protects endpoints
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('user/:userId')
  getUserAnalytics(@Param('userId') userId: number) {
    return this.analyticsService.getUserAnalytics(userId);
  }

  @Get()
  getAllAnalytics() {
    return this.analyticsService.getAllAnalytics();
  }
}
