import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReportStatus } from 'src/common/enums';

@Schema({ timestamps: true })
export class Report extends Document {
    @Prop({ required: true })
    text: string;

    @Prop({ required: true })
    location: string;

    @Prop({ type: [String] })
    assets: string[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    reportedUserId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    solvedUserId: Types.ObjectId;

    @Prop({ enum: ReportStatus, default: ReportStatus.UNDER_REVIEW })
    status: ReportStatus;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
