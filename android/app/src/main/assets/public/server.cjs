var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, language = "ar", context } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
        const ai = new import_genai.GoogleGenAI({ apiKey });
        const systemPrompt = `You are Phoenix AI, a world-class smart financial advisor built into Phoenix Finance (\u062A\u0637\u0628\u064A\u0642 \u0641\u064A\u0646\u0643\u0633 \u0627\u0644\u0645\u0627\u0644\u064A).
Answer concisely, helpful, professionally in the user requested language (${language}).
Context of user finances:
- Total Balance: $213,231.25
- Accounts: Main Wallet ($48,230.50), Bank Account ($124,800.00), Sales Account ($31,450.75), Cash Register ($8,750.00).
- Recent Expenses: Shopping ($1,240), Bills ($890), Travel ($3,200), Marketing ($5,500), Shipping ($420), Food ($380).
- Income: Salary ($28,000), Investment ($12,000).
Use formatting like bullet points or bold text where appropriate. Keep answers practical and actionable.`;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `${systemPrompt}

User Question: ${message}`
        });
        const reply = response.text || "\u0623\u0639\u062A\u0630\u0631\u060C \u062D\u062F\u062B\u062A \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0645\u0639\u0627\u0644\u062C\u0629 \u0637\u0644\u0628\u0643.";
        return res.json({ reply });
      } else {
        let reply = "";
        const lower = message.toLowerCase();
        if (message.includes("\u0645\u0635\u0631\u0648\u0641\u0627\u062A") || message.includes("expenses") || message.includes("\u062A\u062D\u0644\u064A\u0644") || message.includes("chip1")) {
          reply = language === "ar" ? "\u{1F4CA} **\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A \u0644\u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631:**\n\n\u2022 **\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A:** $18,200.00\n\u2022 **\u0627\u0644\u062A\u0633\u0648\u064A\u0642:** $5,500 (30.2%)\n\u2022 **\u0627\u0644\u0633\u0641\u0631 \u0648\u0627\u0644\u0625\u0642\u0627\u0645\u0629:** $3,200 (17.5%)\n\u2022 **\u0627\u0644\u062A\u0633\u0648\u0642:** $1,240 (6.8%)\n\u2022 **\u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631 \u0648\u0627\u0644\u062E\u062F\u0645\u0627\u062A:** $890 (4.8%)\n\n\u{1F4A1} **\u0646\u0635\u064A\u062D\u0629 \u0630\u0643\u064A\u0629:** \u0645\u0635\u0631\u0648\u0641\u0627\u062A \u0627\u0644\u062A\u0633\u0648\u064A\u0642 \u0648\u0627\u0644\u0633\u0641\u0631 \u062A\u0645\u062B\u0644 47.7% \u0645\u0646 \u0625\u062C\u0645\u0627\u0644\u064A \u0645\u0635\u0631\u0648\u0641\u0627\u062A\u0643. \u064A\u0645\u0643\u0646\u0643 \u062E\u0641\u0636 \u0627\u0644\u062A\u0643\u0627\u0644\u064A\u0641 \u0628\u0646\u0633\u0628\u0629 12% \u0639\u0628\u0631 \u062F\u0645\u062C \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643\u0627\u062A \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u064A\u0629 \u0648\u062D\u062C\u0632 \u0627\u0644\u0631\u062D\u0644\u0627\u062A \u0627\u0644\u0645\u0633\u0628\u0642." : "\u{1F4CA} **Monthly Expenses Analysis:**\n\n\u2022 **Total Expenses:** $18,200.00\n\u2022 **Marketing:** $5,500 (30.2%)\n\u2022 **Travel:** $3,200 (17.5%)\n\u2022 **Shopping:** $1,240 (6.8%)\n\u2022 **Bills:** $890 (4.8%)\n\n\u{1F4A1} **Recommendation:** Marketing and Travel account for 47.7% of total spend. Consider consolidating marketing channels to save ~12%.";
        } else if (message.includes("\u062A\u0633\u0648\u064A\u0642") || message.includes("marketing") || message.includes("chip2")) {
          reply = language === "ar" ? "\u{1F4E2} **\u062D\u0633\u0627\u0628 \u0627\u0644\u062A\u0633\u0648\u064A\u0642 (Sales/Marketing Account):**\n\n\u2022 **\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u062A\u0628\u0642\u064A:** $31,450.75\n\u2022 **\u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A \u0627\u0644\u0623\u062E\u064A\u0631\u0629:** $5,500 \u0644\u062D\u0645\u0644\u0629 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062A \u0627\u0644\u0623\u062E\u064A\u0631\u0629\n\u2022 **\u0627\u0644\u062D\u0627\u0644\u0629:** \u0645\u0645\u062A\u0627\u0632 - \u064A\u063A\u0637\u064A \u0645\u064A\u0632\u0627\u0646\u064A\u0629 \u0627\u0644\u062D\u0645\u0644\u0627\u062A \u0627\u0644\u0642\u0627\u062F\u0645\u0629 \u0628\u0632\u064A\u0627\u062F\u0629 35%." : "\u{1F4E2} **Marketing Account Balance:**\n\n\u2022 **Remaining Balance:** $31,450.75\n\u2022 **Recent Spend:** $5,500 for Ad campaign\n\u2022 **Status:** Healthy - covers upcoming campaign targets with +35% buffer.";
        } else if (message.includes("PDF") || message.includes("\u062A\u0642\u0631\u064A\u0631") || message.includes("chip3")) {
          reply = language === "ar" ? "\u{1F4C4} **\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0635\u062F\u064A\u0631!** \u062A\u0645 \u0625\u0639\u062F\u0627\u062F \u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0627\u0644\u0634\u0627\u0645\u0644 \u0644\u0634\u0647\u0631 \u0623\u063A\u0633\u0637\u0633 2026. \u064A\u062A\u0636\u0645\u0646:\n\u2022 \u0635\u0627\u0641\u064A \u0627\u0644\u062A\u062F\u0641\u0642 \u0627\u0644\u0646\u0642\u062F\u064A ($24,300)\n\u2022 \u0643\u0634\u0641 \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0623\u0631\u0628\u0639\u0629\n\u2022 \u062A\u0641\u0627\u0635\u064A\u0644 \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0648\u0627\u0644\u062A\u062D\u0648\u064A\u0644\u0627\u062A.\n\n\u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u0646\u0642\u0631 \u0639\u0644\u0649 \u0632\u0631 '\u062A\u0635\u062F\u064A\u0631 PDF' \u0641\u064A \u0627\u0644\u0623\u0639\u0644\u0649 \u0644\u062D\u0641\u0638 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0641\u0648\u0631\u0627\u064B." : "\u{1F4C4} **Report Ready!** Financial summary report generated for August 2026 including Net Cash Flow ($24,300), 4 account ledgers, and transfer histories. Click 'Export PDF' to download.";
        } else if (message.includes("\u062A\u0648\u0641\u064A\u0631") || message.includes("savings") || message.includes("chip4")) {
          reply = language === "ar" ? "\u{1F48E} **\u0623\u0641\u0636\u0644 3 \u0646\u0635\u0627\u0626\u062D \u0645\u062E\u0635\u0635\u0629 \u0644\u062A\u0648\u0641\u064A\u0631 \u0627\u0644\u0623\u0645\u0648\u0627\u0644:**\n1. \u062A\u062D\u0648\u064A\u0644 15% \u0645\u0646 \u0627\u0644\u062F\u062E\u0644 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0625\u0644\u0649 '\u062D\u0633\u0627\u0628 \u0627\u0644\u0627\u0633\u062A\u062B\u0645\u0627\u0631 \u0627\u0644\u0628\u0646\u0643\u064A'.\n2. \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643\u0627\u062A \u0627\u0644\u0634\u0647\u0631\u064A\u0629 \u0641\u064A \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631 \u0627\u0644\u0635\u063A\u0631\u0649.\n3. \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u0646\u0628\u064A\u0647 \u0639\u0646\u062F \u062A\u062C\u0627\u0648\u0632 \u0645\u0635\u0631\u0648\u0641\u0627\u062A \u0627\u0644\u062A\u0633\u0648\u0642 \u0644\u0645\u0628\u0644\u063A $1,000 \u0634\u0647\u0631\u064A\u0627\u064B." : "\u{1F48E} **Top 3 Money Saving Tips:**\n1. Auto-transfer 15% of income to Bank Savings.\n2. Review micro-subscriptions under Bills.\n3. Set custom alert when Shopping exceeds $1,000/mo.";
        } else {
          reply = language === "ar" ? `\u0623\u0647\u0644\u0627\u064B \u0628\u0643! \u0631\u0635\u064A\u062F\u0643 \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062D\u0627\u0644\u064A \u0647\u0648 **$213,231.25** \u0645\u0642\u0633\u0645\u0629 \u0639\u0644\u0649 4 \u062D\u0633\u0627\u0628\u0627\u062A. \u0643\u064A\u0641 \u064A\u0645\u0643\u0646\u0646\u064A \u0645\u0633\u0627\u0639\u062F\u062A\u0643 \u0641\u064A \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062A\u062D\u0648\u064A\u0644\u0627\u062A\u060C \u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0641\u0626\u0627\u062A\u060C \u0623\u0648 \u0625\u0639\u062F\u0627\u062F \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0627\u0644\u064A\u0648\u0645\u061F` : `Hello! Your current total balance is **$213,231.25** across 4 active accounts. How can I assist with transfers, analytics, or refund requests today?`;
        }
        return res.json({ reply });
      }
    } catch (err) {
      console.error("Error in /api/chat:", err);
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Phoenix Finance Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
