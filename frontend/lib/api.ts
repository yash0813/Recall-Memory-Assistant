const API_URL = "http://localhost:8000";

export interface AnalysisResult {
    whisper: string;
    confidence: number;
    mood: string;
    hex_color: string;
}

export async function analyzeImage(imageBlob: Blob): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append("file", imageBlob, "capture.jpg");

    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Analysis failed:", error);
        throw error;
    }
}
