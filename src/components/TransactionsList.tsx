import React, { useState } from 'react';
import { Transaction, Language, Account } from '../types';
import { translations } from '../translations';
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  X, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  Tag
} from 'lucide-react';

interface TransactionsListProps {
  transactions: Transaction[];
  accounts: Account[];
  language: Language;
  darkMode: boolean;
  onAddTransaction: (newTx: Omit<Transaction, 'id'>) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  accounts,
  language,
  darkMode,
  onAddTransaction,
  showAddModal,
  setShowAddModal,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  // Form State for Add Transaction
  const [newCat, setNewCat] = useState('shopping');
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newAcct, setNewAcct] = useState('wallet');
  const [newType, setNewType] = useState<'expense' | 'income'>('expense');

  const categories = [
    { id: 'shopping', nameKey: 'shopping', icon: '🛍️' },
    { id: 'bills', nameKey: 'bills', icon: '📄' },
    { id: 'salary', nameKey: 'salary', icon: '💵' },
    { id: 'marketing', nameKey: 'marketing', icon: '📢' },
    { id: 'travel', nameKey: 'travel', icon: '✈️' },
    { id: 'shipping', nameKey: 'shipping', icon: '📦' },
    { id: 'food', nameKey: 'food', icon: '🍽️' },
    { id: 'investment', nameKey: 'investment', icon: '💰' },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    const catName = t[tx.cat as keyof typeof t] || tx.cat;
    const matchesSearch = (tx.title || catName).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || isNaN(Number(newAmount))) return;

    const selectedCatObj = categories.find((c) => c.id === newCat);
    const amountVal = Number(newAmount) * (newType === 'expense' ? -1 : 1);

    onAddTransaction({
      title: newTitle || (t[newCat as keyof typeof t] as string),
      cat: newCat,
      amount: amountVal,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      acct: newAcct,
      icon: selectedCatObj ? selectedCatObj.icon : '💵',
    });

    setNewAmount('');
    setNewTitle('');
    setShowAddModal(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className={`p-5 rounded-3xl border ${
      darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
    }`}>
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className={`font-bold text-lg ${darkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
            {t.recentTransactions}
          </h3>
          <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            سجل حركة الأموال المقيدة عبر جميع الحسابات
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة معاملة</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
        <div className={`relative flex-1 w-full flex items-center px-3 py-2 rounded-xl border ${
          darkMode ? 'bg-zinc-800/80 border-zinc-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="بحث عن معاملة أو فئة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: t.allTime },
            { id: 'completed', label: t.completed },
            { id: 'pending', label: t.pending },
            { id: 'failed', label: t.failed },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : darkMode
                  ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            لا توجد معاملات مطابقة للبحث حالياً.
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.amount > 0;
            const acctObj = accounts.find((a) => a.id === tx.acct);
            const catLabel = t[tx.cat as keyof typeof t] || tx.cat;

            return (
              <div
                key={tx.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  darkMode 
                    ? 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800' 
                    : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center text-xl shrink-0">
                    {tx.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-xs ${darkMode ? 'text-zinc-100' : 'text-slate-800'}`}>
                        {tx.title || catLabel}
                      </p>
                      <span className={`text-[10px] px-2 py-0.2 rounded-md font-medium ${
                        darkMode ? 'bg-zinc-700/60 text-zinc-300' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {catLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {tx.date}
                      </span>
                      {acctObj && (
                        <span className="font-medium text-blue-500">
                          {acctObj.icon} {t[acctObj.nameKey as keyof typeof t] || acctObj.defaultName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount & Status Badge */}
                <div className="text-end">
                  <p className={`font-mono font-extrabold text-sm ${
                    isIncome ? 'text-emerald-500' : darkMode ? 'text-zinc-100' : 'text-slate-900'
                  }`}>
                    {isIncome ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                  <div className="mt-0.5 flex items-center justify-end gap-1 text-[10px]">
                    {tx.status === 'completed' && (
                      <span className="text-emerald-500 flex items-center gap-0.5 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        {t.completed}
                      </span>
                    )}
                    {tx.status === 'pending' && (
                      <span className="text-amber-500 flex items-center gap-0.5 font-medium">
                        <Clock className="w-3 h-3" />
                        {t.pending}
                      </span>
                    )}
                    {tx.status === 'failed' && (
                      <span className="text-rose-500 flex items-center gap-0.5 font-medium">
                        <XCircle className="w-3 h-3" />
                        {t.failed}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl relative ${
            darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg mb-4">إضافة معاملة مالية جديدة</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => setNewType('expense')}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    newType === 'expense' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  مصروف (إخراج)
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('income')}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    newType === 'income' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  إيراد (إدخال)
                </button>
              </div>

              <div>
                <label className="block font-medium mb-1">وصف المعاملة</label>
                <input
                  type="text"
                  placeholder="مثال: شراء تجهيزات مكتبية"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">المبلغ ($)</label>
                <input
                  type="number"
                  placeholder="150"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none font-mono font-bold text-base ${
                    darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">الفئة</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {t[c.nameKey as keyof typeof t] || c.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">الحساب</label>
                  <select
                    value={newAcct}
                    onChange={(e) => setNewAcct(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.icon} {t[a.nameKey as keyof typeof t] || a.defaultName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                >
                  حفظ المعاملة
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
