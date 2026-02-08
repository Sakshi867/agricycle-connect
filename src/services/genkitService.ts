import { AIAnalysisResult } from "./ai";

/**
 * Service to connect to the deployed Genkit backend
 */

const rawUrl = import.meta.env.VITE_GENKIT_SERVICE_URL;
const GENKIT_SERVICE_URL = rawUrl && !rawUrl.startsWith('http') ? `https://${rawUrl}` : rawUrl;
const GENKIT_API_KEY = import.meta.env.VITE_GENKIT_API_KEY; // Optional key for auth

/**
 * Analyzes waste using the remote Genkit service
 */
export async function analyzeWithGenkit(imageBlob: Blob): Promise<AIAnalysisResult> {
    try {
        if (!GENKIT_SERVICE_URL) {
            throw new Error("VITE_GENKIT_SERVICE_URL is not configured in .env");
        }

        // Convert blob to base64 for transmission
        const base64Image = await blobToBase64(imageBlob);

        console.log("Calling Genkit service at:", GENKIT_SERVICE_URL);

        const response = await fetch(GENKIT_SERVICE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(GENKIT_API_KEY && { "Authorization": `Bearer ${GENKIT_API_KEY}` }),
            },
            body: JSON.stringify({
                data: {
                    image: base64Image,
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Genkit Service Error: ${response.status} - ${errorText}`);
        }

        const json = await response.json();

        // Assuming Genkit returns the result in the 'result' or top-level field
        const analysisData = json.result || json;

        return {
            wasteType: analysisData.wasteType,
            reasoning: analysisData.reasoning,
            quality: analysisData.quality,
            confidence: analysisData.confidence,
            suggestedPrice: analysisData.suggestedPrice,
            industries: analysisData.industries || [],
            estimatedWeight: analysisData.estimatedWeight,
            success: true,
        };

    } catch (error: any) {
        console.error("Genkit Analysis Error:", error);
        return {
            wasteType: "Error",
            reasoning: error.message,
            quality: "N/A",
            confidence: 0,
            suggestedPrice: "N/A",
            industries: [],
            estimatedWeight: "N/A",
            success: false,
            error: error.message,
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
