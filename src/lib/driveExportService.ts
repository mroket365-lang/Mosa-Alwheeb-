import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { jsPDF } from 'jspdf';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initDriveAuth = (
  onSuccess?: (user: User, token: string) => void,
  onFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user && cachedAccessToken) {
      if (onSuccess) onSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn && onFailure) onFailure();
    }
  });
};

export const signInWithGoogleDrive = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Access token not found in Google credential');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getCachedAccessToken = () => cachedAccessToken;

// --- CSV Export Service ---
export interface TransactionRecord {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  status: string;
  account: string;
}

export const sampleTransactions: TransactionRecord[] = [
  { id: 'TX-1001', title: 'حملة تسويق جوجل وإعلانات', category: 'تسويق', amount: -5500, type: 'expense', date: '2026-08-05', status: 'مكتمل', account: 'حساب المبيعات' },
  { id: 'TX-1002', title: 'حجز تذاكر طيران للشركاء', category: 'سفر', amount: -3200, type: 'expense', date: '2026-08-04', status: 'مكتمل', account: 'المحفظة الرئيسية' },
  { id: 'TX-1003', title: 'عائد مبيعات متجر الرياض', category: 'مبيعات', amount: 28000, type: 'income', date: '2026-08-03', status: 'مكتمل', account: 'الحساب البنكي' },
  { id: 'TX-1004', title: 'شراء أجهزة مكتبية ومستلزمات', category: 'تسوق', amount: -1240, type: 'expense', date: '2026-08-02', status: 'مكتمل', account: 'المحفظة الرئيسية' },
  { id: 'TX-1005', title: 'سداد فواتير كهرباء وانترنت', category: 'فواتير', amount: -890, type: 'expense', date: '2026-08-01', status: 'مكتمل', account: 'الحساب البنكي' },
  { id: 'TX-1006', title: 'عوائد استثمارية وتطوير', category: 'استثمار', amount: 12000, type: 'income', date: '2026-07-31', status: 'مكتمل', account: 'الحساب البنكي' },
  { id: 'TX-1007', title: 'رسوم شحن وتوصيل طلبات', category: 'شحن', amount: -420, type: 'expense', date: '2026-07-30', status: 'مكتمل', account: 'الصندوق' },
  { id: 'TX-1008', title: 'ضيافة واجتماع عملاء', category: 'طعام', amount: -380, type: 'expense', date: '2026-07-29', status: 'مكتمل', account: 'الصندوق' },
];

export const generateCSVBlob = (records: TransactionRecord[]): Blob => {
  const headers = ['ID', 'Title', 'Category', 'Amount ($)', 'Type', 'Date', 'Status', 'Account'];
  const rows = records.map(r => [
    r.id,
    `"${r.title.replace(/"/g, '""')}"`,
    `"${r.category}"`,
    r.amount,
    r.type,
    r.date,
    r.status,
    `"${r.account}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

export const downloadCSV = (records: TransactionRecord[], filename = 'Phoenix_Financial_Report_2026.csv') => {
  const blob = generateCSVBlob(records);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// --- PDF Export Service ---
export const generatePDFBlob = (records: TransactionRecord[]): Blob => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(37, 99, 235); // Phoenix Blue #2563EB
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('Phoenix Finance - Financial Report', 14, 20);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US')} | Confidential`, 14, 28);

  // Summary Metrics Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.text('Executive Financial Summary (August 2026)', 14, 48);

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 53, 182, 30, 3, 3, 'F');

  doc.setFontSize(11);
  doc.text('Total Balance: $213,231.25', 20, 63);
  doc.text('Monthly Income: $42,500.00', 20, 71);
  doc.text('Monthly Expenses: $18,200.00', 110, 63);
  doc.text('Net Flow: +$24,300.00', 110, 71);

  // Transactions Table Header
  doc.setFontSize(13);
  doc.text('Detailed Transaction History', 14, 96);

  doc.setFillColor(30, 41, 59);
  doc.rect(14, 102, 182, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('ID', 18, 107);
  doc.text('Date', 42, 107);
  doc.text('Category', 72, 107);
  doc.text('Type', 115, 107);
  doc.text('Status', 142, 107);
  doc.text('Amount ($)', 170, 107);

  // Table Rows
  let yPos = 116;
  doc.setTextColor(51, 65, 85);

  records.forEach((rec, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, yPos - 5, 182, 8, 'F');
    }

    doc.text(rec.id, 18, yPos);
    doc.text(rec.date, 42, yPos);
    doc.text(rec.category, 72, yPos);
    doc.text(rec.type.toUpperCase(), 115, yPos);
    doc.text(rec.status, 142, yPos);

    const isIncome = rec.amount > 0;
    doc.setTextColor(isIncome ? 16 : 220, isIncome ? 185 : 38, isIncome ? 129 : 38);
    doc.text(`${rec.amount > 0 ? '+' : ''}$${Math.abs(rec.amount).toLocaleString()}`, 170, yPos);
    doc.setTextColor(51, 65, 85);

    yPos += 9;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Phoenix Finance Inc. - Secure Backup Document. Saved to Google Drive automatically.', 14, 285);

  return doc.output('blob');
};

export const downloadPDF = (records: TransactionRecord[], filename = 'Phoenix_Financial_Report_2026.pdf') => {
  const blob = generatePDFBlob(records);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// --- Google Drive Direct Upload Service ---
export const uploadBlobToGoogleDrive = async ({
  accessToken,
  blob,
  filename,
  mimeType,
}: {
  accessToken: string;
  blob: Blob;
  filename: string;
  mimeType: string;
}): Promise<{ id: string; name: string; webViewLink?: string }> => {
  const metadata = {
    name: filename,
    mimeType: mimeType,
  };

  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', blob);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error('Google Drive Upload Failed:', response.status, errText);
    throw new Error(`Google Drive upload failed (${response.status}): ${errText}`);
  }

  const result = await response.json();
  return result;
};
