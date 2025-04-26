import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { fetchDashboard } from '../store/slices/dashboardSlice';
import { RangeFilter } from '../utils/dashboard.type';
import { Loader } from '../components/common/Loader';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';

export const Dashboard = () => {
    const { data, loading } = useAppSelector((state) => state.dashboard);
    const [range, setRange] = useState<RangeFilter>(RangeFilter.WEEK);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchDashboard(range));
        console.log(range);
    }, [range]);

    const handleRangeChange = (newRange: RangeFilter) => {
        setRange(newRange);
    };

    const renderChart = (data: any) => {
        return (
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    const pieData = [
        { name: 'Solved', value: data?.solvedReports || 0 },
        { name: 'Pending', value: data?.pendingReports || 0 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-8"
        >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {/* Filter Tabs */}
            <div className="flex space-x-4 md:space-x-6 mb-8">
                {Object.values(RangeFilter).map((item) => (
                    <motion.button
                        key={item}
                        onClick={() => handleRangeChange(item)}
                        whileHover={{ scale: 1.05 }}
                        className={`text-base md:text-lg py-2 px-6 rounded-full transition-all duration-300 ${range === item
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                            }`}
                    >
                        {item}
                    </motion.button>
                ))}
            </div>

            {/* Loader */}
            {loading && <Loader />}

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Reports', value: data?.totalReports },
                    { label: 'Reports in Range', value: data?.reportsInRange },
                    { label: 'Solved Reports', value: data?.solvedReports },
                    { label: 'Pending Reports', value: data?.pendingReports },
                ].map((card, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="p-6 bg-white shadow-lg rounded-lg hover:scale-105 transition-all duration-300"
                    >
                        <h2 className="text-lg md:text-xl text-gray-600">{card.label}</h2>
                        <p className="text-2xl md:text-3xl font-bold text-blue-600">{card.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Pie Chart: Solved vs Pending */}
            <div className="p-6 bg-white shadow-lg rounded-lg mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Report Status Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#3B82F6"
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3B82F6' : '#4ADE80'} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Legend for Pie chart */}
                <div className="flex justify-start space-x-6 text-sm md:text-base mt-4">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#3B82F6] mr-2"></div>
                        <span>Action Taken (Solved)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#4ADE80] mr-2"></div>
                        <span>Under Review (Pending)</span>
                    </div>
                </div>
            </div>

            {/* Reports Over Time (Bar Chart) */}
            <div className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports Over Time</h2>
                {renderChart(data?.reportsOverTime || [])}
            </div>
        </motion.div>
    );
};
