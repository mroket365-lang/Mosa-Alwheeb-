import React from 'react';
import { Account, Language } from '../types';
import { translations } from '../translations';
import { CreditCard, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

interface BalanceCardProps {
  accounts: Account[];
  totalBalance: number;
  language: Language;
  darkMode: boolean;
  onQuickTransfer: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  accounts,
  totalBalance,
  language,
  darkMode,
  onQuickTransfer
}) => {
  const t = translations[language];
  const [showBalance, setShowBalance] = React.useState(true);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-7 text-white shadow-2xl shadow-blue-950/40 border border-blue-500/20">
      {/* Decorative Glow Elements */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header Info */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-300/80">
              {t.totalBalance}
            </span>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-blue-300/60 hover:text-white transition-colors"
            >
              {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              آمن 100%
            </span>
          </div>

          <div className="mt-1 flex items-baseline gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
              {showBalance ? formatCurrency(totalBalance) : '••••••••'}
            </h1>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-lg border border-emerald-400/20">
              +14.2% هذا الشهر
            </span>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onQuickTransfer}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{t.quickTransfer}</span>
          </button>
        </div>
      </div>

      {/* Account Breakdown Chips */}
      <div className="relative z-10 pt-5">
        <p className="text-xs font-medium text-blue-200/70 mb-3 flex items-center justify-between">
          <span>{t.accounts} (4)</span>
          <span className="text-[11px] text-blue-300/50">تحديث فوري</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {accounts.map((acct) => (
            <div
              key={acct.id}
              className="group p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{acct.icon}</span>
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
                  {acct.accountNumber}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-300 truncate">
                {t[acct.nameKey as keyof typeof t] || acct.defaultName}
              </p>
              <p className="text-sm font-bold font-mono text-white mt-0.5">
                {showBalance ? formatCurrency(acct.balance) : '••••'}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
