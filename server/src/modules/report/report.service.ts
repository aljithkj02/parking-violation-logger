import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { RequestUser } from 'src/common/type';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report } from 'src/schema/report.schema';
import { isValidObjectId } from 'mongoose';
import { ReportStatus, Role } from 'src/common/enums';
import { QueryDto } from './dto/query.dto';
import { ResolveReportDto } from './dto/resolve-report.dto';

@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Report.name) private reportModel: Model<Report>
    ) { }

    async getReports(user: RequestUser, { page, limit, filter }: QueryDto) {
        try {
            const skip = (page - 1) * limit;
            const isAdmin = user.role === Role.ADMIN;

            const [total, reports] = await Promise.all([
                this.reportModel.countDocuments({
                    ...(!isAdmin && { reportedUserId: user.id }),
                    ...(filter && { status: filter })
                }),
                this.reportModel
                    .find({
                        ...(!isAdmin && { reportedUserId: user.id }),
                        ...(filter && { status: filter })
                    })
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .populate(
                        isAdmin ? 'reportedUserId' : '',
                        isAdmin ? 'name email profileImg' : ''
                    )
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                status: true,
                data: reports,
                pagination: {
                    total,
                    currentPage: page,
                    totalPages,
                }
            };
        } catch (error) {
            console.error('Error fetching reports:', error);
            throw new BadRequestException(error?.message || 'Failed to fetch reports');
        }
    }

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

            if (user.role === Role.USER) {
                if (existingReport.reportedUserId.toString() !== user.id) {
                    throw new ForbiddenException('You are not authorized to update this report');
                }

                if (existingReport.status === ReportStatus.ACTION_TAKEN) {
                    throw new BadRequestException("Already taken action for this report!");
                }

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

    async resolveReport(reportId: string, { status }: ResolveReportDto, user: RequestUser) {
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

            // Apply updates
            existingReport.status = status;
            existingReport.solvedUserId = user.id as unknown as Types.ObjectId;

            const updated = await existingReport.save();

            return {
                status: true,
                message: 'Report updated successfully',
                data: updated,
            };
        } catch (error) {
            console.error('Error resolving report:', error);
            throw new BadRequestException(error?.message || 'Failed to resolve report');
        }
    }
}
