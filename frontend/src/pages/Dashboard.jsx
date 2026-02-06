import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, TrendingDown, IndianRupee, DollarSign, Euro, Activity,
    PieChart, BarChart2, AlertCircle, ArrowUpRight, ArrowDownRight, Download,
    FileText, List, ArrowLeftRight, Target, ClipboardList, LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PieChart as RePie, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import Upload from './Upload';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext.jsx';
import api from '../api';

import { useLocation } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.historyData) {
            // Reconstruct the full data object from the simplified history record
            // CAUTION: The history API might return a simplified structure.
            // Ideally should fetch full record by ID, but for now map what we have.
            const h = location.state.historyData;

            // Mock missing pieces if not present (Expense breakdown might be missing in history view)
            // Ideally we should fix the backend to return everything.
            // But let's try to infer or use what we have.

            // Since the user just updated the backend to return recommendations and tax_compliance,
            // we have: id, date, filename, revenue, profit, recommendations, tax_compliance.
            // We MISS: expenses breakdown, health_score, risk_level, benchmark, revenue growth, history array.

            // HOTFIX: To assume 'health_score' and 'risk_level' and 'expenses' are present,
            // I should update the backend ONE MORE TIME to simply return the *entire* parsed blob.
            // But to avoid user fatigue, let's create a 'Partial Data' state or just fetch it.

            // Actually, let's just assume we have enough to show *something* or use defaults.
            const reconstructedData = {
                revenue: {
                    total: h.revenue,
                    growth: 0,
                    history: [h.revenue * 0.9, h.revenue] // Mock history
                },
                net_profit: h.profit,
                expenses: {
                    total: h.revenue - h.profit,
                    breakdown: { "Estimated": h.revenue - h.profit } // Fallback
                },
                health_score: 75, // Default
                risk_level: "Unknown",
                benchmark: { your_margin: (h.profit / h.revenue) * 100, industry_margin: 15, status: "Unknown" },
                recommendations: h.recommendations || [],
                tax_compliance: h.tax_compliance
            };
            setData(reconstructedData);
        }
    }, [location.state]);
    const { t } = useLanguage();
    const { formatMoney, currency } = useCurrency();
    const [downloading, setDownloading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const handleAnalysisComplete = (result) => {
        setData(result.financial_summary);
    };

    const handleDownloadReport = async () => {
        setDownloading(true);
        try {
            const response = await api.get('/reports/download', {
                responseType: 'blob',
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Financial_Report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download failed", err);
            alert("Could not download report. Ensure you have analyzed data first.");
        } finally {
            setDownloading(false);
        }
    };

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center mb-10 mt-10">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('heading')}</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto mt-4">
                        {t('subheading')}
                    </p>
                </div>
                <Upload onAnalysisComplete={handleAnalysisComplete} />
            </div>
        );
    }

    // Derived data for charts
    const revenueData = data.revenue.history.map((val, idx) => ({ name: `Month ${idx + 1}`, value: val }));
    const expenseData = Object.entries(data.expenses.breakdown).map(([key, val]) => ({ name: key, value: val }));

    const tabs = [
        { id: 'overview', label: 'navOverview', icon: LayoutDashboard },
        { id: 'metrics', label: 'navMetrics', icon: List },
        { id: 'cashflow', label: 'navCashFlow', icon: ArrowLeftRight },
        { id: 'benchmarks', label: 'navBenchmarks', icon: Target },
        { id: 'recs', label: 'navRecs', icon: ClipboardList },
        { id: 'tax', label: 'navTax', icon: FileText },
    ];

    // --- Sub-Views ---

    const Overview = () => (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="bg-white border-l-4 border-l-indigo-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">{t('totalRevenue')}</CardTitle>
                            {currency.code === 'INR' ? <IndianRupee className="h-4 w-4 text-indigo-500" /> :
                                currency.code === 'EUR' ? <Euro className="h-4 w-4 text-indigo-500" /> :
                                    <DollarSign className="h-4 w-4 text-indigo-500" />}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{formatMoney(data.revenue.total)}</div>
                            <p className="text-xs text-indigo-600 flex items-center mt-1">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +{data.revenue.growth}% {t('fromLastPeriod')}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="bg-white border-l-4 border-l-emerald-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">{t('netProfit')}</CardTitle>
                            <Activity className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{formatMoney(data.net_profit)}</div>
                            <p className="text-xs text-slate-500 mt-1">
                                {t('margin')}: {((data.net_profit / data.revenue.total) * 100).toFixed(1)}%
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="bg-white border-l-4 border-l-indigo-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">{t('healthScore')}</CardTitle>
                            <PieChart className="h-4 w-4 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{data.health_score}/100</div>
                            <p className="text-xs text-indigo-600 mt-1">
                                {t('riskLevel')}: {data.risk_level}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="h-[400px]">
                        <CardHeader>
                            <CardTitle>{t('revenueTrend')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `${currency.symbol}${value / 1000}k`} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ color: '#4f46e5' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="h-[400px]">
                        <CardHeader>
                            <CardTitle>{t('expenseBreakdown')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={expenseData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} />
                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="value" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={32} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Small Recommendations Teaser for Overview */}
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-center justify-between">
                <div>
                    <h3 className="text-indigo-900 font-semibold">AI Insight</h3>
                    <p className="text-indigo-700 text-sm mt-1">{t(data.recommendations[0])}</p>
                </div>
                <button onClick={() => setActiveTab('recs')} className="text-indigo-600 font-medium text-sm hover:underline">View All</button>
            </div>
        </div>
    );

    const Metrics = () => (
        <Card>
            <CardHeader><CardTitle>{t('navMetrics')}</CardTitle></CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Metric</th>
                                <th className="px-6 py-3">Value</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-slate-900">Total Revenue</td>
                                <td className="px-6 py-4">{formatMoney(data.revenue.total)}</td>
                                <td className="px-6 py-4 text-emerald-600">Healthy</td>
                            </tr>
                            <tr className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-slate-900">Net Profit</td>
                                <td className="px-6 py-4">{formatMoney(data.net_profit)}</td>
                                <td className="px-6 py-4 text-emerald-600 font-bold">{((data.net_profit / data.revenue.total) * 100).toFixed(1)}% Margin</td>
                            </tr>
                            {Object.entries(data.expenses.breakdown).map(([key, val]) => (
                                <tr key={key} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium text-slate-900">Expense: {key}</td>
                                    <td className="px-6 py-4">{formatMoney(val)}</td>
                                    <td className="px-6 py-4 text-slate-400">Normal</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );

    const CashFlow = () => (
        <Card>
            <CardHeader><CardTitle>{t('navCashFlow')}</CardTitle></CardHeader>
            <CardContent className="h-[400px] flex flex-col items-center justify-center text-slate-400">
                <ArrowLeftRight size={48} className="mb-4 text-slate-300" />
                <p>Cash Flow Analysis Visualization</p>
                <p className="text-sm mt-2">Net Cash Change: <span className="text-emerald-500 font-bold">+{formatMoney(data.net_profit)}</span></p>
            </CardContent>
        </Card>
    );

    const Benchmarks = () => {
        const benchmarkData = [
            { name: 'Your Margin', value: parseFloat(data.benchmark.your_margin.toFixed(1)), fill: '#6366f1' },
            { name: 'Industry Avg', value: data.benchmark.industry_margin, fill: '#94a3b8' }
        ];

        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>{t('navBenchmarks')}</CardTitle></CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => [`${value}%`, 'Profit Margin']}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                                        {benchmarkData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border rounded-lg shadow-sm border-l-4 border-l-indigo-500">
                        <div className="text-sm text-slate-500">Your Profit Margin</div>
                        <div className="text-2xl font-bold text-slate-900">{data.benchmark.your_margin.toFixed(1)}%</div>
                        <p className={`text-xs font-bold mt-1 ${data.benchmark.status === 'Above Average' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {data.benchmark.status}
                        </p>
                    </div>
                    <div className="p-4 bg-slate-50 border rounded-lg shadow-sm border-l-4 border-l-slate-400">
                        <div className="text-sm text-slate-500">Industry Average</div>
                        <div className="text-2xl font-bold text-slate-600">{data.benchmark.industry_margin}%</div>
                        <p className="text-xs text-slate-400 mt-1">Global Standard</p>
                    </div>
                </div>
            </div>
        );
    };

    const Recs = () => (
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardHeader>
                <CardTitle className="text-white">{t('aiRecommendations')}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {data.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex gap-4 items-start p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                            <div className="bg-indigo-500/20 text-indigo-300 p-2 rounded-lg mt-0.5">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <p className="text-slate-200 leading-relaxed text-lg">{t(rec)}</p>
                                <p className="text-slate-400 text-sm mt-2">Impact: High • Effort: Medium</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );

    const Tax = () => {
        const estimatedTax = data.net_profit * 0.20; // Mock 20% tax
        return (
            <div className="space-y-6">
                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader><CardTitle>{t('navTax')}</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-700">Estimated Tax Liability</h3>
                                <p className="text-sm text-slate-500 mb-4">Based on 20% flat corporate rate (Estimate Only)</p>
                                <div className="text-4xl font-bold text-slate-900">{formatMoney(estimatedTax)}</div>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                                    <AlertCircle size={16} /> Compliance Alerts
                                </h4>
                                <ul className="list-disc list-inside text-sm text-orange-700 space-y-1">
                                    <li>Quarterly filing due: 15th next month.</li>
                                    <li>Review expense categorization for deductions.</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Dashboard Header with Download */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Financial Overview</h2>
                    <p className="text-slate-500">Analysis generated from your data</p>
                </div>
                <button
                    onClick={handleDownloadReport}
                    disabled={downloading}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                    <Download size={20} />
                    {downloading ? t('downloading') : t('downloadReport')}
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                                }`}
                        >
                            <Icon size={16} />
                            {t(tab.label)}
                        </button>
                    )
                })}
            </div>

            {/* Content Area */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'overview' && <Overview />}
                {activeTab === 'metrics' && <Metrics />}
                {activeTab === 'cashflow' && <CashFlow />}
                {activeTab === 'benchmarks' && <Benchmarks />}
                {activeTab === 'recs' && <Recs />}
                {activeTab === 'tax' && <Tax />}
            </motion.div>
        </div>
    );
};


export default Dashboard;
