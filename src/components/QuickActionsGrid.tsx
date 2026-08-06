import React from 'react';
import { Language, TabType } from '../types';
import { translations } from '../translations';
import { 
  ArrowLeftRight, 
  RotateCcw, 
  BarChart3, 
  Bot, 
  PlusCircle, 
  Code2 
} from 'lucide-react';

interface QuickActionsGridProps {
  language: Language;
  darkMode: boolean;
  onSelectTab: (tab: TabType) => void;
  onOpenAddModal: () => void;
  onOpenFlutterStudio: () => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  language,
  darkMode,
  onSelectTab,
  onOpenAddModal,
  onOpenFlutterStudio
}) => {
  const t = translations[language];

  const actions = [
    {
      id: 'transfer',
      title: t.quickTransfer,
      icon: ArrowLeftRight,
      color: 'from-blue-500 to-indigo-600',
      action: () => onSelectTab('transfers'),
    },
    {
      id: 'refund',
      title: t.refundRequest,
      icon: RotateCcw,
      color: 'from-amber-500 to-orange-600',
      action: () => onSelectTab('transfers'),
    },
    {
      id: 'analytics',
      title: t.analytics,
      icon: BarChart3,
      color: 'from-emerald-500 to-teal-600',
      action: () => onSelectTab('analytics'),
    },
    {
      id: 'ai',
      title: t.aiAssistant,
      icon: Bot,
      color: 'from-purple-500 to-pink-600',
      action: () => onSelectTab('ai'),
    },
    {
      id: 'flutter',
      title: t.flutterStudio,
      icon: Code2,
      color: 'from-cyan-500 to-blue-600',
      action: onOpenFlutterStudio,
      badge: 'Flutter',
    },
    {
      id: 'add',
      title: language === 'ar' ? 'معاملة جديدة' : 'New Transaction',
      icon: PlusCircle,
      color: 'from-blue-600 to-purple-600',
      action: onOpenAddModal,
    },
  ];

  return (
    <div className={`p-4 rounded-2xl border ${
      darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
    }`}>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.action}
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 group hover:scale-[1.04] active:scale-[0.96] border ${
                darkMode 
                  ? 'bg-zinc-800/60 border-zinc-700/60 hover:bg-zinc-800 hover:border-zinc-600' 
                  : 'bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-200'
              }`}
            >
              {act.badge && (
                <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-white text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-full shadow-sm uppercase">
                  {act.badge}
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${act.color} flex items-center justify-center text-white shadow-md shadow-blue-500/10 mb-2 group-hover:shadow-lg transition-shadow`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold text-center leading-tight ${
                darkMode ? 'text-zinc-200' : 'text-slate-700'
              }`}>
                {act.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
