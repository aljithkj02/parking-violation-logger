import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'generated/prisma';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ enum: Role, default: Role.USER })
    role: Role;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Report' }] })
    reports: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Report' }] })
    solvedReports: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
