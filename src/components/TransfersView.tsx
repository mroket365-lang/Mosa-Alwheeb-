import React, { useState } from 'react';
import { Account, Language, RefundItem } from '../types';
import { translations } from '../translations';
import { 
  ArrowLeftRight, 
  RotateCcw, 
  Paperclip, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  RefreshCw,
  Wallet,
  Building2,
  Receipt,
  Clock
} from 'lucide-react';

interface TransfersViewProps {
  accounts: Account[];
  refunds: RefundItem[];
  language: Language;
  darkMode: boolean;
  onExecuteTransfer: (fromId: string, toId: string, amount: number) => void;
  onRequestRefund: (item: RefundItem, reason: string) => void;
}

export const TransfersView: React.FC<TransfersViewProps> = ({
  accounts,
  refunds,
  language,
  darkMode,
  onExecuteTransfer,
  onRequestRefund
}) => {
  const t = translations[language];

  // Transfer Form State
  const [fromAcct, setFromAcct] = useState('wallet');
  const [toAcct, setToAcct] = useState('bank');
  const [amount, setAmount] = useState('500');
  const [attachReceipt, setAttachReceipt] = useState(false);
  const [transferSuccessMsg, setTransferSuccessMsg] = useState('');

  // Refund Form State
  const [selectedRefundId, setSelectedRefundId] = useState<string | number>(refunds[0]?.id || 1);
  const [refundReason, setRefundReason] = useState('');
  const [refundSuccessMsg, setRefundSuccessMsg] = useState('');

  const handleSwap = () => {
    const temp = fromAcct;
    setFromAcct(toAcct);
    setToAcct(temp);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (!val || val <= 0) return;

    if (fromAcct === toAcct) {
      alert(language === 'ar' ? 'يرجى اختيار حسابين مختلفين للتحويل' : 'Please select two different accounts');
      return;
    }

    onExecuteTransfer(fromAcct, toAcct, val);
    setTransferSuccessMsg(t.transferSuccess);
    setTimeout(() => setTransferSuccessMsg(''), 4000);
  };

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = refunds.find((r) => r.id === selectedRefundId);
    if (!item) return;

    onRequestRefund(item, refundReason || 'استرداد عام بناءً على طلب العميل');
    setRefundSuccessMsg(language === 'ar' ? 'تم إرسال طلب الاسترداد بنجاح وهو قيد المراجعة' : 'Refund request submitted');
    setRefundReason('');
    setTimeout(() => setRefundSuccessMsg(''), 4000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Quick Transfer Form Box */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl ${
        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-700/40 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${darkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
              {t.quickTransfer}
            </h3>
            <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              تحويل فوري بين الحسابات والأرصدة بدون أي رسوم
            </p>
          </div>
        </div>

        {transferSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{transferSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleTransferSubmit} className="space-y-5 text-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            
            {/* From Account */}
            <div className="md:col-span-2">
              <label className="block font-bold mb-1 text-slate-400">{t.from}</label>
              <select
                value={fromAcct}
                onChange={(e) => setFromAcct(e.target.value)}
                className={`w-full p-3 rounded-2xl border font-semibold outline-none transition-all ${
                  darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.icon} {t[a.nameKey as keyof typeof t] || a.defaultName} ({formatCurrency(a.balance)})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center md:pt-5">
              <button
                type="button"
                onClick={handleSwap}
                className="p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 hover:scale-110 active:scale-95 transition-all"
                title={t.swapAccounts}
              >
                <ArrowLeftRight className="w-5 h-5" />
              </button>
            </div>

            {/* To Account */}
            <div className="md:col-span-2">
              <label className="block font-bold mb-1 text-slate-400">{t.to}</label>
              <select
                value={toAcct}
                onChange={(e) => setToAcct(e.target.value)}
                className={`w-full p-3 rounded-2xl border font-semibold outline-none transition-all ${
                  darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.icon} {t[a.nameKey as keyof typeof t] || a.defaultName} ({formatCurrency(a.balance)})
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-bold mb-1 text-slate-400">{t.amount}</label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full p-3.5 rounded-2xl border font-mono font-extrabold text-lg outline-none ${
                  darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-400 font-medium">
                <input
                  type="checkbox"
                  checked={attachReceipt}
                  onChange={(e) => setAttachReceipt(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <Paperclip className="w-4 h-4 text-blue-500" />
                <span>{t.attachReceipt}</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{t.transfer}</span>
          </button>

        </form>
      </div>

      {/* Refund Request Section */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl ${
        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-700/40 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${darkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
              {t.refundRequest}
            </h3>
            <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              تقديم واسترداد المبالغ للمعاملات والشحنات المؤهلة
            </p>
          </div>
        </div>

        {refundSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{refundSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleRefundSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold mb-1 text-slate-400">اختر المعاملة المراد استردادها</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {refunds.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedRefundId(item.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedRefundId === item.id
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                      : darkMode
                      ? 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="font-bold">{t[item.cat as keyof typeof t] || item.cat}</p>
                      <p className="text-[11px] text-slate-400">{item.date}</p>
                    </div>
                  </div>
                  <span className="font-mono font-extrabold text-amber-500">${item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-400">سبب طلب الاسترداد</label>
            <textarea
              rows={2}
              placeholder="اكتب سبب طلب الاسترداد التفصيلي..."
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className={`w-full p-3 rounded-2xl border outline-none ${
                darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.requestRefund}</span>
          </button>

        </form>
      </div>

    </div>
  );
};
