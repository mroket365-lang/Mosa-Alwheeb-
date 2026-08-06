import React, { useState } from 'react';
import { Language, BillReminder, Account, Transaction } from '../types';
import { translations } from '../translations';
import { 
  Bell, 
  Calendar, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Building2, 
  CreditCard, 
  DollarSign, 
  FileText, 
  RefreshCw, 
  Check, 
  X,
  Zap
} from 'lucide-react';

interface BillRemindersViewProps {
  language: Language;
  darkMode: boolean;
  reminders: BillReminder[];
  accounts: Account[];
  onPayBill: (billId: string, accountId: string, amount: number, title: string, category: string) => void;
  onAddReminder: (newReminder: Omit<BillReminder, 'id'>) => void;
  onAutoDetectAI: () => void;
}

export const BillRemindersView: React.FC<BillRemindersViewProps> = ({
  language,
  darkMode,
  reminders,
  accounts,
  onPayBill,
  onAddReminder,
  onAutoDetectAI,
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'all' | 'bills' | 'loan' | 'subscription'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [payingBillId, setPayingBillId] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || 'bank');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);

  // New Reminder Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'bills' | 'loan' | 'subscription' | 'rent' | 'other'>('bills');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [account, setAccount] = useState('bank');

  const filteredReminders = reminders.filter(r => {
    if (activeTab === 'all') return true;
    if (activeTab === 'bills') return r.category === 'bills' || r.category === 'rent' || r.category === 'other';
    if (activeTab === 'loan') return r.category === 'loan';
    if (activeTab === 'subscription') return r.category === 'subscription';
    return true;
  });

  const getDaysLeft = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleRunAiAutoDetect = () => {
    setAiAnalyzing(true);
    setAiSuccessMsg(null);
    setTimeout(() => {
      onAutoDetectAI();
      setAiAnalyzing(false);
      setAiSuccessMsg('تم تحليل سجل العمليات بنجاح ورصد 3 تنبيهات فواتير وأقساط دورية جاري استحقاقها!');
      setTimeout(() => setAiSuccessMsg(null), 6000);
    }, 1200);
  };

  const handleConfirmPay = (bill: BillReminder) => {
    onPayBill(bill.id, selectedAccountId, bill.amount, bill.title, bill.category);
    setPayingBillId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !dueDate) return;

    onAddReminder({
      title,
      category,
      amount: parseFloat(amount),
      dueDate,
      frequency,
      status: 'upcoming',
      account,
      icon: category === 'loan' ? '🏦' : category === 'subscription' ? '📱' : '📄'
    });

    setTitle('');
    setAmount('');
    setDueDate('');
    setShowAddModal(false);
  };

  const upcomingCount = reminders.filter(r => r.status === 'upcoming').length;
  const overdueCount = reminders.filter(r => r.status === 'overdue').length;
  const totalUpcomingAmount = reminders.filter(r => r.status !== 'paid').reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Metric Summary */}
      <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden ${
        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-200/50'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className={`font-extrabold text-lg ${darkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                {t.billReminders}
              </h3>
              {overdueCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-500 text-white animate-pulse">
                  {overdueCount} {t.overdueNotice}
                </span>
              )}
            </div>
            <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
              نظام ذكي لرصد الفواتير وأقساط القروض المستقبلية وتذكيرك بمواعيد الاستحقاق لمنع غرامات التأخير.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* AI Auto-Detect Button */}
            <button
              onClick={handleRunAiAutoDetect}
              disabled={aiAnalyzing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${aiAnalyzing ? 'animate-spin' : ''}`} />
              <span>{aiAnalyzing ? 'جاري تحليل سجل المعاملات...' : t.aiAutoDetect}</span>
            </button>

            {/* Add Custom Reminder */}
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addReminder}</span>
            </button>
          </div>
        </div>

        {/* AI Success Banner */}
        {aiSuccessMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs flex items-center gap-2 animate-fadeIn">
            <Zap className="w-4 h-4 shrink-0 text-purple-500" />
            <span className="font-semibold">{aiSuccessMsg}</span>
          </div>
        )}

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-800/60 border-zinc-700/60' : 'bg-white/80 border-slate-200'}`}>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">إجمالي المستحقات القادمة</p>
            <p className="text-xl font-black font-mono text-amber-500 mt-1">${totalUpcomingAmount.toLocaleString()}</p>
          </div>

          <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-800/60 border-zinc-700/60' : 'bg-white/80 border-slate-200'}`}>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">الفواتير المستحقة القادمة</p>
            <p className="text-xl font-black font-mono text-blue-500 mt-1">{upcomingCount} فواتير</p>
          </div>

          <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-800/60 border-zinc-700/60' : 'bg-white/80 border-slate-200'}`}>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">حالة السداد هذا الشهر</p>
            <p className="text-xl font-black font-mono text-emerald-500 mt-1">
              {reminders.filter(r => r.status === 'paid').length} / {reminders.length} مدفوعة
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-zinc-800">
        {[
          { id: 'all', label: 'كافة التنبيهات', icon: Bell, count: reminders.length },
          { id: 'bills', label: t.upcomingBills, icon: FileText, count: reminders.filter(r => r.category === 'bills' || r.category === 'rent').length },
          { id: 'loan', label: t.loanInstallments, icon: Building2, count: reminders.filter(r => r.category === 'loan').length },
          { id: 'subscription', label: t.subscriptions, icon: CreditCard, count: reminders.filter(r => r.category === 'subscription').length },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : darkMode
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReminders.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 dark:text-zinc-400 text-sm">
            لا يوجد تنبيهات مطابقة لهذا التصنيف حالياً.
          </div>
        ) : (
          filteredReminders.map(bill => {
            const daysLeft = getDaysLeft(bill.dueDate);
            const isOverdue = daysLeft < 0 && bill.status !== 'paid';
            const isPaid = bill.status === 'paid';

            return (
              <div
                key={bill.id}
                className={`p-5 rounded-3xl border shadow-md transition-all relative overflow-hidden ${
                  isPaid
                    ? darkMode ? 'bg-zinc-900/50 border-zinc-800 opacity-70' : 'bg-slate-50 border-slate-200 opacity-80'
                    : isOverdue
                      ? darkMode ? 'bg-red-950/20 border-red-900/60' : 'bg-red-50/60 border-red-200'
                      : darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-2xl shrink-0">
                      {bill.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-sm ${darkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                          {bill.title}
                        </h4>
                        {bill.autoDetected && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>رصد تلقائي</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>تاريخ الاستحقاق: {bill.dueDate}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-[10px] font-semibold">
                          {bill.frequency === 'monthly' ? 'شهري' : bill.frequency === 'quarterly' ? 'ربع سنوي' : 'سنوي'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount Badge */}
                  <div className="text-left shrink-0">
                    <p className={`font-mono font-black text-lg ${
                      isPaid 
                        ? 'text-slate-400 line-through' 
                        : isOverdue ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      ${bill.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400">{bill.account}</p>
                  </div>
                </div>

                {/* Status Bar & Action Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم السداد بالكامل</span>
                      </span>
                    ) : isOverdue ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 animate-pulse">
                        <AlertCircle className="w-4 h-4" />
                        <span>متأخر بـ {Math.abs(daysLeft)} أيام</span>
                      </span>
                    ) : daysLeft === 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Clock className="w-4 h-4" />
                        <span>مستحق اليوم!</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>متبقي {daysLeft} أيام</span>
                      </span>
                    )}
                  </div>

                  {!isPaid && (
                    <div>
                      {payingBillId === bill.id ? (
                        <div className="flex items-center gap-2 animate-fadeIn">
                          <select
                            value={selectedAccountId}
                            onChange={(e) => setSelectedAccountId(e.target.value)}
                            className={`text-xs p-1.5 rounded-xl border font-medium ${
                              darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-slate-100 border-slate-200 text-slate-800'
                            }`}
                          >
                            {accounts.map(acc => (
                              <option key={acc.id} value={acc.id}>
                                {acc.defaultName} (${acc.balance.toLocaleString()})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleConfirmPay(bill)}
                            className="p-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                            title="تأكيد الخصم والسداد"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setPayingBillId(null)}
                            className="p-1.5 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPayingBillId(bill.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                        >
                          {t.payNow}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add New Reminder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl relative ${
            darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-base">{t.addReminder}</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold mb-1">اسم الفاتورة / القسط</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: قسط قرض التوسع أو فاتورة الكهرباء"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full p-3 rounded-2xl border text-xs font-medium outline-none transition-all ${
                    darkMode ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">التصنيف</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className={`w-full p-3 rounded-2xl border text-xs font-medium outline-none ${
                      darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="bills">فاتورة خدمات</option>
                    <option value="loan">قسط قرض</option>
                    <option value="subscription">اشتراك شهري</option>
                    <option value="rent">إيجار مقر</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">المبلغ ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`w-full p-3 rounded-2xl border text-xs font-mono font-bold outline-none ${
                      darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full p-3 rounded-2xl border text-xs font-medium outline-none ${
                      darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">التكرار</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className={`w-full p-3 rounded-2xl border text-xs font-medium outline-none ${
                      darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="monthly">شهري</option>
                    <option value="quarterly">ربع سنوي</option>
                    <option value="yearly">سنوي</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20"
                >
                  حفظ التذكير
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
