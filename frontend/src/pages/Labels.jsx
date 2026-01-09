import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Labels = () => {
    const [labels, setLabels] = useState([]);
    const [newLabel, setNewLabel] = useState('');
    const [loading, setLoading] = useState(true);

    // Mock colors for now as backend doesn't store them
    const colors = ['red', 'purple', 'cyan', 'amber', 'rose', 'green', 'blue', 'indigo'];

    useEffect(() => {
        fetchLabels();
    }, []);

    const fetchLabels = async () => {
        try {
            const res = await api.get('/labels/');
            setLabels(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newLabel.trim()) return;
        try {
            await api.post('/labels/', { name: newLabel });
            setNewLabel('');
            fetchLabels();
        } catch (e) {
            alert('Failed to create label: ' + e.message);
        }
    };

    const getBadgeStyle = (index) => {
        const color = colors[index % colors.length];
        const map = {
            red: 'bg-red-50 text-red-700 border-red-100',
            purple: 'bg-purple-50 text-purple-700 border-purple-100',
            cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100',
            amber: 'bg-amber-50 text-amber-700 border-amber-100',
            rose: 'bg-rose-50 text-rose-700 border-rose-100',
            green: 'bg-green-50 text-green-700 border-green-100',
            blue: 'bg-blue-50 text-blue-700 border-blue-100',
            indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100'
        };
        return map[color];
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#0F172A]">Labels</h2>
                    <p className="text-slate-500">Manage issue labels and categories</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-8">
                    <input
                        type="text"
                        placeholder="New label name..."
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    />
                    <button
                        onClick={handleCreate}
                        className="bg-[#0F172A] text-white px-4 py-2 rounded-lg hover:bg-slate-800 font-medium flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Create Label
                    </button>
                </div>

                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center -rotate-45">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        </span>
                        All Labels ({labels.length})
                    </h3>

                    <div className="divide-y divide-slate-100">
                        {labels.map((label, idx) => (
                            <div key={label.id} className="py-4 flex items-center justify-between group hover:bg-slate-50 -mx-6 px-6 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className={`w-3 h-3 rounded-full bg-${colors[idx % colors.length]}-400`}></span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getBadgeStyle(idx)}`}>
                                        {label.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {labels.length === 0 && !loading && (
                            <p className="text-slate-500 py-4 italic">No labels created yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Labels;
