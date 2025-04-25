import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user.schema';
import { Report, ReportSchema } from 'src/schema/report.schema';
import { ReportModule } from './report/report.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { UploadModule } from './upload/upload.module';
import { ProfileModule } from './profile/profile.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.DATABASE_URL as string),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Report.name, schema: ReportSchema },
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        AuthModule,
        ReportModule,
        UploadModule,
        ProfileModule
    ],
    controllers: [],
    providers: [JwtStrategy, JwtService],
})
export class AppModule { }
