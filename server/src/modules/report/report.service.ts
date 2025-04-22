import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { RequestUser } from 'src/common/type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from 'src/schema/report.schema';

@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Report.name) private reportModel: Model<Report>
    ) { }

    async createReport(reportDto: CreateReportDto, user: RequestUser) {
        try {
            const { text, location, assets } = reportDto;

            if (!user?.id) {
                throw new BadRequestException('User ID is missing');
            }

            const newReport = new this.reportModel({
                text,
                location,
                assets,
                reportedUserId: user.id
            });

            const saved = await newReport.save();

            return saved
        } catch (error) {
            console.error('Error creating report:', error);
            throw new BadRequestException(
                error?.message || 'Failed to create report',
            );
        }
    }

}
