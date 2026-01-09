import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, PieChart, Upload, Tag, Settings, Bell, Search, Plus } from 'lucide-react';
import { cn } from './ui';
import NewIssueModal from './NewIssueModal';

const Layout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: ListTodo, label: 'Issues', path: '/issues' },
        { icon: Upload, label: 'Import CSV', path: '/import' },
        { icon: PieChart, label: 'Reports', path: '/reports' },
        { icon: Tag, label: 'Labels', path: '/labels' },
    ];

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path.startsWith('/issues')) return 'Issues';
        if (path === '/import') return 'Import CSV';
        if (path === '/reports') return 'Reports';
        if (path === '/labels') return 'Labels';
        return 'Issue Tracker';
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            <NewIssueModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={() => {
                    navigate('/issues');
                }}
            />

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 fixed h-full z-10 hidden md:flex flex-col justify-between">
                <div>
                    <div className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#0F172A] rounded-lg flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full border-2 border-white"></div>
                            </div>
                            <span className="text-lg font-bold text-[#0F172A]">
                                Issue Tracker
                            </span>
                        </div>
                    </div>

                    <nav className="px-4 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                                        isActive
                                            ? 'bg-[#F1F5F9] text-[#0F172A] font-medium'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    )
                                }
                            >
                                <item.icon className={cn("w-5 h-5 transition-colors", ({ isActive }) => isActive ? "text-[#0F172A]" : "text-slate-400 group-hover:text-slate-600")} />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-100">
                    <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 w-full transition-colors rounded-lg hover:bg-slate-50">
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-w-0 flex flex-col">
                {/* Header */}
                <header className="bg-white sticky top-0 z-20 border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-[#0F172A]">{getPageTitle()}</h1>
                        {location.pathname === '/' && <p className="text-slate-500 text-sm hidden lg:block">Overview of your project</p>}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search issues..."
                                className="pl-9 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#0F172A] text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2 text-sm font-medium shadow-lg shadow-slate-200"
                        >
                            <Plus className="w-4 h-4" /> New Issue
                        </button>
                        <div className="h-6 w-px bg-slate-200 mx-2"></div>
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <button className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200 overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
