import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function extractTableFromImage(file: File): Promise<string[][]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Convert File to base64
    const buffer = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    const mimeType = file.type;
    
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType
        }
      },
      "Extract the table from this image and return it in CSV format (comma-separated values). Only include the actual data, no extra commentary."
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Parse CSV to array
    return text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to extract table from image');
  }
}