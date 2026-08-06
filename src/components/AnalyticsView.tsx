import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  FileSpreadsheet, 
  FileText, 
  CloudUpload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  ShieldCheck,
  History,
  Download
} from 'lucide-react';
import { 
  sampleTransactions, 
  downloadCSV, 
  downloadPDF, 
  generateCSVBlob, 
  generatePDFBlob, 
  uploadBlobToGoogleDrive,
  initDriveAuth,
  signInWithGoogleDrive
} from '../lib/driveExportService';
import { User } from 'firebase/auth';

interface AnalyticsViewProps {
  language: Language;
  darkMode: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ language, darkMode }) => {
  const t = translations[language];
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');

  // Google Drive & Backup States
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isBackingUpDrive, setIsBackingUpDrive] = useState(false);
  const [backupNotice, setBackupNotice] = useState<{ type: 'success' | 'error'; message: string; link?: string } | null>(null);

  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setBackupNotice(null);
    try {
      const res = await signInWithGoogleDrive();
      if (res) {
        setGoogleUser(res.user);
        setAccessToken(res.accessToken);
        setBackupNotice({
          type: 'success',
          message: t.googleDriveConnected + ' (' + res.user.email + ')'
        });
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setBackupNotice({
        type: 'error',
        message: 'فشل تسجيل الدخول إلى Google Drive. يرجى إعادة المحاولة.'
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExportingCSV(true);
    setBackupNotice(null);
    try {
      // Local Download
      downloadCSV(sampleTransactions);

      // Google Drive Backup if connected or autoBackup is enabled
      if (accessToken) {
        setIsBackingUpDrive(true);
        const blob = generateCSVBlob(sampleTransactions);
        const filename = `Phoenix_Transactions_${new Date().toISOString().slice(0, 10)}.csv`;
        const driveRes = await uploadBlobToGoogleDrive({
          accessToken,
          blob,
          filename,
          mimeType: 'text/csv'
        });

        setBackupNotice({
          type: 'success',
          message: t.backupSuccess + ' (' + filename + ')',
          link: driveRes.webViewLink
        });
      }
    } catch (err: any) {
      console.error('CSV export / backup error:', err);
      setBackupNotice({
        type: 'error',
        message: t.backupFailed
      });
    } finally {
      setIsExportingCSV(false);
      setIsBackingUpDrive(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    setBackupNotice(null);
    try {
      // Local Download
      downloadPDF(sampleTransactions);

      // Google Drive Backup if connected or autoBackup is enabled
      if (accessToken) {
        setIsBackingUpDrive(true);
        const blob = generatePDFBlob(sampleTransactions);
        const filename = `Phoenix_Financial_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
        const driveRes = await uploadBlobToGoogleDrive({
          accessToken,
          blob,
          filename,
          mimeType: 'application/pdf'
        });

        setBackupNotice({
          type: 'success',
          message: t.backupSuccess + ' (' + filename + ')',
          link: driveRes.webViewLink
        });
      }
    } catch (err: any) {
      console.error('PDF export / backup error:', err);
      setBackupNotice({
        type: 'error',
        message: t.backupFailed
      });
    } finally {
      setIsExportingPDF(false);
      setIsBackingUpDrive(false);
    }
  };

  const handleManualDriveBackup = async () => {
    if (!accessToken) {
      await handleGoogleSignIn();
      return;
    }

    setIsBackingUpDrive(true);
    setBackupNotice(null);

    try {
      const csvBlob = generateCSVBlob(sampleTransactions);
      const pdfBlob = generatePDFBlob(sampleTransactions);
      const dateStr = new Date().toISOString().slice(0, 10);

      const driveResCSV = await uploadBlobToGoogleDrive({
        accessToken,
        blob: csvBlob,
        filename: `Phoenix_Financial_Report_${dateStr}.csv`,
        mimeType: 'text/csv'
      });

      await uploadBlobToGoogleDrive({
        accessToken,
        blob: pdfBlob,
        filename: `Phoenix_Financial_Report_${dateStr}.pdf`,
        mimeType: 'application/pdf'
      });

      setBackupNotice({
        type: 'success',
        message: 'تم رفع نسختي (CSV & PDF) بنجاح على Google Drive!',
        link: driveResCSV.webViewLink
      });
    } catch (err: any) {
      console.error('Manual drive backup error:', err);
      setBackupNotice({
        type: 'error',
        message: t.backupFailed
      });
    } finally {
      setIsBackingUpDrive(false);
    }
  };

  // Chart Monthly Data
  const monthlyData = [
    { name: 'يناير', income: 32000, expense: 14000, net: 18000 },
    { name: 'فبراير', income: 38000, expense: 16500, net: 21500 },
    { name: 'مارس', income: 35000, expense: 15000, net: 20000 },
    { name: 'أبريل', income: 41000, expense: 19000, net: 22000 },
    { name: 'مايو', income: 45000, expense: 21000, net: 24000 },
    { name: 'يونيو', income: 39000, expense: 17500, net: 21500 },
    { name: 'يوليو', income: 42000, expense: 18000, net: 24000 },
    { name: 'أغسطس', income: 42500, expense: 18200, net: 24300 },
  ];

  // Category Breakdown Data
  const categoryData = [
    { name: t.marketing, value: 5500, color: '#2563EB', icon: '📢' },
    { name: t.travel, value: 3200, color: '#0EA5E9', icon: '✈️' },
    { name: t.shopping, value: 1240, color: '#F59E0B', icon: '🛍️' },
    { name: t.bills, value: 890, color: '#EF4444', icon: '📄' },
    { name: t.shipping, value: 420, color: '#7C3AED', icon: '📦' },
    { name: t.food, value: 380, color: '#10B981', icon: '🍽️' },
  ];

  const totalExpenseSum = categoryData.reduce((acc, curr) => acc + curr.value, 0);

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Export & Google Drive Backup Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden ${
        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-gradient-to-r from-blue-50 to-indigo-50/50 border-blue-100'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CloudUpload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className={`font-extrabold text-lg ${darkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                {t.exportHistory}
              </h3>
              <span className="text-xs bg-blue-600/10 text-blue-600 dark:text-blue-400 font-semibold px-2.5 py-0.5 rounded-full border border-blue-500/20">
                Google Drive Backup
              </span>
            </div>
            <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
              تصدير كشوفات المعاملات المالية إلى ملفات CSV و PDF وحفظ نسخة احتياطية سحابية تلقائياً.
            </p>

            {/* Google Drive Status Bar */}
            <div className="mt-3 flex items-center gap-3">
              {accessToken ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.googleDriveConnected} ({googleUser?.email || 'مفعل'})</span>
                </div>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-bold shadow-sm border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 transition-all"
                >
                  {isSigningIn ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                  )}
                  <span>{t.signInWithGoogle}</span>
                </button>
              )}

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-zinc-400">
                <input 
                  type="checkbox" 
                  checked={autoBackup} 
                  onChange={(e) => setAutoBackup(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500" 
                />
                <span>{t.autoBackupDrive}</span>
              </label>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={isExportingCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {isExportingCSV ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
              <span>{t.exportCSV}</span>
            </button>

            {/* Export PDF Button */}
            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              <span>{t.exportPDF}</span>
            </button>

            {/* Backup Directly to Google Drive Button */}
            <button
              onClick={handleManualDriveBackup}
              disabled={isBackingUpDrive}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {isBackingUpDrive ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
              <span>{t.backupToDrive}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert Notice */}
        {backupNotice && (
          <div className={`mt-4 p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
            backupNotice.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' 
              : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {backupNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{backupNotice.message}</span>
            </div>
            {backupNotice.link && (
              <a 
                href={backupNotice.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold underline hover:opacity-80"
              >
                <span>فتح الملف في Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Header & Range Filters */}
      <div className={`p-6 rounded-3xl border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className={`font-bold text-lg ${darkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
              {t.monthlyOverview}
            </h3>
          </div>
          <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            متابعة دقيقة للأداء المالي وتوزيع الميزانية
          </p>
        </div>

        {/* Time Selector */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-zinc-800">
          {[
            { id: 'week', label: t.week },
            { id: 'month', label: t.month },
            { id: 'year', label: t.year },
            { id: 'all', label: t.allTime },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setTimeRange(btn.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === btn.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Income vs Expense Composed Chart */}
      <div className={`p-6 rounded-3xl border shadow-xl ${
        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>{t.income}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>{t.expenses}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>{t.netFlow}</span>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
            + $24,300 صافي أرباح
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={darkMode ? 0.1 : 0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: darkMode ? '#a1a1aa' : '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: darkMode ? '#a1a1aa' : '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#18181b' : '#ffffff',
                  borderColor: darkMode ? '#27272a' : '#e2e8f0',
                  borderRadius: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="net" fill="#2563EB15" stroke="#2563EB" strokeWidth={2} />
              <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} barSize={16} />
              <Bar dataKey="expense" fill="#F59E0B" radius={[6, 6, 0, 0]} barSize={16} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Expense Breakdown & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie Chart Card */}
        <div className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-indigo-500" />
            <h4 className="font-bold text-base">{t.categoryBreakdown}</h4>
          </div>

          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xs text-slate-400 font-medium">إجمالي المصروفات</span>
              <span className="text-lg font-extrabold font-mono text-amber-500">
                {formatCurrency(totalExpenseSum)}
              </span>
            </div>
          </div>
        </div>

        {/* Category List */}
        <div className={`p-6 rounded-3xl border shadow-xl ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
        }`}>
          <h4 className="font-bold text-base mb-4">تفاصيل الفئات وتوزيع الميزانية</h4>

          <div className="space-y-3">
            {categoryData.map((item, idx) => {
              const pct = ((item.value / totalExpenseSum) * 100).toFixed(1);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold flex items-center gap-1.5">
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </span>
                    <span className="font-mono font-bold">{formatCurrency(item.value)} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Transaction Records Table Preview for Export */}
      <div className={`p-6 rounded-3xl border shadow-xl ${
        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            <h4 className="font-bold text-base">سجل المعاملات المالي القابل للتصدير</h4>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
            {sampleTransactions.length} معاملات مسجلة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-slate-200 text-slate-500'}`}>
                <th className="py-3 px-3">رقم العملية</th>
                <th className="py-3 px-3">التاريخ</th>
                <th className="py-3 px-3">الوصف</th>
                <th className="py-3 px-3">الفئة</th>
                <th className="py-3 px-3">الحساب</th>
                <th className="py-3 px-3">الحالة</th>
                <th className="py-3 px-3 text-left">المبلغ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
              {sampleTransactions.map((tx) => {
                const isIncome = tx.amount > 0;
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400">{tx.id}</td>
                    <td className="py-3 px-3">{tx.date}</td>
                    <td className="py-3 px-3 font-semibold">{tx.title}</td>
                    <td className="py-3 px-3">{tx.category}</td>
                    <td className="py-3 px-3">{tx.account}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        {tx.status}
                      </span>
                    </td>
                    <td className={`py-3 px-3 font-mono font-bold text-left ${
                      isIncome ? 'text-emerald-500' : 'text-slate-700 dark:text-zinc-200'
                    }`}>
                      {isIncome ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

