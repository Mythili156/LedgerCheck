import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, RefreshCw, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';

const Upload = ({ onAnalysisComplete }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'manual'
    const { t } = useLanguage();

    // Manual Entry States
    const [manualData, setManualData] = useState({ revenue: '', expenses: '', profit: '' });

    const onDrop = useCallback((acceptedFiles) => {
        setFile(acceptedFiles[0]);
        setError(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxFiles: 1
    });

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (onAnalysisComplete) onAnalysisComplete(response.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                setError("Session expired. Please login again.");
            } else {
                setError("Failed to upload file. Check backend.");
            }
        } finally {
            setUploading(false);
        }
    };

    const handleManualSubmit = async () => {
        if (!manualData.revenue || !manualData.expenses || !manualData.profit) {
            setError("Please fill all fields.");
            return;
        }
        setUploading(true);
        setError(null);

        try {
            const response = await api.post('/upload/manual', {
                revenue: parseFloat(manualData.revenue),
                expenses: parseFloat(manualData.expenses),
                profit: parseFloat(manualData.profit)
            });
            if (onAnalysisComplete) onAnalysisComplete(response.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                setError("Session expired. Please login again.");
            } else {
                setError("Failed to analyze data.");
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="flex justify-center mb-8 gap-4">
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'upload' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                >
                    {t('uploadTab')}
                </button>
                <button
                    onClick={() => setActiveTab('manual')}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'manual' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                >
                    {t('manualTab')}
                </button>
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="border-slate-200 shadow-xl bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            {activeTab === 'upload' ? t('uploadTitle') : t('manualTitle')}
                        </CardTitle>
                        <p className="text-center text-slate-500">
                            {activeTab === 'upload' ? t('uploadSubtitle') : t('manualSubtitle')}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {activeTab === 'upload' ? (
                            // Upload UI
                            <div
                                {...getRootProps()}
                                className={`
                    border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200
                    ${isDragActive ? 'border-sky-500 bg-sky-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}
                `}
                            >
                                <input {...getInputProps()} />
                                <div className="bg-blue-100 p-4 rounded-full mb-4">
                                    <UploadIcon className="w-8 h-8 text-blue-600" />
                                </div>
                                {file ? (
                                    <div className="text-center">
                                        <p className="text-lg font-medium text-slate-800">{file.name}</p>
                                        <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-lg font-medium text-slate-700">{t('dragDrop')}</p>
                                        <p className="text-sm text-slate-400 mt-2">{t('supports')}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Manual Form UI
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('revenueLabel')}</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder={t('enterAmount')}
                                        value={manualData.revenue}
                                        onChange={(e) => setManualData({ ...manualData, revenue: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('expensesLabel')}</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder={t('enterAmount')}
                                        value={manualData.expenses}
                                        onChange={(e) => setManualData({ ...manualData, expenses: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('profitLabel')}</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder={t('enterAmount')}
                                        value={manualData.profit}
                                        onChange={(e) => setManualData({ ...manualData, profit: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={activeTab === 'upload' ? handleUpload : handleManualSubmit}
                            disabled={activeTab === 'upload' ? (!file || uploading) : uploading}
                            className={`
                w-full py-3 px-4 rounded-lg font-semibold text-white shadow-lg flex items-center justify-center gap-2
                ${(activeTab === 'upload' && !file) || uploading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-indigo-500/30'}
              `}
                        >
                            {uploading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    {t('processing')}
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    {t('analyzeBtn')}
                                </>
                            )}
                        </motion.button>

                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Upload;
