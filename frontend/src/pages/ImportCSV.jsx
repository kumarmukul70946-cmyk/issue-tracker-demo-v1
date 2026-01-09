import React, { useState } from 'react';
import api from '../api/client';
import { Upload, FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';

const ImportCSV = () => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await api.post('/issues/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
            setFile(null); // Reset file on success to allow new upload
        } catch (e) {
            alert('Import failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-[#0F172A]">Import CSV</h2>
                <p className="text-slate-500">Bulk import issues from a CSV file</p>
            </div>

            {/* Template Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="font-semibold text-[#0F172A] mb-1">CSV Template</h3>
                    <p className="text-sm text-slate-500">Download a template with the correct column format</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                    <Download className="w-4 h-4" /> Download Template
                </button>
            </div>

            {/* Upload Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-8">
                <h3 className="font-semibold text-[#0F172A] mb-6">Upload CSV File</h3>

                <div
                    className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {!file ? (
                        <>
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 text-slate-400">
                                <Upload className="w-6 h-6" />
                            </div>
                            <p className="text-lg font-semibold text-[#0F172A] mb-1">Drag and drop your CSV file here</p>
                            <p className="text-slate-500 text-sm mb-6">or click to browse</p>
                            <label className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg font-medium cursor-pointer transition-colors shadow-sm">
                                Select File
                                <input type="file" className="hidden" accept=".csv" onChange={handleChange} />
                            </label>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-600 mx-auto">
                                <FileText className="w-6 h-6" />
                            </div>
                            <p className="font-medium text-[#0F172A] mb-1">{file.name}</p>
                            <p className="text-sm text-slate-500 mb-6">{(file.size / 1024).toFixed(2)} KB</p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={() => setFile(null)} className="px-4 py-2 text-slate-500 hover:text-slate-700">Cancel</button>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                                >
                                    {uploading ? 'Importing...' : 'Start Import'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Result Card */}
            {result && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 animate-in slide-in-from-bottom-2">
                    <h3 className="font-semibold text-[#0F172A] mb-4">Import Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-center gap-3">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold text-green-700">{result.created}</p>
                                <p className="text-sm text-green-600">Issues Created</p>
                            </div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg border border-red-100 flex items-center gap-3">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                            <div>
                                <p className="text-2xl font-bold text-red-700">{result.failed}</p>
                                <p className="text-sm text-red-600">Failed Rows</p>
                            </div>
                        </div>
                    </div>
                    {result.errors && result.errors.length > 0 && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 max-h-40 overflow-auto">
                            <p className="font-semibold mb-2">Errors:</p>
                            <ul className="list-disc pl-4 space-y-1">
                                {result.errors.map((e, i) => (
                                    <li key={i}>Row {i + 1}: {e.error || JSON.stringify(e)}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Format Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-semibold text-[#0F172A]">Expected CSV Format</h3>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="text-slate-500 font-medium border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3">Column</th>
                            <th className="px-6 py-3">Required</th>
                            <th className="px-6 py-3">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="px-6 py-3 font-mono text-slate-600">title</td>
                            <td className="px-6 py-3"><CheckCircle className="w-4 h-4 text-green-500" /></td>
                            <td className="px-6 py-3 text-slate-600">Issue title (max 200 chars)</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-3 font-mono text-slate-600">description</td>
                            <td className="px-6 py-3 text-slate-400">-</td>
                            <td className="px-6 py-3 text-slate-600">Detailed description</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-3 font-mono text-slate-600">status</td>
                            <td className="px-6 py-3 text-slate-400">-</td>
                            <td className="px-6 py-3 text-slate-600">open, in_progress, closed</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-3 font-mono text-slate-600">assignee_id</td>
                            <td className="px-6 py-3 text-slate-400">-</td>
                            <td className="px-6 py-3 text-slate-600">User ID of assignee</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ImportCSV;
