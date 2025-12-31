
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure it is configured.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateProfessionalHeadshot = async (
  imageBase64: string,
  mimeType: string,
  style: string = 'corporate'
): Promise<string | null> => {
  const ai = getAIClient();
  
  // Prompt tailored to create a professional LinkedIn headshot while maintaining likeness
  const prompt = `
    Transform the person in this photo into a professional LinkedIn headshot. 
    Style: ${style}. 
    Details: 
    - Keep the person's facial features, hairstyle, and eyewear (glasses) exactly as they are in the original photo to maintain identity.
    - Change the attire to high-end business attire (suit, blazer, or professional shirt).
    - Use a professional, clean background like a modern office with soft bokeh (blurred background) or a solid studio backdrop.
    - Enhance the lighting to look like a professional studio setup.
    - Ensure a photorealistic, high-quality result suitable for a corporate profile.
    - The person should have a friendly, confident, and professional expression.
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
