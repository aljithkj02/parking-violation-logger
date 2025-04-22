import { IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportStatus } from 'src/common/enums';

export class QueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a valid number' })
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a valid number' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit: number = 10;

  @IsOptional()
  @IsEnum(ReportStatus, { message: 'Filter must be one of: UNDER_REVIEW, ACTION_TAKEN' })
  filter?: ReportStatus;
}
