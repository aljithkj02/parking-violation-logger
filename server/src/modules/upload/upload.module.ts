import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CloudinaryService } from 'src/common/cloudinary.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UploadController],
  providers: [UploadService, CloudinaryService, ConfigService],
})
export class UploadModule {}
