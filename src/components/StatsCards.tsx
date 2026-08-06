import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardsProps {
  income: number;
  expenses: number;
  savings: number;
  language: Language;
  darkMode: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  income,
  expenses,
  savings,
  language,
  darkMode
}) => {
  const t = translations[language];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const stats = [
    {
      title: t.income,
      value: income,
      change: '+18.5%',
      isPositive: true,
      icon: TrendingUp,
      color: 'emerald',
      bgLight: 'bg-emerald-500/10',
      borderLight: 'border-emerald-500/20',
      textColor: 'text-emerald-500',
    },
    {
      title: t.expenses,
      value: expenses,
      change: '-4.2%',
      isPositive: true, // Lower expenses is positive
      icon: TrendingDown,
      color: 'amber',
      bgLight: 'bg-amber-500/10',
      borderLight: 'border-amber-500/20',
      textColor: 'text-amber-500',
    },
    {
      title: t.savings,
      value: savings,
      change: '+22.1%',
      isPositive: true,
      icon: PiggyBank,
      color: 'purple',
      bgLight: 'bg-purple-500/10',
      borderLight: 'border-purple-500/20',
      textColor: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-all hover:shadow-lg ${
              darkMode 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${item.bgLight} ${item.borderLight} border`}>
                <Icon className={`w-5 h-5 ${item.textColor}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                item.isPositive 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}>
                {item.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {item.change}
              </span>
            </div>

            <p className={`text-xs font-medium ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              {item.title}
            </p>

            <p className={`text-2xl font-extrabold font-mono mt-1 ${item.textColor}`}>
              {formatCurrency(item.value)}
            </p>
          </div>
        );
      })}
    </div>
  );
};
