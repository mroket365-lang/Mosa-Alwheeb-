import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Assistant Endpoint using Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, language = "ar", context } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are Phoenix AI, a world-class smart financial advisor built into Phoenix Finance (تطبيق فينكس المالي).
Answer concisely, helpful, professionally in the user requested language (${language}).
Context of user finances:
- Total Balance: $213,231.25
- Accounts: Main Wallet ($48,230.50), Bank Account ($124,800.00), Sales Account ($31,450.75), Cash Register ($8,750.00).
- Recent Expenses: Shopping ($1,240), Bills ($890), Travel ($3,200), Marketing ($5,500), Shipping ($420), Food ($380).
- Income: Salary ($28,000), Investment ($12,000).
Use formatting like bullet points or bold text where appropriate. Keep answers practical and actionable.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `${systemPrompt}\n\nUser Question: ${message}`,
        });

        const reply = response.text || "أعتذر، حدثت مشكلة في معالجة طلبك.";
        return res.json({ reply });
      } else {
        // High quality rule-based responses if Gemini key is not configured yet
        let reply = "";
        const lower = message.toLowerCase();

        if (message.includes("مصروفات") || message.includes("expenses") || message.includes("تحليل") || message.includes("chip1")) {
          reply = language === "ar"
            ? "📊 **تحليل المصروفات لهذا الشهر:**\n\n• **إجمالي المصروفات:** $18,200.00\n• **التسويق:** $5,500 (30.2%)\n• **السفر والإقامة:** $3,200 (17.5%)\n• **التسوق:** $1,240 (6.8%)\n• **الفواتير والخدمات:** $890 (4.8%)\n\n💡 **نصيحة ذكية:** مصروفات التسويق والسفر تمثل 47.7% من إجمالي مصروفاتك. يمكنك خفض التكاليف بنسبة 12% عبر دمج الاشتراكات الإعلانية وحجز الرحلات المسبق."
            : "📊 **Monthly Expenses Analysis:**\n\n• **Total Expenses:** $18,200.00\n• **Marketing:** $5,500 (30.2%)\n• **Travel:** $3,200 (17.5%)\n• **Shopping:** $1,240 (6.8%)\n• **Bills:** $890 (4.8%)\n\n💡 **Recommendation:** Marketing and Travel account for 47.7% of total spend. Consider consolidating marketing channels to save ~12%.";
        } else if (message.includes("تسويق") || message.includes("marketing") || message.includes("chip2")) {
          reply = language === "ar"
            ? "📢 **حساب التسويق (Sales/Marketing Account):**\n\n• **الرصيد المالي المتبقي:** $31,450.75\n• **المصروفات الأخيرة:** $5,500 لحملة الإعلانات الأخيرة\n• **الحالة:** ممتاز - يغطي ميزانية الحملات القادمة بزيادة 35%."
            : "📢 **Marketing Account Balance:**\n\n• **Remaining Balance:** $31,450.75\n• **Recent Spend:** $5,500 for Ad campaign\n• **Status:** Healthy - covers upcoming campaign targets with +35% buffer.";
        } else if (message.includes("PDF") || message.includes("تقرير") || message.includes("chip3")) {
          reply = language === "ar"
            ? "📄 **جاهز للتصدير!** تم إعداد تقرير القوائم المالية الشامل لشهر أغسطس 2026. يتضمن:\n• صافي التدفق النقدي ($24,300)\n• كشف جميع الحسابات الأربعة\n• تفاصيل طلبات الاسترداد والتحويلات.\n\nيمكنك النقر على زر 'تصدير PDF' في الأعلى لحفظ التقرير فوراً."
            : "📄 **Report Ready!** Financial summary report generated for August 2026 including Net Cash Flow ($24,300), 4 account ledgers, and transfer histories. Click 'Export PDF' to download.";
        } else if (message.includes("توفير") || message.includes("savings") || message.includes("chip4")) {
          reply = language === "ar"
            ? "💎 **أفضل 3 نصائح مخصصة لتوفير الأموال:**\n1. تحويل 15% من الدخل تلقائياً إلى 'حساب الاستثمار البنكي'.\n2. مراجعة الاشتراكات الشهرية في الفواتير الصغرى.\n3. تفعيل التنبيه عند تجاوز مصروفات التسوق لمبلغ $1,000 شهرياً."
            : "💎 **Top 3 Money Saving Tips:**\n1. Auto-transfer 15% of income to Bank Savings.\n2. Review micro-subscriptions under Bills.\n3. Set custom alert when Shopping exceeds $1,000/mo.";
        } else {
          reply = language === "ar"
            ? `أهلاً بك! رصيدك الإجمالي الحالي هو **$213,231.25** مقسمة على 4 حسابات. كيف يمكنني مساعدتك في إدارة التحويلات، تحليل الفئات، أو إعداد طلبات الاسترداد اليوم؟`
            : `Hello! Your current total balance is **$213,231.25** across 4 active accounts. How can I assist with transfers, analytics, or refund requests today?`;
        }

        return res.json({ reply });
      }
    } catch (err: any) {
      console.error("Error in /api/chat:", err);
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  });

  // Vite middleware in dev or static serving in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Phoenix Finance Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
