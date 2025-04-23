import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReportStatus } from 'src/common/enums';

export class ResolveReportDto {
    @IsNotEmpty()
    @IsEnum(ReportStatus, { message: 'Report status must be either UNDER_REVIEW or ACTION_TAKEN' })
    status: ReportStatus;
}
