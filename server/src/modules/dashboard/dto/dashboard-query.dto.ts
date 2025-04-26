import { IsEnum } from "class-validator";

export enum Range {
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year'
}

export class DashboardQueryDto {
    @IsEnum(Range)
    range: Range = Range.WEEK;
}