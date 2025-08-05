// src/analytics/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics } from './analytics.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private analyticsRepo: Repository<Analytics>,
  ) {}

  async track(userId: number, event: string, metadata?: any) {
    const analytics = this.analyticsRepo.create({
      userId,
      event,
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
    return this.analyticsRepo.save(analytics);
  }

  async getUserAnalytics(userId: number) {
    return this.analyticsRepo.find({
      where: { userId },
      order: { timestamp: 'DESC' },
    });
  }

  async getAllAnalytics() {
    return this.analyticsRepo.find({ order: { timestamp: 'DESC' } });
  }
}
