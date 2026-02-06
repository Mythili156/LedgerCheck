import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency, currencies } from '../context/CurrencyContext.jsx';
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X, Bell, User, Globe, DollarSign, ChevronDown, Hexagon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children, user, onLogout }) => {
    const { language, changeLanguage, t } = useLanguage();
    const { currency, changeCurrency } = useCurrency();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const location = useLocation();

    const toggleLangMenu = () => setIsLangMenuOpen(!isLangMenuOpen);

    const NavItem = ({ to, icon: Icon, label, active }) => (
        <Link
            to={to}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${active
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
        >
            <Icon size={20} />
            {label}
        </Link>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 shadow-xl flex flex-col`}>
                <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Hexagon size={18} className="text-white fill-white/20" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-white">LedgerCheck</h1>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-6 px-4 space-y-2 flex-1">
                    <NavItem to="/" icon={LayoutDashboard} label={t('dashboard')} active={location.pathname === '/'} />
                    <NavItem to="/reports" icon={FileText} label={t('reports')} active={location.pathname === '/reports'} />
                    <div className="pt-4 mt-4 border-t border-slate-700">
                        <NavItem to="#" icon={Settings} label={t('settings')} active={location.pathname === '/settings'} />
                    </div>
                </nav>

                <div className="p-4 bg-slate-800 border-t border-slate-700">
                    {/* User Profile */}
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-700/50 border border-slate-700">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-xs font-bold text-slate-200 truncate">{user?.name || 'User'}</span>
                            <span className="text-[10px] text-slate-400 font-medium truncate">{user?.email || 'user@example.com'}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="p-1.5 rounded text-slate-400 hover:bg-slate-600 hover:text-white transition-colors"
                            title={t('logout')}
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header (Desktop & Mobile) */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center gap-3 lg:hidden">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center lg:hidden">
                            <Hexagon size={18} className="text-white fill-white/20" />
                        </div>
                        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-500 hover:text-indigo-600 lg:hidden">
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* Spacer for desktop alignment if needed, or just justify-end */}
                    <div className="hidden lg:block"></div>

                    <div className="flex items-center gap-3">
                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={toggleLangMenu}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm"
                            >
                                <Globe size={16} className="text-slate-300" />
                                <span className="uppercase">{language}</span>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isLangMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                                    <button onClick={() => changeLanguage('en')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">English</button>
                                    <button onClick={() => changeLanguage('ta')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">Tamil</button>
                                    <button onClick={() => changeLanguage('hi')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">Hindi</button>
                                </div>
                            )}
                        </div>

                        {/* Currency Selector */}
                        <div className="relative">
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm cursor-pointer group">
                                <DollarSign size={16} className="text-slate-300" />
                                <select
                                    value={currency.code}
                                    onChange={(e) => changeCurrency(e.target.value)}
                                    className="bg-transparent border-none p-0 w-12 text-sm text-white focus:ring-0 cursor-pointer outline-none font-medium appearance-none"
                                >
                                    {Object.values(currencies).map(c => (
                                        <option key={c.code} value={c.code} className="text-slate-900 bg-white">
                                            {c.code}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-200" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative">
                    {/* Dynamic background element */}
                    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-transparent -z-10" />
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
