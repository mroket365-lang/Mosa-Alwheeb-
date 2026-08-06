export interface FlutterFile {
  path: string;
  filename: string;
  language: string;
  content: string;
}

export const flutterCodeFiles: FlutterFile[] = [
  {
    filename: 'pubspec.yaml',
    path: 'pubspec.yaml',
    language: 'yaml',
    content: `name: phoenix_finance
description: Phoenix Finance - Advanced Financial Accounting Mobile & Web App
version: 1.0.0+1
environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  intl: ^0.19.0
  google_fonts: ^6.1.0
  fl_chart: ^0.68.0
  provider: ^6.1.2
  http: ^1.2.0
  sqflite: ^2.3.0
  path: ^1.9.0
  shared_preferences: ^2.2.3

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`
  },
  {
    filename: 'main.dart',
    path: 'lib/main.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/dashboard_screen.dart';
import 'screens/transfers_screen.dart';
import 'screens/analytics_screen.dart';
import 'screens/ai_assistant_screen.dart';
import 'screens/profile_screen.dart';
import 'services/offline_storage_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await OfflineStorageService.instance.initDatabase();
  runApp(const PhoenixFinanceApp());
}

class PhoenixFinanceApp extends StatefulWidget {
  const PhoenixFinanceApp({super.key});

  @override
  State<PhoenixFinanceApp> createState() => _PhoenixFinanceAppState();
}

class _PhoenixFinanceAppState extends State<PhoenixFinanceApp> {
  bool isDarkMode = true;
  String currentLanguage = 'ar'; // Default Arabic (RTL)

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Phoenix Finance - فينكس المالي',
      debugShowCheckedModeBanner: false,
      themeMode: isDarkMode ? ThemeMode.dark : ThemeMode.light,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF8F9FA),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2563EB),
          brightness: Brightness.light,
        ),
        textTheme: GoogleFonts.cairoTextTheme(),
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF121212),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2563EB),
          brightness: Brightness.dark,
        ),
        textTheme: GoogleFonts.cairoTextTheme(ThemeData.dark().textTheme),
      ),
      home: Directionality(
        textDirection: currentLanguage == 'ar' ? TextDirection.rtl : TextDirection.ltr,
        child: MainNavigationScreen(
          isDarkMode: isDarkMode,
          currentLanguage: currentLanguage,
          onThemeToggle: () => setState(() => isDarkMode = !isDarkMode),
          onLanguageChange: (lang) => setState(() => currentLanguage = lang),
        ),
      ),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  final bool isDarkMode;
  final String currentLanguage;
  final VoidCallback onThemeToggle;
  final ValueChanged<String> onLanguageChange;

  const MainNavigationScreen({
    super.key,
    required this.isDarkMode,
    required this.currentLanguage,
    required this.onThemeToggle,
    required this.onLanguageChange,
  });

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;
  bool _isOffline = false;
  int _pendingEditsCount = 0;

  @override
  void initState() {
    super.initState();
    _loadOfflineStats();
  }

  void _loadOfflineStats() async {
    final pending = await OfflineStorageService.instance.getPendingSyncCount();
    setState(() {
      _pendingEditsCount = pending;
    });
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      const DashboardScreen(),
      const TransfersScreen(),
      const AnalyticsScreen(),
      const AiAssistantScreen(),
      ProfileScreen(
        onOfflineStateChanged: (isOffline) {
          setState(() {
            _isOffline = isOffline;
          });
          _loadOfflineStats();
        },
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: widget.isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF2563EB), Color(0xFF7C3AED)],
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.account_balance_wallet, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            Text(
              widget.currentLanguage == 'ar' ? 'فينكس المالي' : 'Phoenix Finance',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            if (_isOffline) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, py: 2),
                decoration: BoxDecoration(
                  color: Colors.amber.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.amber),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.wifi_off, color: Colors.amber, size: 12),
                    const SizedBox(width: 4),
                    Text(
                      'أوفلاين ($_pendingEditsCount)',
                      style: const TextStyle(color: Colors.amber, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(widget.isDarkMode ? Icons.wb_sunny : Icons.nightlight_round),
            onPressed: widget.onThemeToggle,
          ),
          PopupMenuButton<String>(
            initialValue: widget.currentLanguage,
            onSelected: widget.onLanguageChange,
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'ar', child: Text('العربية (AR)')),
              const PopupMenuItem(value: 'en', child: Text('English (EN)')),
              const PopupMenuItem(value: 'zh', child: Text('中文 (ZH)')),
            ],
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Row(
                children: [
                  Text(widget.currentLanguage.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.bold)),
                  const Icon(Icons.arrow_drop_down),
                ],
              ),
            ),
          ),
        ],
      ),
      body: screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() => _currentIndex = index);
          _loadOfflineStats();
        },
        selectedItemColor: const Color(0xFF2563EB),
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.dashboard_rounded),
            label: widget.currentLanguage == 'ar' ? 'الرئيسية' : 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.swap_horiz_rounded),
            label: widget.currentLanguage == 'ar' ? 'التحويلات' : 'Transfers',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.bar_chart_rounded),
            label: widget.currentLanguage == 'ar' ? 'التحليلات' : 'Analytics',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.smart_toy_rounded),
            label: widget.currentLanguage == 'ar' ? 'المساعد الذكي' : 'AI Assistant',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.person_rounded),
            label: widget.currentLanguage == 'ar' ? 'الملف الشخصي' : 'Profile',
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    filename: 'transaction_model.dart',
    path: 'lib/models/transaction_model.dart',
    language: 'dart',
    content: `class Account {
  final String id;
  final String name;
  final String icon;
  final double balance;
  final String accountNumber;

  Account({
    required this.id,
    required this.name,
    required this.icon,
    required this.balance,
    required this.accountNumber,
  });
}

class TransactionItem {
  final String id;
  final String title;
  final String category;
  final double amount;
  final DateTime date;
  final String status; // 'completed', 'pending', 'failed'
  final String accountId;
  final String icon;

  TransactionItem({
    required this.id,
    required this.title,
    required this.category,
    required this.amount,
    required this.date,
    required this.status,
    required this.accountId,
    required this.icon,
  });
}
`
  },
  {
    filename: 'dashboard_screen.dart',
    path: 'lib/screens/dashboard_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import '../models/transaction_model.dart';
import '../widgets/balance_card.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final List<Account> accounts = [
    Account(id: 'wallet', name: 'المحفظة الرئيسية', icon: '💳', balance: 48230.50, accountNumber: '•••• 8821'),
    Account(id: 'bank', name: 'الحساب البنكي', icon: '🏦', balance: 124800.00, accountNumber: '•••• 4920'),
    Account(id: 'sales', name: 'حساب المبيعات', icon: '📊', balance: 31450.75, accountNumber: '•••• 1102'),
    Account(id: 'cash', name: 'الخزينة النقدية', icon: '💵', balance: 8750.00, accountNumber: '•••• 0014'),
  ];

  double get totalBalance => accounts.fold(0, (sum, a) => sum + a.balance);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          BalanceCard(totalBalance: totalBalance, accounts: accounts),
          const SizedBox(height: 16),
          // Stats Row
          Row(
            children: [
              _buildStatTile(context, 'الإيرادات', '\$42,500.00', '📈', Colors.emerald),
              const SizedBox(width: 8),
              _buildStatTile(context, 'المصروفات', '\$18,200.00', '📉', Colors.amber),
              const SizedBox(width: 8),
              _buildStatTile(context, 'المدخرات', '\$24,300.00', '💎', Colors.purple),
            ],
          ),
          const SizedBox(height: 20),
          const Text(' المعاملات الأخيرة', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 12),
          _buildTransactionList(),
        ],
      ),
    );
  }

  Widget _buildStatTile(BuildContext context, String title, String amount, String emoji, Color color) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 20)),
            const SizedBox(height: 4),
            Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 2),
            FittedBox(
              child: Text(
                amount,
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: color),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionList() {
    final txs = [
      {'title': 'مشتريات إلكترونية', 'cat': 'تسوق', 'amount': -1240.0, 'status': 'مكتملة', 'icon': '🛍️'},
      {'title': 'إيداع راتب شهري', 'cat': 'رواتب', 'amount': 28000.0, 'status': 'مكتملة', 'icon': '💵'},
      {'title': 'فواتير الاتصالات', 'cat': 'فواتير', 'amount': -890.0, 'status': 'مكتملة', 'icon': '📄'},
      {'title': 'حجز تذاكر سفر', 'cat': 'سفر', 'amount': -3200.0, 'status': 'قيد الانتظار', 'icon': '✈️'},
      {'title': 'حملة تسويق إعلانية', 'cat': 'تسويق', 'amount': -5500.0, 'status': 'مكتملة', 'icon': '📢'},
    ];

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: txs.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final item = txs[index];
        final isIncome = (item['amount'] as double) > 0;

        return Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: isDark ? Colors.white10 : Colors.grey[100],
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(item['icon'] as String, style: const TextStyle(fontSize: 20)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item['title'] as String, style: const TextStyle(fontWeight: FontWeight.bold)),
                    Text(item['cat'] as String, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '\${isIncome ? "+" : ""}\${item['amount']}',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: isIncome ? Colors.green : Colors.red,
                    ),
                  ),
                  Text(item['status'] as String, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
`
  },
  {
    filename: 'transfers_screen.dart',
    path: 'lib/screens/transfers_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';

class TransfersScreen extends StatefulWidget {
  const TransfersScreen({super.key});

  @override
  State<TransfersScreen> createState() => _TransfersScreenState();
}

class _TransfersScreenState extends State<TransfersScreen> {
  String fromAccount = 'wallet';
  String toAccount = 'bank';
  final TextEditingController amountController = TextEditingController(text: '500');

  void _swap() {
    setState(() {
      final temp = fromAccount;
      fromAccount = toAccount;
      toAccount = temp;
    });
  }

  void _executeTransfer() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('تم تحويل المبلغ بنجاح وتحديث الرصيد!'),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.blue.withOpacity(0.2)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('⚡ تحويل سريع بين الحسابات', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 16),
                _buildAccountDropdown('من حساب', fromAccount, (val) => setState(() => fromAccount = val!)),
                Center(
                  child: IconButton(
                    icon: const Icon(Icons.swap_vert, color: Colors.blue, size: 28),
                    onPressed: _swap,
                  ),
                ),
                _buildAccountDropdown('إلى حساب', toAccount, (val) => setState(() => toAccount = val!)),
                const SizedBox(height: 16),
                TextField(
                  controller: amountController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'المبلغ ($)',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.attach_money),
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2563EB),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _executeTransfer,
                    child: const Text('إتمام التحويل الآن', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text('طلب استرداد الأموال (Refund Request)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 12),
          _buildRefundSection(isDark),
        ],
      ),
    );
  }

  Widget _buildAccountDropdown(String label, String value, ValueChanged<String?> onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        const SizedBox(height: 4),
        DropdownButtonFormField<String>(
          value: value,
          onChanged: onChanged,
          decoration: const InputDecoration(border: OutlineInputBorder()),
          items: const [
            DropdownMenuItem(value: 'wallet', child: Text('💳 المحفظة الرئيسية (\$48,230.50)')),
            DropdownMenuItem(value: 'bank', child: Text('🏦 الحساب البنكي (\$124,800.00)')),
            DropdownMenuItem(value: 'sales', child: Text('📊 حساب المبيعات (\$31,450.75)')),
            DropdownMenuItem(value: 'cash', child: Text('💵 الخزينة النقدية (\$8,750.00)')),
          ],
        ),
      ],
    );
  }

  Widget _buildRefundSection(bool isDark) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('المعاملات المؤهلة للاسترداد:', style: TextStyle(fontSize: 13, color: Colors.grey)),
          const SizedBox(height: 10),
          _buildRefundTile('📦 رسوم شحن طرد', '\$420.00', 'مؤهل للاسترداد', Colors.green),
          const SizedBox(height: 8),
          _buildRefundTile('✈️ حجز تذاكر سفر', '\$3,200.00', 'مؤهل للاسترداد', Colors.green),
        ],
      ),
    );
  }

  Widget _buildRefundTile(String title, String amount, String status, Color color) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
            Text(status, style: TextStyle(color: color, fontSize: 11)),
          ],
        ),
        TextButton(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('تم إرسال طلب استرداد لمبلغ \$amount بنجاح')),
            );
          },
          child: const Text('طلب استرداد'),
        ),
      ],
    );
  }
}
`
  },
  {
    filename: 'ai_assistant_screen.dart',
    path: 'lib/screens/ai_assistant_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';

class AiAssistantScreen extends StatefulWidget {
  const AiAssistantScreen({super.key});

  @override
  State<AiAssistantScreen> createState() => _AiAssistantScreenState();
}

class _AiAssistantScreenState extends State<AiAssistantScreen> {
  final List<Map<String, String>> messages = [
    {
      'sender': 'ai',
      'text': 'مرحباً! أنا مساعد Phoenix المالي الذكي. كيف يمكنني مساعدتك في تحليل مصروفاتك أو تحويل الأموال اليوم؟',
    }
  ];

  final TextEditingController _inputController = TextEditingController();

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;
    setState(() {
      messages.add({'sender': 'user', 'text': text});
    });
    _inputController.clear();

    // AI reply mock
    Future.delayed(const Duration(milliseconds: 600), () {
      setState(() {
        messages.add({
          'sender': 'ai',
          'text': '📊 تحليل ممتاز! رصيدك الكلي الحالي هو \$213,231.25 ونسبة التوفير هذا الشهر مرتفعة بـ 18.4%. هل تود تصدير تقرير تفصيلي؟',
        });
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(12),
          child: Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _buildChip('حلل مصروفات هذا الشهر'),
              _buildChip('ما الرصيد المتبقي في التسويق؟'),
              _buildChip('تصدير تقرير PDF'),
              _buildChip('أفضل توفير للأموال'),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: messages.length,
            itemBuilder: (context, index) {
              final msg = messages[index];
              final isUser = msg['sender'] == 'user';
              return Align(
                alignment: isUser ? Alignment.centerLeft : Alignment.centerRight,
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
                  constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                  decoration: BoxDecoration(
                    color: isUser
                        ? const Color(0xFF2563EB)
                        : (isDark ? const Color(0xFF2A2A2A) : Colors.white),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    msg['text']!,
                    style: TextStyle(color: isUser ? Colors.white : (isDark ? Colors.white : Colors.black)),
                  ),
                ),
              );
            },
          ),
        ),
        Container(
          padding: const EdgeInsets.all(12),
          color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _inputController,
                  decoration: const InputDecoration(
                    hintText: 'اسأل المساعد المالي الذكي...',
                    border: InputBorder.none,
                  ),
                  onSubmitted: _sendMessage,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.send, color: Color(0xFF2563EB)),
                onPressed: () => _sendMessage(_inputController.text),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildChip(String text) {
    return ActionChip(
      label: Text(text, style: const TextStyle(fontSize: 11)),
      onPressed: () => _sendMessage(text),
    );
  }
}
`
  },
  {
    filename: 'user_profile.dart',
    path: 'lib/models/user_profile.dart',
    language: 'dart',
    content: `class UserProfile {
  final String username;
  final String fullName;
  final String email;
  final String bio;
  final String avatarUrl;
  final String role;
  final bool isOffline;
  final int pendingSyncCount;
  final String lastSyncedAt;

  UserProfile({
    required this.username,
    required this.fullName,
    required this.email,
    required this.bio,
    required this.avatarUrl,
    required this.role,
    this.isOffline = false,
    this.pendingSyncCount = 0,
    required this.lastSyncedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'username': username,
      'fullName': fullName,
      'email': email,
      'bio': bio,
      'avatarUrl': avatarUrl,
      'role': role,
      'isOffline': isOffline ? 1 : 0,
      'pendingSyncCount': pendingSyncCount,
      'lastSyncedAt': lastSyncedAt,
    };
  }

  factory UserProfile.fromMap(Map<String, dynamic> map) {
    return UserProfile(
      username: map['username'] ?? 'ali_ahmed_cfo',
      fullName: map['fullName'] ?? 'علي أحمد',
      email: map['email'] ?? 'ali.ahmed@phoenix.com',
      bio: map['bio'] ?? '',
      avatarUrl: map['avatarUrl'] ?? '👨‍💼',
      role: map['role'] ?? 'Chief Financial Officer',
      isOffline: (map['isOffline'] ?? 0) == 1,
      pendingSyncCount: map['pendingSyncCount'] ?? 0,
      lastSyncedAt: map['lastSyncedAt'] ?? '',
    );
  }

  UserProfile copyWith({
    String? username,
    String? fullName,
    String? email,
    String? bio,
    String? avatarUrl,
    String? role,
    bool? isOffline,
    int? pendingSyncCount,
    String? lastSyncedAt,
  }) {
    return UserProfile(
      username: username ?? this.username,
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      bio: bio ?? this.bio,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      role: role ?? this.role,
      isOffline: isOffline ?? this.isOffline,
      pendingSyncCount: pendingSyncCount ?? this.pendingSyncCount,
      lastSyncedAt: lastSyncedAt ?? this.lastSyncedAt,
    );
  }
}
`
  },
  {
    filename: 'activity_log.dart',
    path: 'lib/models/activity_log.dart',
    language: 'dart',
    content: `class ActivityLog {
  final String id;
  final String title;
  final String description;
  final String timestamp;
  final String type; // 'transfer' | 'refund' | 'edit' | 'offline_sync' | 'profile'
  final String icon;
  final bool isOfflineQueued;

  ActivityLog({
    required this.id,
    required this.title,
    required this.description,
    required this.timestamp,
    required this.type,
    required this.icon,
    this.isOfflineQueued = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'timestamp': timestamp,
      'type': type,
      'icon': icon,
      'isOfflineQueued': isOfflineQueued ? 1 : 0,
    };
  }

  factory ActivityLog.fromMap(Map<String, dynamic> map) {
    return ActivityLog(
      id: map['id'],
      title: map['title'],
      description: map['description'],
      timestamp: map['timestamp'],
      type: map['type'],
      icon: map['icon'],
      isOfflineQueued: (map['isOfflineQueued'] ?? 0) == 1,
    );
  }
}
`
  },
  {
    filename: 'offline_storage_service.dart',
    path: 'lib/services/offline_storage_service.dart',
    language: 'dart',
    content: `import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/user_profile.dart';
import '../models/activity_log.dart';

class OfflineStorageService {
  static final OfflineStorageService instance = OfflineStorageService._init();
  static Database? _database;

  OfflineStorageService._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await initDatabase();
    return _database!;
  }

  Future<Database> initDatabase() async {
    final dbPath = await getDatabasesPath();
    final pathString = join(dbPath, 'phoenix_offline_cache.db');

    return await openDatabase(
      pathString,
      version: 1,
      onCreate: (db, version) async {
        // User Profile table
        await db.execute('''
          CREATE TABLE user_profile (
            id INTEGER PRIMARY KEY DEFAULT 1,
            username TEXT,
            fullName TEXT,
            email TEXT,
            bio TEXT,
            avatarUrl TEXT,
            role TEXT,
            isOffline INTEGER,
            pendingSyncCount INTEGER,
            lastSyncedAt TEXT
          )
        ''');

        // Activity Logs table
        await db.execute('''
          CREATE TABLE activity_logs (
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            timestamp TEXT,
            type TEXT,
            icon TEXT,
            isOfflineQueued INTEGER
          )
        ''');

        // Offline Edits Sync Queue table
        await db.execute('''
          CREATE TABLE sync_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT,
            payload TEXT,
            createdAt TEXT
          )
        ''');

        // Insert initial mock data
        await db.insert('user_profile', {
          'id': 1,
          'username': 'ali_ahmed_cfo',
          'fullName': 'علي أحمد',
          'email': 'ali.ahmed@phoenix.com',
          'bio': 'المدير المالي لشركة Phoenix. مسؤول عن الميزانيات والتحويلات.',
          'avatarUrl': '👨‍💼',
          'role': 'Chief Financial Officer',
          'isOffline': 0,
          'pendingSyncCount': 2,
          'lastSyncedAt': '2026-08-05 14:30',
        });

        await db.insert('activity_logs', {
          'id': '1',
          'title': 'تحديث بيانات الملف الشخصي',
          'description': 'تم تعديل اسم المستخدم والصورة الشخصية محلياً',
          'timestamp': 'منذ 15 دقيقة',
          'type': 'profile',
          'icon': '👤',
          'isOfflineQueued': 0,
        });
      },
    );
  }

  Future<UserProfile> getUserProfile() async {
    final db = await instance.database;
    final result = await db.query('user_profile', where: 'id = ?', whereArgs: [1]);
    if (result.isNotEmpty) {
      return UserProfile.fromMap(result.first);
    }
    return UserProfile(
      username: 'ali_ahmed_cfo',
      fullName: 'علي أحمد',
      email: 'ali.ahmed@phoenix.com',
      bio: 'المدير المالي لشركة Phoenix',
      avatarUrl: '👨‍💼',
      role: 'Chief Financial Officer',
      lastSyncedAt: '2026-08-05 14:30',
    );
  }

  Future<void> saveUserProfile(UserProfile profile) async {
    final db = await instance.database;
    await db.update('user_profile', profile.toMap(), where: 'id = ?', whereArgs: [1]);
  }

  Future<List<ActivityLog>> getActivityLogs() async {
    final db = await instance.database;
    final maps = await db.query('activity_logs', orderBy: 'id DESC');
    return maps.map((m) => ActivityLog.fromMap(m)).toList();
  }

  Future<void> addActivityLog(ActivityLog log) async {
    final db = await instance.database;
    await db.insert('activity_logs', log.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<void> enqueueOfflineSync(String action, String payload) async {
    final db = await instance.database;
    await db.insert('sync_queue', {
      'action': action,
      'payload': payload,
      'createdAt': DateTime.now().toIso8601String(),
    });
  }

  Future<int> getPendingSyncCount() async {
    final db = await instance.database;
    final result = await db.rawQuery('SELECT COUNT(*) as count FROM sync_queue');
    return Sqflite.firstIntValue(result) ?? 0;
  }

  Future<void> syncPendingEdits() async {
    final db = await instance.database;
    await db.delete('sync_queue');
  }
}
`
  },
  {
    filename: 'profile_screen.dart',
    path: 'lib/screens/profile_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import '../models/user_profile.dart';
import '../models/activity_log.dart';
import '../services/offline_storage_service.dart';

class ProfileScreen extends StatefulWidget {
  final ValueChanged<bool>? onOfflineStateChanged;

  const ProfileScreen({super.key, this.onOfflineStateChanged});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  UserProfile? _profile;
  List<ActivityLog> _logs = [];
  bool _isLoading = true;

  final _usernameController = TextEditingController();
  final _fullNameController = TextEditingController();
  final _bioController = TextEditingController();
  String _selectedAvatar = '👨‍💼';

  final List<String> _avatarPresets = ['👨‍💼', '👩‍💼', '🧑‍بي', '🦁', '🚀'];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final profile = await OfflineStorageService.instance.getUserProfile();
    final logs = await OfflineStorageService.instance.getActivityLogs();
    
    setState(() {
      _profile = profile;
      _logs = logs;
      _usernameController.text = profile.username;
      _fullNameController.text = profile.fullName;
      _bioController.text = profile.bio;
      _selectedAvatar = profile.avatarUrl;
      _isLoading = false;
    });
  }

  Future<void> _saveProfile() async {
    if (_profile == null) return;

    final updated = _profile!.copyWith(
      username: _usernameController.text,
      fullName: _fullNameController.text,
      bio: _bioController.text,
      avatarUrl: _selectedAvatar,
    );

    await OfflineStorageService.instance.saveUserProfile(updated);

    final newLog = ActivityLog(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: 'تحديث بيانات الملف الشخصي',
      description: 'تم حفظ التعديلات محلياً في SQLite',
      timestamp: 'الآن',
      type: 'profile',
      icon: '👤',
      isOfflineQueued: updated.isOffline,
    );

    await OfflineStorageService.instance.addActivityLog(newLog);

    if (updated.isOffline) {
      await OfflineStorageService.instance.enqueueOfflineSync('PROFILE_UPDATE', updated.username);
    }

    _loadData();

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('تم حفظ الملف الشخصي محلياً بنجاح!'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  Future<void> _toggleOfflineMode() async {
    if (_profile == null) return;
    final nextState = !_profile!.isOffline;
    final updated = _profile!.copyWith(isOffline: nextState);
    
    await OfflineStorageService.instance.saveUserProfile(updated);
    
    if (widget.onOfflineStateChanged != null) {
      widget.onOfflineStateChanged!(nextState);
    }

    _loadData();
  }

  Future<void> _syncOfflineData() async {
    await OfflineStorageService.instance.syncPendingEdits();
    final newLog = ActivityLog(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: 'مزامنة بيانات SQLite مع الخادم',
      description: 'تم رفع التعديلات المعلقة بنجاح',
      timestamp: 'الآن',
      type: 'offline_sync',
      icon: '🔄',
    );
    await OfflineStorageService.instance.addActivityLog(newLog);
    _loadData();

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('تمت المزامنة بنجاح!'),
          backgroundColor: Colors.blue,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          
          // Offline Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _profile!.isOffline ? Colors.amber.withOpacity(0.15) : const Color(0xFF2563EB).withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: _profile!.isOffline ? Colors.amber : const Color(0xFF2563EB).withOpacity(0.3),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  _profile!.isOffline ? Icons.wifi_off_rounded : Icons.wifi_rounded,
                  color: _profile!.isOffline ? Colors.amber : const Color(0xFF2563EB),
                  size: 28,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _profile!.isOffline ? 'وضع عدم الاتصال (Offline)' : 'تخزين أوفلاين SQLite جاهز',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(
                        _profile!.isOffline
                            ? 'يتم حفظ كافة التعديلات محلياً وتجهيزها للمزامنة.'
                            : 'يمكنك القراءة والتعديل حتى في حالة انقطاع الإنترنت.',
                        style: TextStyle(fontSize: 11, color: isDark ? Colors.grey[400] : Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
                Switch(
                  value: _profile!.isOffline,
                  activeColor: Colors.amber,
                  onChanged: (val) => _toggleOfflineMode(),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // User Profile Card
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
            color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: const Color(0xFF2563EB).withOpacity(0.2),
                    child: Text(_selectedAvatar, style: const TextStyle(fontSize: 40)),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _fullNameController.text,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  Text(
                    '@\${_usernameController.text}',
                    style: const TextStyle(color: Color(0xFF2563EB), fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),

                  // Avatar Picker
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: _avatarPresets.map((emoji) {
                      final isSelected = _selectedAvatar == emoji;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedAvatar = emoji),
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: isSelected ? const Color(0xFF2563EB).withOpacity(0.2) : Colors.transparent,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSelected ? const Color(0xFF2563EB) : Colors.transparent,
                            ),
                          ),
                          child: Text(emoji, style: const TextStyle(fontSize: 22)),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 16),

                  TextField(
                    controller: _fullNameController,
                    decoration: const InputDecoration(
                      labelText: 'الاسم الكامل',
                      border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(16))),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _usernameController,
                    decoration: const InputDecoration(
                      labelText: 'اسم المستخدم',
                      border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(16))),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _bioController,
                    maxLines: 2,
                    decoration: const InputDecoration(
                      labelText: 'النبذة التعريفية (Bio)',
                      border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(16))),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2563EB),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: _saveProfile,
                      icon: const Icon(Icons.save_rounded, color: Colors.white),
                      label: const Text('حفظ الملف الشخصي', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Activity Logs
          const Text(
            'سجل النشاطات والتعديلات الأخيرة',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 12),

          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _logs.length,
            itemBuilder: (context, index) {
              final log = _logs[index];
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    Text(log.icon, style: const TextStyle(fontSize: 22)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(log.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          Text(log.description, style: TextStyle(fontSize: 11, color: isDark ? Colors.grey[400] : Colors.grey[600])),
                        ],
                      ),
                    ),
                    Text(log.timestamp, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                  ],
                ),
              );
            },
          ),

        ],
      ),
    );
  }
}
`
  }
];

