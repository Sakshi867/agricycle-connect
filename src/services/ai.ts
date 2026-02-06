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

const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY;
const GROK_API_URL = import.meta.env.VITE_GROK_API_URL || 'https://api.x.ai/v1/chat/completions';

/**
 * Analyzes an image of agricultural waste using Grok AI
 */
export async function analyzeWasteImage(imageBlob: Blob, fileName: string): Promise<AIAnalysisResult> {
  try {
    if (!GROK_API_KEY) {
      throw new Error('Grok API Key is not configured');
    }

    // Convert Blob to Base64
    const base64Image = await blobToBase64(imageBlob);
    
    // Clean up base64 string (remove data:image/jpeg;base64, prefix)
    const base64Data = base64Image.split(',')[1];

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

    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a precise agricultural analysis tool that outputs only valid JSON."
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { 
                type: "image_url", 
                image_url: { 
                  url: `data:image/jpeg;base64,${base64Data}` 
                } 
              }
            ]
          }
        ],
        model: "grok-vision-beta",
        temperature: 0.1,
        max_tokens: 600,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
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
