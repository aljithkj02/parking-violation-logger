import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RequestUser } from 'src/common/type';
import { Request } from 'express';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Put()
    updateProfile(
        @Req() req: Request,
        @Body() updateProfileDto: UpdateProfileDto
    ) {
        return this.profileService.updateProfile(updateProfileDto, req.user as RequestUser)
    }
}
