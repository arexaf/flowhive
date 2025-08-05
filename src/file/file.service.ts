// src/file/file.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';

@Injectable()
export class FileService {
  constructor(@InjectRepository(File) private fileRepo: Repository<File>) {}

  async saveFile(data: Partial<File>): Promise<File> {
    const file = this.fileRepo.create(data);
    return this.fileRepo.save(file);
  }

  async findByTask(taskId: number): Promise<File[]> {
    return this.fileRepo.find({ where: { task: { id: taskId } } });
  }
}
