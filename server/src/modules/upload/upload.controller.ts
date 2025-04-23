import {
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
    BadRequestException,
    UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from 'src/common/cloudinary.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('files', 3, {
        storage: memoryStorage(),
        limits: { files: 3 },
    }))
    async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new BadRequestException('At least one file must be uploaded');
        }
        const urls = await Promise.all(
            files.map(file => this.cloudinaryService.uploadFile(file)),
        );

        return {
            status: true,
            data: urls
        };
    }
}
