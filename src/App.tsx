import React, { useState } from 'react';
import { Account, Transaction, RefundItem, Language, TabType, UserProfile, ActivityLog, BillReminder } from './types';
import { translations } from './translations';
import { Header } from './components/Header';
import { BalanceCard } from './components/BalanceCard';
import { StatsCards } from './components/StatsCards';
import { QuickActionsGrid } from './components/QuickActionsGrid';
import { TransactionsList } from './components/TransactionsList';
import { TransfersView } from './components/TransfersView';
import { AnalyticsView } from './components/AnalyticsView';
import { AiAssistantView } from './components/AiAssistantView';
import { ProfileView } from './components/ProfileView';
import { BillRemindersView } from './components/BillRemindersView';
import { FlutterStudioModal } from './components/FlutterStudioModal';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  BarChart3, 
  Bot, 
  User,
  Bell,
  Code2, 
  Plus 
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [showFlutterModal, setShowFlutterModal] = useState<boolean>(false);
  const [showAddTxModal, setShowAddTxModal] = useState<boolean>(false);

  // Bill Reminders State
  const [billReminders, setBillReminders] = useState<BillReminder[]>([
    {
      id: 'REM-101',
      title: 'سداد فاتورة الاتصالات والإنترنت ألياف ضوئية',
      category: 'bills',
      amount: 890,
      dueDate: '2026-08-08',
      frequency: 'monthly',
      status: 'upcoming',
      account: 'المحفظة الرئيسية',
      autoDetected: true,
      detectedFrom: 'TX-1005',
      icon: '📄'
    },
    {
      id: 'REM-102',
      title: 'قسط تمويل القرض العقاري والتوسع - البنك الأهلي',
      category: 'loan',
      amount: 3500,
      dueDate: '2026-08-12',
      frequency: 'monthly',
      status: 'upcoming',
      account: 'الحساب البنكي',
      autoDetected: true,
      icon: '🏦'
    },
    {
      id: 'REM-103',
      title: 'اشتراك خوادم السحاب واستضافة السيرفرات Cloud',
      category: 'subscription',
      amount: 450,
      dueDate: '2026-08-18',
      frequency: 'monthly',
      status: 'upcoming',
      account: 'حساب المبيعات',
      autoDetected: true,
      icon: '💻'
    },
    {
      id: 'REM-104',
      title: 'إيجار المقر التجاري الرئيسي - الشدة الأولى',
      category: 'rent',
      amount: 12000,
      dueDate: '2026-08-01',
      frequency: 'monthly',
      status: 'overdue',
      account: 'الحساب البنكي',
      autoDetected: false,
      icon: '🏢'
    }
  ]);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'ali_ahmed_cfo',
    fullName: 'علي أحمد',
    email: 'ali.ahmed@phoenix.com',
    bio: 'المدير المالي لشركة Phoenix. مسؤول عن تدقيق الميزانيات، المبيعات والتحويلات البنكية المباشرة.',
    avatarUrl: '👨‍💼',
    role: 'Chief Financial Officer',
    isOffline: false,
    pendingSyncCount: 2,
    lastSyncedAt: '2026-08-05 14:30',
  });

  // User Recent Activity History State
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: '1', title: 'تحديث بيانات الملف الشخصي', description: 'تم تعديل اسم المستخدم والصورة الشخصية وتخزينها محلياً', timestamp: 'منذ 15 دقيقة', type: 'profile', icon: '👤' },
    { id: '2', title: 'تحويل سريع بين الحسابات', description: 'تم تحويل $500 من المحفظة إلى الحساب البنكي', timestamp: 'منذ ساعة', type: 'transfer', icon: '🔄' },
    { id: '3', title: 'مزامنة كاش أوفلاين SQLite', description: 'تم رفع وتحديث 2 تعديلات معلقة لسيرفر فلاتر', timestamp: 'منذ ساعتين', type: 'offline_sync', icon: '⚡' },
    { id: '4', title: 'تقديم طلب استرداد شحن', description: 'طلب استرداد $420 لشحنة اللوجستيات', timestamp: 'أمس', type: 'refund', icon: '📦' },
    { id: '5', title: 'تسجيل مصروف مشتريات', description: 'تم إضافة $1,240 في المحفظة الرئيسية', timestamp: 'قبل يومين', type: 'edit', icon: '🛍️' },
  ]);

  // Accounts Initial State
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 'wallet', nameKey: 'mainWallet', defaultName: 'المحفظة الرئيسية', icon: '💳', color: '#2563EB', balance: 48230.50, accountNumber: '•••• 8821' },
    { id: 'bank', nameKey: 'bankAccount', defaultName: 'الحساب البنكي', icon: '🏦', color: '#10B981', balance: 124800.00, accountNumber: '•••• 4920' },
    { id: 'sales', nameKey: 'salesAccount', defaultName: 'حساب المبيعات', icon: '📊', color: '#7C3AED', balance: 31450.75, accountNumber: '•••• 1102' },
    { id: 'cash', nameKey: 'cashRegister', defaultName: 'الخزينة النقدية', icon: '💵', color: '#F59E0B', balance: 8750.00, accountNumber: '•••• 0014' },
  ]);

  // Initial Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, title: 'مشتريات إلكترونية ومعدات', cat: 'shopping', amount: -1240, date: '2026-08-04', status: 'completed', acct: 'wallet', icon: '🛍️' },
    { id: 2, title: 'إيداع أرباح المبيعات', cat: 'salary', amount: 28000, date: '2026-08-03', status: 'completed', acct: 'bank', icon: '💵' },
    { id: 3, title: 'سداد فواتير الاتصالات والخدمات', cat: 'bills', amount: -890, date: '2026-08-03', status: 'completed', acct: 'wallet', icon: '📄' },
    { id: 4, title: 'تذاكر وفنادق رحلة عمل', cat: 'travel', amount: -3200, date: '2026-08-02', status: 'pending', acct: 'wallet', icon: '✈️' },
    { id: 5, title: 'تمويل الحملة الإعلانية', cat: 'marketing', amount: -5500, date: '2026-08-01', status: 'completed', acct: 'sales', icon: '📢' },
    { id: 6, title: 'رسوم شحن اللوجستيات', cat: 'shipping', amount: -420, date: '2026-07-31', status: 'failed', acct: 'sales', icon: '📦' },
    { id: 7, title: 'عائد الاستثمار المالي', cat: 'investment', amount: 12000, date: '2026-07-30', status: 'completed', acct: 'bank', icon: '💰' },
    { id: 8, title: 'وجبات إعاشة الفريق', cat: 'food', amount: -380, date: '2026-07-29', status: 'completed', acct: 'cash', icon: '🍽️' },
  ]);

  // Initial Refunds
  const [refunds, setRefunds] = useState<RefundItem[]>([
    { id: 1, icon: '📦', cat: 'shipping', amount: 420, date: '2026-07-31', eligible: true },
    { id: 2, icon: '✈️', cat: 'travel', amount: 3200, date: '2026-08-02', eligible: true },
    { id: 3, icon: '🛍️', cat: 'shopping', amount: 1240, date: '2026-08-04', eligible: false },
  ]);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
  const totalSavings = totalIncome - totalExpenses;

  // Profile update handler
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
    
    // Log activity
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      title: 'تحديث بيانات الملف الشخصي',
      description: `تم حفظ اسم المستخدم @${updated.username || userProfile.username} والصورة الشخصية محلياً`,
      timestamp: 'الآن',
      type: 'profile',
      icon: '👤',
      isOfflineQueued: userProfile.isOffline,
    };

    setActivityLogs((prev) => [newLog, ...prev]);

    if (userProfile.isOffline) {
      setUserProfile((prev) => ({ ...prev, pendingSyncCount: prev.pendingSyncCount + 1 }));
    }
  };

  // Toggle Offline Mode
  const handleToggleOfflineMode = () => {
    const nextOfflineState = !userProfile.isOffline;
    setUserProfile((prev) => ({ ...prev, isOffline: nextOfflineState }));

    const newLog: ActivityLog = {
      id: Date.now().toString(),
      title: nextOfflineState ? 'تفعيل وضع عدم الاتصال (Offline)' : 'العودة للوضع المتصل (Online)',
      description: nextOfflineState 
        ? 'تم تحويل التطبيق لوضع التخزين المحلي SQLite بنجاح'
        : 'تمت إعادة الاتصال بشبكة الخادم المباشرة',
      timestamp: 'الآن',
      type: 'offline_sync',
      icon: '⚡',
    };

    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Sync Pending Offline Edits
  const handleSyncPendingEdits = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setUserProfile((prev) => ({
      ...prev,
      pendingSyncCount: 0,
      lastSyncedAt: `${new Date().toISOString().split('T')[0]} ${timeStr}`,
    }));

    const newLog: ActivityLog = {
      id: Date.now().toString(),
      title: 'مزامنة التعديلات المعلقة محلياً',
      description: 'تم رفع كافة التغييرات المخزنة في SQLite إلى قاعدة البيانات بنجاح!',
      timestamp: 'الآن',
      type: 'offline_sync',
      icon: '🔄',
    };

    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Execute Quick Transfer
  const handleExecuteTransfer = (fromId: string, toId: string, amount: number) => {
    setAccounts((prev) =>
      prev.map((acct) => {
        if (acct.id === fromId) return { ...acct, balance: acct.balance - amount };
        if (acct.id === toId) return { ...acct, balance: acct.balance + amount };
        return acct;
      })
    );

    // Record transaction
    const fromAcctObj = accounts.find(a => a.id === fromId);
    const toAcctObj = accounts.find(a => a.id === toId);

    const newTx: Transaction = {
      id: Date.now(),
      title: `تحويل من ${fromAcctObj?.defaultName} إلى ${toAcctObj?.defaultName}`,
      cat: 'marketing',
      amount: -amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      acct: fromId,
      icon: '🔄',
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Record Activity
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      title: `تحويل $${amount}`,
      description: `من ${fromAcctObj?.defaultName} إلى ${toAcctObj?.defaultName}`,
      timestamp: 'الآن',
      type: 'transfer',
      icon: '💸',
      isOfflineQueued: userProfile.isOffline,
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    if (userProfile.isOffline) {
      setUserProfile((prev) => ({ ...prev, pendingSyncCount: prev.pendingSyncCount + 1 }));
    }
  };

  // Add Transaction
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const createdTx: Transaction = {
      ...newTxData,
      id: Date.now(),
    };

    setTransactions((prev) => [createdTx, ...prev]);

    // Update target account balance
    setAccounts((prev) =>
      prev.map((acct) => {
        if (acct.id === newTxData.acct) {
          return { ...acct, balance: acct.balance + newTxData.amount };
        }
        return acct;
      })
    );

    // Activity log
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      title: `إضافة معاملة: ${newTxData.title || 'جديدة'}`,
      description: `قيمة المعاملة $${Math.abs(newTxData.amount)}`,
      timestamp: 'الآن',
      type: 'edit',
      icon: '📝',
      isOfflineQueued: userProfile.isOffline,
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    if (userProfile.isOffline) {
      setUserProfile((prev) => ({ ...prev, pendingSyncCount: prev.pendingSyncCount + 1 }));
    }
  };

  // Refund Request
  const handleRequestRefund = (item: RefundItem, reason: string) => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: 'pending', reason } : r))
    );

    const newLog: ActivityLog = {
      id: Date.now().toString(),
      title: `طلب استرداد $${item.amount}`,
      description: `السبب: ${reason}`,
      timestamp: 'الآن',
      type: 'refund',
      icon: '↩️',
      isOfflineQueued: userProfile.isOffline,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Pay Bill Reminder Handler
  const handlePayBill = (billId: string, accountId: string, amount: number, title: string, category: string) => {
    // 1. Mark bill as paid
    setBillReminders((prev) =>
      prev.map((r) => (r.id === billId ? { ...r, status: 'paid' } : r))
    );

    // 2. Deduct amount from selected account
    setAccounts((prev) =>
      prev.map((acct) => {
        if (acct.id === accountId) {
          return { ...acct, balance: Math.max(0, acct.balance - amount) };
        }
        return acct;
      })
    );

    // 3. Create transaction record
    const newTx: Transaction = {
      id: Date.now(),
      title: `سداد: ${title}`,
      cat: category === 'bills' ? 'bills' : category === 'loan' ? 'investment' : 'maintenance',
      amount: -amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      acct: accountId,
      icon: category === 'loan' ? '🏦' : '📄'
    };
    setTransactions((prev) => [newTx, ...prev]);

    // 4. Log activity
    const targetAcct = accounts.find(a => a.id === accountId);
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      title: `سداد فاتورة/قسط: ${title}`,
      description: `تم خصم $${amount.toLocaleString()} من ${targetAcct?.defaultName || 'الحساب'}`,
      timestamp: 'الآن',
      type: 'edit',
      icon: '✅',
      isOfflineQueued: userProfile.isOffline,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Add Manual Bill Reminder
  const handleAddBillReminder = (newReminderData: Omit<BillReminder, 'id'>) => {
    const createdReminder: BillReminder = {
      ...newReminderData,
      id: `REM-${Date.now().toString().slice(-4)}`
    };
    setBillReminders((prev) => [createdReminder, ...prev]);

    const newLog: ActivityLog = {
      id: Date.now().toString(),
      title: `تنبيه جديد: ${newReminderData.title}`,
      description: `مبلغ $${newReminderData.amount} - تاريخ الاستحقاق: ${newReminderData.dueDate}`,
      timestamp: 'الآن',
      type: 'edit',
      icon: '🔔',
      isOfflineQueued: userProfile.isOffline,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // AI Auto Detect Reminders Handler
  const handleAutoDetectAI = () => {
    const aiGenerated: BillReminder[] = [
      {
        id: `REM-AI-${Date.now()}-1`,
        title: 'رسوم تراخيص صيانة الأنظمة البرمجية',
        category: 'bills',
        amount: 1250,
        dueDate: '2026-08-22',
        frequency: 'monthly',
        status: 'upcoming',
        account: 'حساب المبيعات',
        autoDetected: true,
        icon: '🛠️'
      },
      {
        id: `REM-AI-${Date.now()}-2`,
        title: 'قسط تمويل أسطول النقل واللوجستيات',
        category: 'loan',
        amount: 2800,
        dueDate: '2026-08-28',
        frequency: 'monthly',
        status: 'upcoming',
        account: 'الحساب البنكي',
        autoDetected: true,
        icon: '🚚'
      }
    ];

    setBillReminders((prev) => [...aiGenerated, ...prev]);

    const newLog: ActivityLog = {
      id: Date.now().toString(),
      title: 'رصد تنبيهات تلقائية بـ AI',
      description: 'تمت إضافة 2 تنبيهات دورية جديدة مستخرجة من نمط المعاملات',
      timestamp: 'الآن',
      type: 'edit',
      icon: '✨',
      isOfflineQueued: userProfile.isOffline,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const t = translations[language];

  return (
    <div 
      dir={language === 'ar' ? 'rtl' : 'ltr'} 
      className={`min-h-screen transition-colors duration-200 font-sans ${
        darkMode ? 'bg-[#121212] text-zinc-100' : 'bg-[#F8F9FA] text-slate-900'
      }`}
    >
      {/* Top Header Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenFlutterStudio={() => setShowFlutterModal(false)}
        profile={userProfile}
        reminders={billReminders}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between mb-6 pb-2 overflow-x-auto">
          <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 ${
            darkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200'
          }`}>
            {[
              { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
              { id: 'transfers', label: t.transfers, icon: ArrowLeftRight },
              { id: 'bills', label: t.billReminders, icon: Bell, badge: billReminders.filter(r => r.status !== 'paid').length },
              { id: 'analytics', label: t.analytics, icon: BarChart3 },
              { id: 'ai', label: t.aiAssistant, icon: Bot },
              { id: 'profile', label: t.profile, icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as TabType)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                      : darkMode
                      ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-500 text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Flutter Studio Button directly in Subheader */}
          <button
            onClick={() => setShowFlutterModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t.flutterStudio}</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-mono">Dart</span>
          </button>
        </div>

        {/* Tab Views */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            <BalanceCard
              accounts={accounts}
              totalBalance={totalBalance}
              language={language}
              darkMode={darkMode}
              onQuickTransfer={() => setCurrentTab('transfers')}
            />

            <StatsCards
              income={totalIncome}
              expenses={totalExpenses}
              savings={totalSavings}
              language={language}
              darkMode={darkMode}
            />

            <QuickActionsGrid
              language={language}
              darkMode={darkMode}
              onSelectTab={setCurrentTab}
              onOpenAddModal={() => setShowAddTxModal(true)}
              onOpenFlutterStudio={() => setShowFlutterModal(true)}
            />

            <TransactionsList
              transactions={transactions}
              accounts={accounts}
              language={language}
              darkMode={darkMode}
              onAddTransaction={handleAddTransaction}
              showAddModal={showAddTxModal}
              setShowAddModal={setShowAddTxModal}
            />
          </div>
        )}

        {currentTab === 'transfers' && (
          <div className="animate-fadeIn">
            <TransfersView
              accounts={accounts}
              refunds={refunds}
              language={language}
              darkMode={darkMode}
              onExecuteTransfer={handleExecuteTransfer}
              onRequestRefund={handleRequestRefund}
            />
          </div>
        )}

        {currentTab === 'bills' && (
          <div className="animate-fadeIn">
            <BillRemindersView
              language={language}
              darkMode={darkMode}
              reminders={billReminders}
              accounts={accounts}
              onPayBill={handlePayBill}
              onAddReminder={handleAddBillReminder}
              onAutoDetectAI={handleAutoDetectAI}
            />
          </div>
        )}

        {currentTab === 'analytics' && (
          <div className="animate-fadeIn">
            <AnalyticsView language={language} darkMode={darkMode} />
          </div>
        )}

        {currentTab === 'ai' && (
          <div className="animate-fadeIn">
            <AiAssistantView language={language} darkMode={darkMode} />
          </div>
        )}

        {currentTab === 'profile' && (
          <div className="animate-fadeIn">
            <ProfileView
              profile={userProfile}
              activityLogs={activityLogs}
              language={language}
              darkMode={darkMode}
              onUpdateProfile={handleUpdateProfile}
              onToggleOfflineMode={handleToggleOfflineMode}
              onSyncPendingEdits={handleSyncPendingEdits}
            />
          </div>
        )}

      </main>

      {/* Flutter Code Studio Modal */}
      <FlutterStudioModal
        isOpen={showFlutterModal}
        onClose={() => setShowFlutterModal(false)}
        language={language}
        darkMode={darkMode}
      />

    </div>
  );
}

