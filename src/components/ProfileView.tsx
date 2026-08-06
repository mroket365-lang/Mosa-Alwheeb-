import React, { useState } from 'react';
import { UserProfile, ActivityLog, Language } from '../types';
import { translations } from '../translations';
import { 
  User, 
  Camera, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Database, 
  ShieldCheck, 
  Save, 
  History, 
  ArrowLeftRight, 
  Edit3, 
  Zap,
  Sparkles,
  Layers,
  FileCode
} from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  activityLogs: ActivityLog[];
  language: Language;
  darkMode: boolean;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
  onToggleOfflineMode: () => void;
  onSyncPendingEdits: () => void;
}

const PRESET_AVATARS = [
  { id: '1', emoji: '👨‍💼', color: 'from-blue-600 to-indigo-600', label: 'المدير المالي' },
  { id: '2', emoji: '👩‍💼', color: 'from-purple-600 to-pink-600', label: 'مديرة الحسابات' },
  { id: '3', emoji: '🧑‍بي', color: 'from-emerald-600 to-teal-600', label: 'محلل مالي' },
  { id: '4', emoji: '🦁', color: 'from-amber-500 to-orange-600', label: 'Phoenix Executive' },
  { id: '5', emoji: '🚀', color: 'from-cyan-500 to-blue-600', label: 'Crypto Trader' },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  activityLogs,
  language,
  darkMode,
  onUpdateProfile,
  onToggleOfflineMode,
  onSyncPendingEdits,
}) => {
  const t = translations[language];

  // Editable Profile Form State
  const [username, setUsername] = useState(profile.username);
  const [fullName, setFullName] = useState(profile.fullName);
  const [bio, setBio] = useState(profile.bio);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatarUrl);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'transfer' | 'edit' | 'offline_sync' | 'profile'>('all');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      username,
      fullName,
      bio,
      avatarUrl: selectedAvatar,
    });

    setSaveSuccessMsg(t.profileUpdated);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const filteredLogs = activityLogs.filter((log) => {
    if (activeFilter === 'all') return true;
    return log.type === activeFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Offline Storage Status & Sync Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
        profile.isOffline
          ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border-amber-500/40'
          : darkMode
          ? 'bg-zinc-900 border-zinc-800'
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
            profile.isOffline
              ? 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-amber-500/25'
              : 'bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/25'
          }`}>
            {profile.isOffline ? <WifiOff className="w-6 h-6 animate-pulse" /> : <Wifi className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-bold text-lg ${darkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                {t.offlineStorage}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border flex items-center gap-1 ${
                profile.isOffline
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {profile.isOffline ? '⚡ أوفلاين (Offline)' : '🟢 متصل (Online)'}
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              {profile.isOffline ? t.offlineNotice : 'تم حفظ البيانات محلياً في ذاكرة التخزين الدائمة وتطبيق فلاتر'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Pending Edits Badge */}
          {profile.pendingSyncCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 animate-bounce">
              <Clock className="w-3.5 h-3.5" />
              <span>{profile.pendingSyncCount} تعديلات معلقة</span>
            </div>
          )}

          {/* Toggle Offline Mode Button */}
          <button
            onClick={onToggleOfflineMode}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              profile.isOffline
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                : 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border-blue-500/30'
            }`}
          >
            {profile.isOffline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span>{profile.isOffline ? 'الرجوع للوضع المتصل' : 'تجربة وضع الأوفلاين'}</span>
          </button>

          {/* Sync Button */}
          {profile.pendingSyncCount > 0 && (
            <button
              onClick={onSyncPendingEdits}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{t.syncNow}</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Form & Card Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Card */}
        <div className={`p-6 rounded-3xl border shadow-xl flex flex-col items-center text-center justify-between ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-full flex flex-col items-center">
            
            {/* Avatar Circle */}
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-1 shadow-xl shadow-blue-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-900 rounded-[22px] flex items-center justify-center text-4xl">
                  {selectedAvatar || '👨‍💼'}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-blue-600 text-white border-2 border-zinc-900 shadow-md">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <h3 className={`font-extrabold text-xl ${darkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
              {fullName}
            </h3>
            <p className="text-xs font-mono text-blue-500 font-bold mt-0.5">@{username}</p>
            
            <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{profile.role}</span>
            </span>

            <p className={`text-xs mt-4 leading-relaxed px-2 ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
              "{bio}"
            </p>
          </div>

          <div className="w-full pt-6 mt-6 border-t border-zinc-700/40 text-xs text-start space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">آخر مزامنة:</span>
              <span className="font-bold">{profile.lastSyncedAt}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">حالة قاعدة البيانات:</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <Database className="w-3.5 h-3.5" /> SQLite Ready
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className={`lg:col-span-2 p-6 sm:p-7 rounded-3xl border shadow-xl ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-700/40 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${darkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                  {t.profile}
                </h3>
                <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                  تعديل اسم المستخدم، الصورة الشخصية، والنبذة التعريفية
                </p>
              </div>
            </div>

            <span className="text-xs text-slate-400 font-mono">ID: PHX-USR-8821</span>
          </div>

          {saveSuccessMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5 text-xs">
            
            {/* Avatar Selector */}
            <div>
              <label className="block font-bold mb-2 text-slate-400">{t.profilePicture}</label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.emoji)}
                    className={`p-3 rounded-2xl border text-2xl flex flex-col items-center gap-1 transition-all ${
                      selectedAvatar === av.emoji
                        ? 'bg-blue-600/20 border-blue-500 scale-110 shadow-lg'
                        : darkMode
                        ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'
                        : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span>{av.emoji}</span>
                    <span className="text-[9px] font-sans font-medium text-slate-400">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1 text-slate-400">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full p-3.5 rounded-2xl border font-bold text-sm outline-none ${
                    darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-400">{t.username}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400 font-mono">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full p-3.5 pl-8 rounded-2xl border font-mono font-bold text-sm outline-none ${
                      darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-400">{t.bio}</label>
              <textarea
                rows={3}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="اكتب نبذة مختصرة عن دورك الوظيفي والمسؤوليات..."
                className={`w-full p-3.5 rounded-2xl border text-xs leading-relaxed outline-none ${
                  darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveProfile}</span>
            </button>

          </form>
        </div>

      </div>

      {/* Activity History Timeline */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl ${
        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-700/40 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${darkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                {t.activityHistory}
              </h3>
              <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                سجل كافة الإجراءات والتحويلات والتحديثات المحفوظة محلياً
              </p>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-xs overflow-x-auto">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'transfer', label: 'التحويلات' },
              { id: 'profile', label: 'الملف الشخصي' },
              { id: 'offline_sync', label: 'المزامنة' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeFilter === f.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Timeline List */}
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                darkMode ? 'bg-zinc-800/50 border-zinc-700/60 hover:bg-zinc-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center text-xl shrink-0 mt-0.5">
                {log.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-200">{log.title}</h4>
                  <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                </div>
                <p className={`text-xs mt-1 ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                  {log.description}
                </p>
              </div>

              {log.isOfflineQueued && (
                <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold shrink-0">
                  ⚡ محلي (SQLite)
                </span>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
