
import { GoogleGenAI, Type } from "@google/genai";
import { EmailTone, EmailLength, GeneratedEmail, EnhancementResult, ABTestResult } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const parseAIResponse = (text: string | undefined) => {
  if (!text) return {};
  const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Failed to parse AI JSON:", e);
    return {};
  }
};

export const generateEmail = async (params: {
  recipient: string;
  purpose: string;
  keyPoints: string;
  tone: EmailTone;
  length: EmailLength;
}): Promise<GeneratedEmail> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Act as a world-class executive communications expert. 
      Compose a highly effective email using professional copywriting frameworks (like PAS or AIDA where appropriate).
      
      Details:
      - Recipient Persona: ${params.recipient}
      - Core Objective: ${params.purpose}
      - Essential Context: ${params.keyPoints}
      - Targeted Tone: ${params.tone}
      - Format: ${params.length}

      Requirements:
      1. Subject Lines: Provide 3 high-open-rate options (1 direct, 1 curiosity-based, 1 benefit-driven).
      2. Salutation: Dynamic based on tone.
      3. Body Content: Structured for readability with clear narrative flow.
      4. Closing: Strong call-to-action or professional sign-off.
      5. Strategy: Brief 1-sentence timing advice.
      
      OUTPUT ONLY RAW JSON.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subjectLines: { type: Type.ARRAY, items: { type: Type.STRING } },
          salutation: { type: Type.STRING },
          body: { type: Type.STRING },
          closing: { type: Type.STRING },
          suggestedFollowUp: { type: Type.STRING }
        },
        required: ["subjectLines", "salutation", "body", "closing"]
      }
    }
  });

  return parseAIResponse(response.text);
};

export const generateABTest = async (params: {
  recipient: string;
  purpose: string;
  keyPoints: string;
  outcome: string;
}): Promise<ABTestResult> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `
      Generate an email A/B split test for high-stakes conversion.
      Context: ${params.recipient} wanting ${params.outcome}.
      Constraints: ${params.keyPoints}.

      Strategy A: Focus on "Negative Framing/Loss Aversion" (The cost of inaction).
      Strategy B: Focus on "Positive Framing/Social Proof" (The benefit of action).

      Provide:
      - Distinct psychological strategies.
      - Optimized subject lines.
      - High-impact bodies.
      - Specific success tracking metric.
      
      OUTPUT ONLY RAW JSON.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          versionA: {
            type: Type.OBJECT,
            properties: {
              strategy: { type: Type.STRING },
              subject: { type: Type.STRING },
              body: { type: Type.STRING },
              trackingTip: { type: Type.STRING }
            },
            required: ["strategy", "subject", "body", "trackingTip"]
          },
          versionB: {
            type: Type.OBJECT,
            properties: {
              strategy: { type: Type.STRING },
              subject: { type: Type.STRING },
              body: { type: Type.STRING },
              trackingTip: { type: Type.STRING }
            },
            required: ["strategy", "subject", "body", "trackingTip"]
          },
          generalAdvice: { type: Type.STRING }
        },
        required: ["versionA", "versionB", "generalAdvice"]
      }
    }
  });

  return parseAIResponse(response.text);
};

export const enhanceEmail = async (emailText: string): Promise<EnhancementResult> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this email for "The Hemingway Grade" and professional impact: "${emailText}". 
    Provide actionable refinements and stronger semantic alternatives. 
    OUTPUT ONLY RAW JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          corrections: { type: Type.ARRAY, items: { type: Type.STRING } },
          toneAssessment: { type: Type.STRING },
          claritySuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          alternativePhrasing: { type: Type.ARRAY, items: { type: Type.STRING } },
          effectivenessScore: { type: Type.NUMBER }
        },
        required: ["corrections", "toneAssessment", "claritySuggestions", "alternativePhrasing", "effectivenessScore"]
      }
    }
  });

  return parseAIResponse(response.text);
};
