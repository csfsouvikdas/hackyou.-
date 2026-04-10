import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateDataStory(context: string) {
  if (!apiKey) {
    return "Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your env variables.";
  }

  const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `
        You are a data scientist. Analyze the following summary of a CSV dataset and provide 
        3-5 high-level insights, key trends, or interesting findings. 
        Keep it professional, concise, and engaging.
        
        Dataset Summary:
        ${context}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.warn(`Gemini model ${modelName} failed, trying next...`, error);
      lastError = error;
    }
  }

  console.error("All Gemini models failed:", lastError);
  return "Failed to generate AI insights. Please verify your API key and quota.";
}
