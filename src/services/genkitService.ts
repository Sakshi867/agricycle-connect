import { AIAnalysisResult } from "./ai";

/**
 * Service to connect to the deployed Genkit backend
 */

const rawUrl = import.meta.env.VITE_GENKIT_SERVICE_URL;
const GENKIT_SERVICE_URL = rawUrl && !rawUrl.startsWith('http') ? `https://${rawUrl}` : rawUrl;

// Matching the backend route: /api/analysis/waste
const GENKIT_FLOW_ENDPOINT = GENKIT_SERVICE_URL
    ? `${GENKIT_SERVICE_URL}/api/analysis/waste`
    : '';

/**
 * Analyzes waste using the remote Genkit service
 * Updated to include location and quantity as required by the backend
 */
export async function analyzeWithGenkit(
    imageBlob: Blob,
    location: string = "Not Specified",
    quantity: string = "1"
): Promise<AIAnalysisResult> {
    try {
        if (!GENKIT_FLOW_ENDPOINT) {
            throw new Error("VITE_GENKIT_SERVICE_URL is not configured in .env");
        }

        console.log("Calling Genkit at:", GENKIT_FLOW_ENDPOINT);

        // Prepare Multipart Form Data
        const formData = new FormData();
        formData.append('image', imageBlob, 'waste-image.jpg');

        // FIX: Added the missing required fields
        formData.append('location', location);
        formData.append('quantity', quantity);

        const response = await fetch(GENKIT_FLOW_ENDPOINT, {
            method: "POST",
            // Note: browser automatically sets multipart/form-data headers
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Service Error: ${response.status} - ${errorText}`);
        }

        const json = await response.json();

        // Handle standard Genkit or custom Express response wrapping
        const analysisData = json.data || json.result || json;

        return {
            wasteType: analysisData.wasteType || "Unknown",
            reasoning: analysisData.reasoning || "Analysis complete.",
            quality: analysisData.quality || "Standard",
            confidence: analysisData.confidence || 0.85,
            suggestedPrice: analysisData.suggestedPrice || "Market Rate",
            industries: Array.isArray(analysisData.industries) ? analysisData.industries : [],
            estimatedWeight: analysisData.estimatedWeight || quantity,
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
 * Helper to convert Blob to Base64 (if needed elsewhere)
 */
function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}