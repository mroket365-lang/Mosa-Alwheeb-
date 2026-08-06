import React, { useState } from 'react';
import { Language, TabType, UserProfile, BillReminder } from '../types';
import { translations } from '../translations';
import { 
  Sun, 
  Moon, 
  Globe, 
  Bell, 
  Code2, 
  Wallet, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onOpenFlutterStudio: () => void;
  profile?: UserProfile;
  reminders?: BillReminder[];
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  onOpenFlutterStudio,
  profile,
  reminders = []
}) => {
  const t = translations[language];
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const upcomingReminders = reminders.filter(r => r.status !== 'paid');
  const unreadCount = upcomingReminders.length;

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
      darkMode ? 'bg-[#18181B]/95 border-zinc-800 backdrop-blur-md' : 'bg-white/95 border-slate-200 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950/20 rounded-[10px] flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Phoenix
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  darkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  v2.4
                </span>
              </div>
              <p className={`text-[11px] font-medium leading-none ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                {t.appName}
              </p>
            </div>
          </div>

          {/* Center Action: Flutter Studio Trigger */}
          <button
            onClick={onOpenFlutterStudio}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-medium text-xs shadow-md shadow-blue-500/15 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Code2 className="w-4 h-4 animate-pulse" />
            <span>{t.flutterStudio}</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold">Dart</span>
          </button>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Flutter Code Button on Mobile */}
            <button
              onClick={onOpenFlutterStudio}
              className="sm:hidden p-2 rounded-xl bg-blue-600 text-white flex items-center justify-center"
              title={t.flutterStudio}
            >
              <Code2 className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  darkMode 
                    ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200 hover:bg-zinc-700' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span className="uppercase">{language}</span>
              </button>

              {showLangMenu && (
                <div className={`absolute left-0 sm:right-0 mt-2 w-36 rounded-2xl border shadow-xl py-1.5 z-50 transition-all ${
                  darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  {[
                    { code: 'ar', name: 'العربية (Arabic)' },
                    { code: 'en', name: 'English' },
                    { code: 'zh', name: '中文 (Chinese)' },
                    { code: 'es', name: 'Español' },
                    { code: 'fr', name: 'Français' },
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code as Language);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-start px-3 py-1.5 text-xs font-medium hover:bg-blue-500/10 transition-colors flex items-center justify-between ${
                        language === item.code ? 'text-blue-600 font-bold' : ''
                      }`}
                    >
                      <span>{item.name}</span>
                      {language === item.code && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-xl border transition-all ${
                  darkMode 
                    ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 animate-ping opacity-75" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute left-0 sm:right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl p-4 z-50 transition-all ${
                  darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-700/50 mb-3">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-500" />
                      <h4 className="font-bold text-sm">تنبيهات الفواتير والقروض</h4>
                    </div>
                    <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-zinc-200">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto">
                    {upcomingReminders.length === 0 ? (
                      <div className="text-center py-6 text-xs text-zinc-400">
                        لا يوجد فواتير أو أقساط قادمة بانتظار السداد حالياً 🎉
                      </div>
                    ) : (
                      upcomingReminders.map((r) => (
                        <div key={r.id} className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                          r.status === 'overdue'
                            ? darkMode ? 'bg-red-950/30 border-red-900/50' : 'bg-red-50 border-red-200'
                            : darkMode ? 'bg-zinc-800/60 border-zinc-700/50' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="text-xl shrink-0 mt-0.5">{r.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-xs">{r.title}</p>
                              <span className="font-mono font-black text-blue-500">${r.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-500" />
                                <span>استحقاق: {r.dueDate}</span>
                              </span>
                              {r.autoDetected && (
                                <span className="text-purple-400 font-semibold">رصد AI</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-800 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        setCurrentTab('analytics');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-500 hover:underline"
                    >
                      <span>عرض إدارة الفواتير الكاملة والتصدير</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-all ${
                darkMode 
                  ? 'bg-zinc-800/80 border-zinc-700 text-amber-400 hover:bg-zinc-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile Avatar */}
            <div 
              onClick={() => setCurrentTab('profile')}
              className={`flex items-center gap-2 p-1 pl-2.5 rounded-2xl border cursor-pointer hover:scale-105 transition-all ${
                currentTab === 'profile'
                  ? 'border-blue-500 bg-blue-500/10'
                  : darkMode ? 'bg-zinc-800/80 border-zinc-700' : 'bg-slate-100 border-slate-200'
              }`}
              title={t.profile}
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {profile?.avatarUrl || '👨‍💼'}
              </div>
              <div className="hidden md:block text-start">
                <p className={`text-xs font-bold leading-tight ${darkMode ? 'text-zinc-100' : 'text-slate-800'}`}>
                  {profile?.fullName || 'علي أحمد'}
                </p>
                <p className={`text-[10px] ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {profile?.role || 'المدير المالي'}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
