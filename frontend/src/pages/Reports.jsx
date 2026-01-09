import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Card } from '../components/ui';
import { Clock, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Reports = () => {
    const [stats, setStats] = useState({ latency: null, topAssignees: [] });
    const [loading, setLoading] = useState(true);

    // Mock data for charts as we don't have endpoints for these specifics yet
    const statusData = [
        { name: 'Open', value: 35, color: '#22c55e' },
        { name: 'In Progress', value: 25, color: '#3b82f6' },
        { name: 'Resolved', value: 20, color: '#a855f7' },
        { name: 'Closed', value: 20, color: '#64748b' },
    ];

    const priorityData = [
        { name: 'Low', value: 4 },
        { name: 'Medium', value: 8 },
        { name: 'High', value: 4 },
        { name: 'Critical', value: 8 },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [latencyRes, assigneesRes] = await Promise.all([
                    api.get('/reports/latency'),
                    api.get('/reports/top-assignees')
                ]);
                setStats({
                    latency: latencyRes.data.average_resolution_time,
                    topAssignees: assigneesRes.data
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-[#0F172A]">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-${color}-50`}>
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">{subtext}</p>
        </div>
    );

    const getLatencyDisplay = () => {
        if (!stats.latency) return 'N/A';
        // simple parse assuming postgres interval string
        return stats.latency.split('.')[0].replace(':', 'h ') + 'm';
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-[#0F172A]">Reports</h2>
                <p className="text-slate-500">Analytics and insights about your issues</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Avg. Resolution Time"
                    value={getLatencyDisplay()}
                    subtext="Based on last 30 days"
                    icon={Clock}
                    color="blue"
                />
                <StatCard
                    title="Median Resolution"
                    value="36.2h" // Mock
                    subtext="Half resolved faster"
                    icon={TrendingUp}
                    color="green"
                />
                <StatCard
                    title="Issues Resolved"
                    value="31" // Mock
                    subtext="In 30 days"
                    icon={CheckCircle2}
                    color="purple"
                />
                <StatCard
                    title="Active Assignees"
                    value={stats.topAssignees.length}
                    subtext="With assigned issues"
                    icon={Users}
                    color="indigo"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-6">Status Distribution</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-xs font-medium text-slate-600">
                        {statusData.map(item => (
                            <div key={item.name} className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full" style={{ background: item.color }}></span>
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-6">Priority Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tickMargin={10} />
                                {/* <YAxis axisLine={false} tickLine={false} fontSize={12} /> */}
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="value" fill="#0F172A" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
