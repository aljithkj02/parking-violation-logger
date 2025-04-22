import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from 'src/schema/report.schema';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }])
    ],
    controllers: [ReportController],
    providers: [ReportService],
})
export class ReportModule { }
