import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Card } from '../components/ui';
import { Search, Filter, MessageSquare, AlertCircle, ArrowRight, ArrowDown, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const IssueList = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const res = await api.get('/issues/');
                setIssues(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, []);

    const filteredIssues = issues.filter(issue =>
        statusFilter === 'all' ? true : issue.status === statusFilter
    );

    const getStatusBadge = (status) => {
        const styles = {
            open: 'bg-green-50 text-green-700 border-green-200',
            in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
            closed: 'bg-slate-100 text-slate-600 border-slate-200',
            resolved: 'bg-purple-50 text-purple-700 border-purple-200'
        };

        const icons = {
            open: <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>,
            in_progress: <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>,
            closed: <div className="w-2 h-2 rounded-sm bg-slate-500 mr-2"></div>,
            resolved: <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
        }

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center w-fit ${styles[status] || styles.open}`}>
                {icons[status]}
                <span className="capitalize">{status.replace('_', ' ')}</span>
            </span>
        );
    };

    // Mock priority/tags since backend only has Labels (names)
    // We will map labels to badges styles
    const getLabelBadge = (label) => {
        const colorMap = {
            bug: 'bg-red-50 text-red-700 border-red-100',
            urgent: 'bg-red-50 text-red-700 border-red-100',
            feature: 'bg-purple-50 text-purple-700 border-purple-100',
            enhancement: 'bg-cyan-50 text-cyan-700 border-cyan-100',
            documentation: 'bg-amber-50 text-amber-700 border-amber-100',
            'help-wanted': 'bg-green-50 text-green-700 border-green-100'
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${colorMap[label.name] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {label.name}
            </span>
        );
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#0F172A]">Issues</h2>
                    <p className="text-slate-500 text-sm">{filteredIssues.length} issues found</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <Filter className="w-4 h-4" />
                    Filters:
                </div>
                <select
                    className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                </select>
                <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                    <option>All Priority</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>
            </div>

            <div className="space-y-4">
                {filteredIssues.map((issue) => (
                    <div key={issue.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow group cursor-pointer relative">
                        <Link to={`/issues/${issue.id}`} className="absolute inset-0 z-0"></Link>
                        <div className="flex items-start justify-between relative z-10 pointer-events-none">
                            <div className="space-y-3 max-w-3xl">
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-400 text-xs font-mono font-medium uppercase tracking-wider">ISS-{String(issue.id).padStart(3, '0')}</span>
                                    {issue.id % 3 === 0 ? (
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                    ) : issue.status === 'in_progress' ? (
                                        <ArrowRight className="w-4 h-4 text-blue-500" />
                                    ) : (
                                        <ArrowDown className="w-4 h-4 text-slate-400" />
                                    )}
                                </div>

                                <h3 className="text-lg font-semibold text-[#0F172A] group-hover:text-blue-600 transition-colors">
                                    {issue.title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-3">
                                    {getStatusBadge(issue.status)}
                                    {issue.labels && issue.labels.map(l => getLabelBadge(l))}
                                </div>
                            </div>

                            <div className="flex items-center gap-6 mt-1">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-sm font-medium">{issue.comments ? issue.comments.length : 0}</span>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 mb-1 justify-end">
                                        {issue.assignee && (
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${issue.assignee.name}`}
                                                className="w-6 h-6 rounded-full bg-slate-100"
                                                title={`Assigned to ${issue.assignee.name}`}
                                            />
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">
                                        {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredIssues.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-500">No issues found matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueList;
