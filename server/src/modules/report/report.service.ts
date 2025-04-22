import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { RequestUser } from 'src/common/type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from 'src/schema/report.schema';
import { isValidObjectId } from 'mongoose';
import { ReportStatus } from 'src/common/enums';

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

            return {
                status: true,
                data: saved
            }
        } catch (error) {
            console.error('Error creating report:', error);
            throw new BadRequestException(
                error?.message || 'Failed to create report',
            );
        }
    }

    async updateReport(reportId: string, reportDto: CreateReportDto, user: RequestUser) {
        try {
            if (!isValidObjectId(reportId)) {
                throw new BadRequestException('Invalid report ID');
            }

            if (!user?.id) {
                throw new BadRequestException('User ID is missing');
            }

            const existingReport = await this.reportModel.findById(reportId);

            if (!existingReport) {
                throw new NotFoundException('Report not found');
            }

            if (existingReport.reportedUserId.toString() !== user.id) {
                throw new ForbiddenException('You are not authorized to update this report');
            }

            if (existingReport.status === ReportStatus.ACTION_TAKEN) {
                throw new BadRequestException("Already taken action for this report!");
            }

            // Apply updates
            existingReport.text = reportDto.text;
            existingReport.location = reportDto.location;
            existingReport.assets = reportDto.assets;

            const updated = await existingReport.save();

            return {
                status: true,
                message: 'Report updated successfully',
                data: updated,
            };
        } catch (error) {
            console.error('Error updating report:', error);
            throw new BadRequestException(error?.message || 'Failed to update report');
        }
    }


    async deleteReport(reportId: string, user: RequestUser) {
        try {
            if (!isValidObjectId(reportId)) {
                throw new BadRequestException('Invalid report ID');
            }

            if (!user?.id) {
                throw new BadRequestException('User ID is missing');
            }

            const existingReport = await this.reportModel.findById(reportId);

            if (!existingReport) {
                throw new NotFoundException('Report not found');
            }

            if (existingReport.reportedUserId.toString() !== user.id) {
                throw new ForbiddenException('You are not authorized to update this report');
            }

            if (existingReport.status === ReportStatus.ACTION_TAKEN) {
                throw new BadRequestException("Already taken action for this report!");
            }


            await this.reportModel.deleteOne({ _id: reportId });

            return {
                status: true,
                message: 'Report deleted successfully',
            };
        } catch (error) {
            console.error('Error deleting report:', error);
            throw new BadRequestException(error?.message || 'Failed to delete report');
        }
    }

}
