import { GoogleGenAI, Type } from "@google/genai";
import { HealthAnalysisResult, Crop, WeatherData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to encode file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        let encoded = reader.result as string;
        // Remove data url prefix
        encoded = encoded.split(',')[1]; 
        resolve(encoded);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeCropImage = async (
  imageBase64: string,
  cropDetails?: Partial<Crop>,
  weather?: Partial<WeatherData>
): Promise<HealthAnalysisResult> => {
  
  if (!apiKey) {
      throw new Error("API Key is missing.");
  }

  const prompt = `
    You are an expert agronomist and plant pathologist. Analyze this image of a crop.
    
    Context:
    - Crop Type: ${cropDetails?.type || 'Unknown'}
    - Soil Type: ${cropDetails?.soilType || 'Unknown'}
    - Current Weather: ${weather?.condition || 'Unknown'}, Temp: ${weather?.temp || 'Unknown'}C

    Identify any potential diseases, pests, or nutrient deficiencies. 
    Provide a confidence score (0-100).
    Suggest concrete treatment plans (organic and chemical).
    Suggest preventative measures.
    Suggest fertilizer adjustments based on the visual evidence.
    Suggest irrigation adjustments.

    Output MUST be strictly JSON strictly adhering to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            preventativeMeasures: { type: Type.ARRAY, items: { type: Type.STRING } },
            fertilizerRecommendation: { type: Type.STRING },
            irrigationAdvice: { type: Type.STRING }
          },
          required: ['diagnosis', 'confidence', 'symptoms', 'treatment', 'fertilizerRecommendation']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as HealthAnalysisResult;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback for demo purposes if API fails or quota exceeded
    return {
      diagnosis: "Analysis Failed / Network Error",
      confidence: 0,
      symptoms: ["Could not process image"],
      treatment: ["Please try again"],
      preventativeMeasures: [],
      fertilizerRecommendation: "N/A",
      irrigationAdvice: "N/A"
    };
  }
};

export const getGeneralAdvice = async (query: string, language: string): Promise<string> => {
    if (!apiKey) return "API Key missing.";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Answer the following farming question in ${language}: ${query}. Keep it concise and practical for a farmer.`,
        });
        return response.text || "No advice generated.";
    } catch (e) {
        return "Service unavailable.";
    }
}