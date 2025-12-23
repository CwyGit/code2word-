
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function enhanceCode(code: string, language: string, instruction: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Task: ${instruction}\nLanguage: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``,
      config: {
        systemInstruction: "You are an expert software engineer. Your goal is to rewrite, optimize, or explain code based on user instructions. Always return ONLY the raw code without any markdown formatting blocks unless specifically asked for an explanation. If you refactor, preserve the logic but improve readability and best practices.",
        temperature: 0.2,
      },
    });

    // Clean up the response to remove any markdown wrappers if the model included them
    let result = response.text || '';
    result = result.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '');
    return result.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
