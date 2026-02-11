
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ChatResponse } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

/**
 * Sanitizes the response text to ensure it only contains the JSON object.
 * Sometimes models wrap JSON in markdown code blocks.
 */
const sanitizeJson = (text: string): string => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

export const analyzeCBCDocument = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "Analyze this Kenyan CBC (Competency-Based Curriculum) document. Identify what it is, where it is used, how to fill it out, and provide 3 best use tips. Ensure alignment with KICD standards. Return strictly valid JSON.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentName: { type: Type.STRING },
            category: { type: Type.STRING },
            usage: { type: Type.STRING },
            howToFill: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["documentName", "category", "usage", "howToFill", "tips"]
        }
      },
    });

    if (!response.text) throw new Error("Empty response from AI engine.");
    return JSON.parse(sanitizeJson(response.text));
  } catch (error: any) {
    console.error("Document analysis error:", error);
    throw new Error(error.message || "Failed to analyze document.");
  }
};

export const askCBCAssistant = async (query: string, isFullSearch: boolean = false): Promise<ChatResponse> => {
  try {
    const ai = getAI();
    // Using Pro for full research queries to ensure search tool stability
    const modelName = isFullSearch ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: query,
      config: {
        systemInstruction: `You are 'Lucy', an elite CBC research assistant representing Limuru Girls' Secondary School. 
        
        PROTOCOLS:
        1. KICD ALIGNMENT: Prioritize kicd.ac.ke data.
        2. SEARCH GROUNDING: Use Google Search for news, transition updates (Grade 9), and latest ministry circulars.
        3. TONE: Professional, encouraging, and patriotic ('IN FIDE VADE').
        
        Mention you are searching official databases if appropriate.`,
        tools: [{ googleSearch: {} }]
      }
    });

    if (!response.text) throw new Error("Lucy could not generate a response.");

    const sources: { uri: string; title: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title || 'Official Source' });
        }
      });
    }

    return {
      text: response.text,
      sources: sources.length > 0 ? sources : undefined
    };
  } catch (error: any) {
    console.error("Assistant error:", error);
    throw new Error(error.message || "Connection to KICD node failed.");
  }
};
