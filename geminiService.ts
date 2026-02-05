
import { GoogleGenAI, Type } from "@google/genai";
import { Vehicle } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeBottlenecks(vehicles: Vehicle[]) {
  const model = 'gemini-3-flash-preview';
  
  // Prepare data for the prompt
  const dataSummary = vehicles.map(v => ({
    plate: v.licensePlate,
    op: v.operation,
    events: v.history.map(e => ({
      stage: e.stage,
      delay: e.delayReason,
      time: new Date(e.timestamp).toLocaleTimeString()
    }))
  }));

  const prompt = `Analiza los siguientes datos de movimientos de vehículos en una planta logística y determina posibles cuellos de botella y recomendaciones de eficiencia.
  Datos: ${JSON.stringify(dataSummary)}
  
  Responde en formato JSON con la siguiente estructura:
  {
    "insights": "Resumen ejecutivo del estado de la planta",
    "bottlenecks": ["Etapa crítica 1", "Etapa crítica 2"],
    "recommendations": ["Sugerencia 1", "Sugerencia 2"]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: { type: Type.STRING },
            bottlenecks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error analyzing with Gemini:", error);
    return null;
  }
}
