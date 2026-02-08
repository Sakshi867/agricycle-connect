import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Service for analyzing agricultural waste images
 */

export interface AIAnalysisResult {
  wasteType: string;
  reasoning: string;
  quality: string;
  confidence: number;
  suggestedPrice: string;
  industries: string[];
  estimatedWeight: string;
  fileName?: string;
  timestamp?: string;
  success: boolean;
  error?: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Analyzes an image of agricultural waste using Gemini AI
 */
export async function analyzeWasteImage(imageBlob: Blob, fileName: string): Promise<AIAnalysisResult> {
  try {
    if (!GEMINI_API_KEY || !genAI) {
      throw new Error('Gemini API Key is not configured');
    }

    // Using gemini-2.0-flash as it is high performing and available in the standard SDK
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Convert Blob to Base64
    const base64Image = await blobToBase64(imageBlob);
    const base64Data = base64Image.split(',')[1];
    const mimeType = imageBlob.type || 'image/jpeg';

    const prompt = `You are a professional agricultural waste auditor. 
Analyze the visual characteristics of the provided image (color, fiber length, texture, and density).

Step 1: Identify key visual features (e.g., golden thin stalks, brownish flaky husks, white fibrous stems).
Step 2: Compare features against known waste types:
- Rice Husk: Tiny, flaky, light-brown V-shaped shells.
- Wheat Straw: Long, hollow, golden-yellow tubes.
- Sugarcane Bagasse: Coarse, crushed, stringy fiber.
- Cotton Stalks: Dark, woody, branched sticks.
- Corn Stover: Large flat leaves and thick stalk segments.
- Groundnut Shells: Rugged, tan, oval-shaped pods.

Step 3: Provide the analysis STRICTLY in this JSON format:
{
  "wasteType": "Exact name from list",
  "reasoning": "Brief visual justification for this identification",
  "quality": "Excellent/Good/Average/Poor",
  "confidence": number between 0-100,
  "suggestedPrice": "₹X-Y per kg",
  "industries": ["Industry 1", "Industry 2"],
  "estimatedWeight": "Quantity estimate if visible"
}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      }
    ]);

    const response = await result.response;
    const content = response.text();

    // Attempt to extract and parse JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResult = JSON.parse(jsonMatch[0]);
      return {
        ...parsedResult,
        fileName,
        timestamp: new Date().toISOString(),
        success: true
      };
    } else {
      throw new Error('No JSON found in AI response');
    }

  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    return {
      wasteType: 'Agricultural Waste',
      quality: 'Good',
      confidence: 50,
      suggestedPrice: '₹3 - ₹8 per kg',
      industries: ['Biomass Energy', 'Composting', 'Animal Feed'],
      estimatedWeight: '200-800 kg',
      reasoning: `Analysis failed: ${error.message}`,
      success: false,
      error: error.message
    };
  }
}

/**
 * Helper to convert Blob to Base64 string
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
