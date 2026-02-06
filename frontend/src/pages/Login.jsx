import React, { useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { TrendingUp, User, Mail, Lock, Globe, ChevronDown, Hexagon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';

const Login = ({ onLogin }) => {
    const { t, language, setLanguage } = useLanguage();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login Flow
                const response = await api.post('/auth/login', {
                    email: email,
                    password: password
                });

                // Response: { access_token, token_type, username }
                onLogin(response.data);

            } else {
                // Register Flow
                await api.post('/auth/register', {
                    email: email,
                    password: password,
                    full_name: name
                });

                // Auto login after register
                const loginResponse = await api.post('/auth/login', {
                    email: email,
                    password: password
                });
                onLogin(loginResponse.data);
            }
        } catch (err) {
            console.error(err);
            let errorMessage = "An error occurred";

            if (err.response && err.response.data) {
                const detail = err.response.data.detail;
                if (typeof detail === 'string') {
                    errorMessage = detail;
                } else if (Array.isArray(detail)) {
                    // Handle Pydantic validation errors (array of objects)
                    errorMessage = detail.map(e => e.msg).join(', ');
                } else if (typeof detail === 'object') {
                    errorMessage = JSON.stringify(detail);
                }
            } else {
                errorMessage = "Authentication failed. Connect to backend?";
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const toggleLangMenu = () => setIsLangMenuOpen(!isLangMenuOpen);
    const changeLanguage = (lang) => {
        setLanguage(lang);
        setIsLangMenuOpen(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl opacity-50" />
            </div>

            {/* Language Switcher (Floating) */}
            <div className="absolute top-6 right-6 z-50">
                <div className="relative">
                    <button
                        onClick={toggleLangMenu}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                        <Globe size={18} />
                        <span className="uppercase">{language}</span>
                        <ChevronDown size={14} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isLangMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                            <button onClick={() => changeLanguage('en')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">English</button>
                            <button onClick={() => changeLanguage('ta')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">Tamil</button>
                            <button onClick={() => changeLanguage('hi')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">Hindi</button>
                        </div>
                    )}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md px-4"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20 transform rotate-45">
                        <div className="transform -rotate-45">
                            <Hexagon className="w-8 h-8 text-white fill-current" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">{t('appTitle')}</h1>
                    <p className="text-slate-500 text-sm mt-1">Intelligent Financial Wisdom</p>
                </div>

                <Card className="border-slate-200 shadow-2xl bg-white/80 backdrop-blur-md">
                    <CardContent className="p-8">
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-slate-800">
                                {isLogin ? t('loginTitle') : t('registerTitle')}
                            </h2>
                            <p className="text-sm text-slate-500 mt-2">
                                {t('authSubtitle')}
                            </p>
                            {error && (
                                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                    {error}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('name')}</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 outline-none transition-all"
                                            placeholder="John Doe"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('email')}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 outline-none transition-all"
                                        placeholder="user@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('password')}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 outline-none transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform active:scale-[0.98]"
                            >
                                {isLogin ? t('loginBtn') : t('registerBtn')}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                {isLogin ? t('switchToRegister') : t('switchToLogin')}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
