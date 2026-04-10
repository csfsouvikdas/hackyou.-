import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Load API Key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn("⚠️ Gemini API key missing. Add VITE_GEMINI_API_KEY in .env");
}

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ FIXED MODEL (works with v1beta)
const MODEL_NAME = "models/gemini-1.5-flash";

// ✅ Create model once
const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
});

// -----------------------------
// 📊 DATA STORY GENERATION
// -----------------------------
export async function generateDataStory(context: string) {
  try {
    if (!apiKey) {
      return "Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your env variables.";
    }

    const prompt = `
You are a data scientist. Analyze the following summary of a CSV dataset and provide 
3-5 high-level insights, key trends, or interesting findings. 
Keep it professional, concise, and engaging.

Dataset Summary:
${context}
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    return result.response.text();
  } catch (error) {
    console.error("❌ generateDataStory failed:", error);
    return "AI Insights currently unavailable. Please check API setup.";
  }
}

// -----------------------------
// 📈 CHART SUMMARY
// -----------------------------
export async function generateChartSummary(
  chartTitle: string,
  dataSnippet: string
) {
  try {
    if (!apiKey) return "API Key missing";

    const prompt = `
Analyze this chart data and provide a 2-sentence summary of what it shows.

Chart: ${chartTitle}
Data: ${dataSnippet}

Keep it very concise and professional.
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    return result.response.text();
  } catch (error) {
    console.error("❌ generateChartSummary failed:", error);
    return "Could not generate summary.";
  }
}