import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RequestUser } from 'src/common/type';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async updateProfile({ name, profileImg }: UpdateProfileDto, user: RequestUser) {
        try {
            if (!user?.id) {
                throw new BadRequestException('User ID is missing');
            }

            const userInfo = await this.userModel.findById(user.id);

            if (!userInfo) {
                throw new NotFoundException('User not found');
            }

            // Apply updates
            userInfo.name = name;
            if (profileImg) {
                userInfo.profileImg = profileImg;
            }

            const updated = await userInfo.save();

            return {
                status: true,
                message: 'Profile updated successfully',
                data: updated,
            };
        } catch (error) {
            console.error('Error updating profile:', error);
            throw new BadRequestException(error?.message || 'Failed to update profile');
        }
    }
}
