import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Request } from 'express';
import { CreateReportDto } from './dto/create-report.dto';
import { RequestUser } from 'src/common/type';

@Controller('report')
@UseGuards(JwtAuthGuard)
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Post()
    createReport(
        @Req() req: Request,
        @Body() createReportDto: CreateReportDto
    ) {
        return this.reportService.createReport(createReportDto, req.user as RequestUser);
    }
}
