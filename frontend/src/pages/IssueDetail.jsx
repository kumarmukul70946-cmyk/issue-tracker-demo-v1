import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Card, Badge, Button } from '../components/ui';
import { ArrowLeft, Send, User, Clock, CheckCircle2 } from 'lucide-react';

const IssueDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Status mapping for dropdown
    const statuses = ['open', 'in_progress', 'closed'];

    const [timeline, setTimeline] = useState([]);

    const fetchIssue = async () => {
        try {
            // Parallel fetch
            const [issueRes, timelineRes] = await Promise.all([
                api.get(`/issues/${id}`),
                api.get(`/issues/${id}/timeline`)
            ]);
            setIssue(issueRes.data);
            setTimeline(timelineRes.data);
        } catch (e) {
            console.error(e);
            // Handle 404
            if (e.response && e.response.status === 404) navigate('/issues');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssue();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        try {
            // Implementing optimistic update or full refresh
            // Need current version for optimistic locking
            await api.patch(`/issues/${id}`, {
                status: newStatus,
                version: issue.version
            });
            fetchIssue(); // Refresh to get new version
        } catch (e) {
            alert('Failed to update status: ' + (e.response?.data?.detail || e.message));
            fetchIssue(); // Revert
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await api.post(`/issues/${id}/comments`, {
                body: newComment,
                author_id: 1 // Mock User
            });
            setNewComment('');
            fetchIssue();
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;
    if (!issue) return null;

    return (
        <div className="space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Issues
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <h1 className="text-3xl font-bold text-slate-900">{issue.title}</h1>
                            <span className="text-slate-400 text-xl">#{issue.id}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <Badge color={issue.status === 'open' ? 'green' : issue.status === 'closed' ? 'gray' : 'blue'}>
                                {issue.status}
                            </Badge>
                            <span className="flex items-center gap-1">
                                <User className="w-4 h-4" /> {issue.assignee?.name || 'Unassigned'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" /> {new Date(issue.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <Card>
                        <div className="prose prose-slate max-w-none">
                            <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                                {issue.description || 'No description provided.'}
                            </p>
                        </div>
                    </Card>

                    {/* Timeline & Comments */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-200">
                            <div className="px-4 py-2 border-b-2 border-indigo-600 font-medium text-indigo-600">
                                Timeline & Comments
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200">
                            {timeline.map((event, idx) => (
                                <div key={idx} className="relative animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <div className="absolute -left-[25px] w-5 h-5 rounded-full bg-slate-100 border-2 border-white ring-1 ring-slate-200 flex items-center justify-center z-10">
                                        <div className={`w-1.5 h-1.5 rounded-full ${event.event_type === 'created' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-semibold text-slate-900 capitalize">{event.event_type.replace('_', ' ')}</span>
                                        <span className="text-slate-600 mx-1">-</span>
                                        <span className="text-slate-500">{event.details}</span>
                                        <div className="text-xs text-slate-400 mt-1">{new Date(event.created_at).toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 pt-4 border-t border-slate-100">Discussion</h3>

                        {issue.comments && issue.comments.map((comment) => (
                            <Card key={comment.id} className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {comment.author?.name ? comment.author.name.charAt(0) : 'U'}
                                        </div>
                                        <span className="font-semibold text-sm text-slate-900">{comment.author?.name || 'Unknown User'}</span>
                                        <span className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                                <p className="text-slate-700 text-sm whitespace-pre-wrap">{comment.body}</p>
                            </Card>
                        ))}

                        <Card className="p-4 bg-slate-50 border-slate-200">
                            <form onSubmit={handlePostComment}>
                                <textarea
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none text-sm transition-shadow resize-y min-h-[100px]"
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <div className="flex justify-end mt-3">
                                    <Button type="submit" disabled={!newComment.trim() || submitting}>
                                        {submitting ? 'Posting...' : 'Post Comment'} <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Sidebar Actions */}
                    <Card>
                        <h3 className="font-semibold text-slate-900 mb-4">Status</h3>
                        <div className="space-y-2">
                            {statuses.map(s => (
                                <button
                                    key={s}
                                    onClick={() => handleStatusChange(s)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${issue.status === s
                                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                                        }`}
                                >
                                    <span className="capitalize">{s.replace('_', ' ')}</span>
                                    {issue.status === s && <CheckCircle2 className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-semibold text-slate-900 mb-4">Labels</h3>
                        <div className="flex flex-wrap gap-2">
                            {issue.labels && issue.labels.length > 0 ? issue.labels.map(l => (
                                <Badge key={l.id} color="purple">{l.name}</Badge>
                            )) : (
                                <p className="text-sm text-slate-400">No labels</p>
                            )}
                            <button className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors border border-dashed border-slate-300">
                                + Add Label
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default IssueDetail;
