import {
    IsString,
    IsNotEmpty,
    IsArray,
    ArrayMinSize,
    IsUrl,
} from 'class-validator';

export class CreateReportDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsArray()
    @ArrayMinSize(1, { message: 'At least one asset URL is required.' })
    @IsUrl({}, { each: true, message: 'Each asset must be a valid URL.' })
    assets: string[];
}
