import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export default async function getAIResponse(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}`,
      config: {
        thinkingConfig: {
          thinkingBudget: -1, // Dynamic thinking
        },
      }
    });    
    return response.text;
  } catch (error) {
    throw error;
  }
}