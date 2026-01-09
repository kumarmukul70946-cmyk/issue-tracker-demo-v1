import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import {
    Clock, CheckCircle2, CircleDot, Loader2,
    MessageSquare, AlertCircle, ArrowRight, ArrowDown
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
    const [stats, setStats] = useState({
        open: 0,
        inProgress: 0,
        resolved: 0,
        avgResolution: '0h'
    });
    const [recentIssues, setRecentIssues] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [issuesRes, latencyRes] = await Promise.all([
                    api.get('/issues/'),
                    api.get('/reports/latency'),
                ]);

                const allIssues = issuesRes.data;

                // Calculate Stats
                const open = allIssues.filter(i => i.status === 'open').length;
                const inProgress = allIssues.filter(i => i.status === 'in_progress').length;
                const closed = allIssues.filter(i => i.status === 'closed').length; // Mapping closed to Resolved for UI

                setStats({
                    open,
                    inProgress,
                    resolved: closed,
                    avgResolution: latencyRes.data.average_resolution_time
                        ? latencyRes.data.average_resolution_time.split('.')[0].replace(':', 'h ') + 'm'
                        : '0h'
                });

                // Recent Issues (sort by ID or created_at desc)
                setRecentIssues(allIssues.sort((a, b) => b.id - a.id).slice(0, 5));

                // Process Top Assignees from full list to get names/stats
                const assigneeMap = {};
                allIssues.forEach(issue => {
                    if (!issue.assignee) return;
                    const id = issue.assignee.id;
                    if (!assigneeMap[id]) {
                        assigneeMap[id] = {
                            id,
                            name: issue.assignee.name,
                            total: 0,
                            resolved: 0
                        };
                    }
                    assigneeMap[id].total += 1;
                    if (issue.status === 'closed') {
                        assigneeMap[id].resolved += 1;
                    }
                });

                const sortedAssignees = Object.values(assigneeMap)
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 4);

                setAssignees(sortedAssignees);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, bg }) => (
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
                <div className="flex flex-col h-full justify-between">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-4xl font-bold text-[#0F172A]">{value}</h3>
                </div>
                <div className={`p-2 rounded-full ${bg}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
        </div>
    );

    const getStatusBadge = (status) => {
        const styles = {
            open: 'bg-green-50 text-green-700 border-green-200',
            in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
            closed: 'bg-purple-50 text-purple-700 border-purple-200'
        };

        const icons = {
            open: <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>,
            in_progress: <Loader2 className="w-3 h-3 text-blue-500 animate-spin mr-2" />,
            closed: <CheckCircle2 className="w-3 h-3 text-purple-500 mr-2" />
        };

        const labels = {
            open: 'Open',
            in_progress: 'In Progress',
            closed: 'Resolved'
        };

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center w-fit ${styles[status]}`}>
                {icons[status]}
                {labels[status]}
            </span>
        );
    };

    const getPriorityBadge = (id) => {
        // Mock priority based on ID for visual consistency with design image
        const priorities = [
            { label: 'urgent', style: 'bg-red-50 text-red-700 border-red-100' },
            { label: 'high', style: 'bg-orange-50 text-orange-700 border-orange-100' },
            { label: 'medium', style: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
            { label: 'low', style: 'bg-slate-100 text-slate-600 border-slate-200' },
        ];
        // Random deterministic priority
        const p = priorities[id % priorities.length];
        return (
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${p.style}`}>
                {p.label}
            </span>
        );
    };

    const getLabelBadge = (label) => {
        const colorMap = {
            bug: 'bg-red-50 text-red-700 border-red-100',
            feature: 'bg-purple-50 text-purple-700 border-purple-100',
            enhancement: 'bg-cyan-50 text-cyan-700 border-cyan-100',
            documentation: 'bg-amber-50 text-amber-700 border-amber-100',
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${colorMap[label.name] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {label.name}
            </span>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Search Header included in Layout, so we skip here or put breadcrumb? Layout handles header. */}

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Open Issues"
                    value={stats.open}
                    icon={CircleDot}
                    color="text-green-500"
                    bg="bg-green-50"
                />
                <StatCard
                    title="In Progress"
                    value={stats.inProgress}
                    icon={Loader2}
                    color="text-blue-500"
                    bg="bg-blue-50"
                />
                <StatCard
                    title="Resolved"
                    value={stats.resolved}
                    icon={CheckCircle2}
                    color="text-purple-500"
                    bg="bg-purple-50"
                />
                <StatCard
                    title="Avg. Resolution"
                    value={stats.avgResolution.split('h')[0] + 'h'} // Simplify for design match
                    icon={Clock}
                    color="text-slate-500"
                    bg="bg-slate-100"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Issues Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#0F172A]">Recent Issues</h3>
                        <Link to="/issues" className="text-sm font-medium text-slate-500 hover:text-[#0F172A]">View all</Link>
                    </div>

                    <div className="space-y-4">
                        {recentIssues.map(issue => (
                            <div key={issue.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-400 text-xs font-mono font-medium uppercase tracking-wider">
                                                ISS-{String(issue.id).padStart(3, '0')}
                                            </span>
                                            {issue.id % 3 === 0 ? <AlertCircle className="w-3.5 h-3.5 text-red-500" /> : <ArrowRight className="w-3.5 h-3.5 text-blue-500" />}
                                        </div>

                                        <h4 className="font-semibold text-[#0F172A] text-lg hover:text-blue-600 transition-colors">
                                            <Link to={`/issues/${issue.id}`}>{issue.title}</Link>
                                        </h4>

                                        <div className="flex flex-wrap items-center gap-2">
                                            {getStatusBadge(issue.status)}
                                            {getLabelBadge({ name: issue.id % 2 === 0 ? 'bug' : 'feature' })} {/* Mock if no labels or supplement */}
                                            {issue.labels && issue.labels.map(l => getLabelBadge(l))}
                                            {/* {getPriorityBadge(issue.id)} */}
                                        </div>
                                    </div>

                                    <div className="text-right flex flex-col items-end gap-3 h-full justify-between">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${issue.assignee ? issue.assignee.name : 'Unassigned'}`}
                                            className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200"
                                        />
                                        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium whitespace-nowrap">
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="w-3.5 h-3.5" /> {issue.comments ? issue.comments.length : 0}
                                            </span>
                                            <span>
                                                {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {recentIssues.length === 0 && !loading && (
                            <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500">
                                No issues found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Assignees Column */}
                <div>
                    <h3 className="text-lg font-bold text-[#0F172A] mb-6">Top Assignees</h3>
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <div className="space-y-6">
                            {assignees.map((user, index) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-slate-400 font-bold w-4">#{index + 1}</span>
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                            className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200"
                                        />
                                        <div>
                                            <p className="font-semibold text-[#0F172A] text-sm">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.resolved} resolved</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#0F172A] text-sm">{user.total}</p>
                                        <p className="text-xs text-slate-400">total</p>
                                    </div>
                                </div>
                            ))}
                            {assignees.length === 0 && (
                                <p className="text-slate-500 text-sm text-center">No assignee data available.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
