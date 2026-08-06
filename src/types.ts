export type Language = 'ar' | 'en' | 'zh' | 'es' | 'fr';

export type TabType = 'dashboard' | 'transfers' | 'analytics' | 'ai' | 'profile' | 'bills' | 'flutter_code';

export interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  bio: string;
  avatarUrl: string;
  role: string;
  isOffline: boolean;
  pendingSyncCount: number;
  lastSyncedAt: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'transfer' | 'edit' | 'offline_sync' | 'refund' | 'profile';
  icon: string;
  isOfflineQueued?: boolean;
}

export interface Account {
  id: string;
  nameKey: string;
  defaultName: string;
  icon: string;
  color: string;
  balance: number;
  accountNumber: string;
}

export interface Transaction {
  id: string | number;
  title?: string;
  cat: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  acct: string;
  icon: string;
  receiptAttached?: boolean;
}

export interface Category {
  id: string;
  icon: string;
  color: string;
  amount: number;
}

export interface RefundItem {
  id: string | number;
  icon: string;
  cat: string;
  amount: number;
  date: string;
  eligible: boolean;
  reason?: string;
  status?: 'pending' | 'approved' | 'declined';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export interface BillReminder {
  id: string;
  title: string;
  category: 'bills' | 'loan' | 'subscription' | 'rent' | 'other';
  amount: number;
  dueDate: string;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  status: 'upcoming' | 'overdue' | 'paid';
  account: string;
  autoDetected?: boolean;
  detectedFrom?: string;
  icon: string;
}

export interface TranslationDictionary {
  appName: string;
  totalBalance: string;
  income: string;
  expenses: string;
  savings: string;
  dashboard: string;
  transfers: string;
  analytics: string;
  aiAssistant: string;
  recentTransactions: string;
  quickTransfer: string;
  from: string;
  to: string;
  amount: string;
  transfer: string;
  refundRequest: string;
  requestRefund: string;
  monthlyOverview: string;
  categoryBreakdown: string;
  askAnything: string;
  send: string;
  lastMonth: string;
  thisMonth: string;
  pending: string;
  completed: string;
  failed: string;
  shopping: string;
  bills: string;
  salary: string;
  marketing: string;
  maintenance: string;
  travel: string;
  shipping: string;
  food: string;
  health: string;
  entertainment: string;
  investment: string;
  education: string;
  accounts: string;
  mainWallet: string;
  bankAccount: string;
  salesAccount: string;
  cashRegister: string;
  aiGreeting: string;
  chip1: string;
  chip2: string;
  chip3: string;
  chip4: string;
  transferSuccess: string;
  swapAccounts: string;
  attachReceipt: string;
  refundHistory: string;
  viewAll: string;
  netFlow: string;
  allTime: string;
  week: string;
  month: string;
  year: string;
  flutterStudio: string;
  downloadFlutterProject: string;
  copyCode: string;
  copied: string;
  profile: string;
  username: string;
  bio: string;
  profilePicture: string;
  activityHistory: string;
  offlineMode: string;
  offlineStorage: string;
  pendingEdits: string;
  syncNow: string;
  saveProfile: string;
  profileUpdated: string;
  offlineNotice: string;
  exportHistory: string;
  exportCSV: string;
  exportPDF: string;
  backupToDrive: string;
  autoBackupDrive: string;
  googleDriveConnected: string;
  googleDriveDisconnected: string;
  signInWithGoogle: string;
  backupSuccess: string;
  backupFailed: string;
  exportingPDF: string;
  exportingCSV: string;
  billReminders: string;
  upcomingBills: string;
  loanInstallments: string;
  subscriptions: string;
  payNow: string;
  markAsPaid: string;
  addReminder: string;
  aiAutoDetect: string;
  aiDetectedReminders: string;
  dueDateLabel: string;
  daysLeft: string;
  overdueNotice: string;
  recurringFrequency: string;
  reminderAddedSuccess: string;
  billPaidSuccess: string;
}
