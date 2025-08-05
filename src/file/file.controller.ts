// src/file/file.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Param,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwtauth.guard';
import { FileService } from './file.service';
import { TaskService } from '../task/task.service';
import { UserService } from '../user/user.service';
import * as path from 'path';

@Controller('files')
export class FileController {
  constructor(
    private fileService: FileService,
    private taskService: TaskService,
    private userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('task/:taskId/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${file.originalname}`;
        cb(null, name);
      },
    }),
  }))
  async uploadFile(
    @Param('taskId') taskId: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const task = await this.taskService.findById(taskId);
    const user = await this.userService.findOne(req.user.id);

    return this.fileService.saveFile({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      task,
      uploadedBy: user,
    });
  }
}
