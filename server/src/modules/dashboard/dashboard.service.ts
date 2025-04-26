import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from 'src/schema/report.schema';
import { User } from 'src/schema/user.schema';
import { DashboardQueryDto, Range } from './dto/dashboard-query.dto';
import * as moment from 'moment';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Report.name) private reportModel: Model<Report>,
        @InjectModel(User.name) private userModel: Model<User>
    ) { }
    async getDashboardData({ range }: DashboardQueryDto) {
        const now = moment().endOf('day');
        let startDate: moment.Moment;
    
        if (range === Range.WEEK) {
            startDate = now.clone().subtract(6, 'days').startOf('day');
        } else if (range === Range.MONTH) {
            startDate = now.clone().subtract(29, 'days').startOf('day');
        } else {
            startDate = now.clone().subtract(11, 'months').startOf('month');
        }
    
        const [totalReports, reportsInRange, solvedReports, pendingReports, reportsOverTimeRaw] =
            await Promise.all([
                this.reportModel.countDocuments({}),
                this.reportModel.countDocuments({
                    createdAt: { $gte: startDate.toDate(), $lte: now.toDate() },
                }),
                this.reportModel.countDocuments({ status: 'ACTION_TAKEN' }),
                this.reportModel.countDocuments({ status: 'UNDER_REVIEW' }),
                this.reportModel.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: startDate.toDate(),
                                $lte: now.toDate(),
                            },
                        },
                    },
                    {
                        $group: {
                            _id:
                                range === Range.YEAR
                                    ? { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }
                                    : {
                                          year: { $year: '$createdAt' },
                                          month: { $month: '$createdAt' },
                                          day: { $dayOfMonth: '$createdAt' },
                                      },
                            count: { $sum: 1 },
                        },
                    },
                    {
                        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
                    },
                ]),
            ]);
    
        let reportsOverTime: any = [];
    
        if (range === Range.YEAR) {
            reportsOverTime = Array.from({ length: 12 }, (_, i) => {
                const target = moment().subtract(11 - i, 'months');
                const match = reportsOverTimeRaw.find(
                    (r) =>
                        r._id.month === target.month() + 1 &&
                        r._id.year === target.year()
                );
                return {
                    label: target.format('MMM YYYY'),
                    count: match?.count || 0,
                };
            });
        } else {
            const totalDays = range === Range.MONTH ? 30 : 7;
            reportsOverTime = Array.from({ length: totalDays }, (_, i) => {
                const target = moment().subtract(totalDays - 1 - i, 'days');
                const match = reportsOverTimeRaw.find(
                    (r) =>
                        r._id.day === target.date() &&
                        r._id.month === target.month() + 1 &&
                        r._id.year === target.year()
                );
                return {
                    label: target.format('DD MMM'),
                    count: match?.count || 0,
                };
            });
        }
    
        return {
            totalReports,
            reportsInRange,
            solvedReports,
            pendingReports,
            reportsOverTime,
        };
    }
}
