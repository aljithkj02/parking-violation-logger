import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user.schema';
import { Report, ReportSchema } from 'src/schema/report.schema';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.DATABASE_URL as string),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Report.name, schema: ReportSchema },
        ]),
        AuthModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
