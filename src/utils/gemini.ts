import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFDocument } from "pdf-lib";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function extractTableFromImage(file: File): Promise<string[][]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert data extraction assistant. Your task is to analyze the provided file (which could be an image or a single page of a PDF) and accurately extract any table found within it.

Follow these instructions carefully:
1.  **Identify the primary table** in the document.
2.  **Extract all rows and columns** from the table.
3.  **Format the output as a JSON array of objects.**
    - Each object in the array represents a row in the table.
    - The keys of the object should be the column headers. If a column header has multiple lines (e.g., "Product to Quality" and "Dimensions / TDC / Usage"), combine them into a single, descriptive header string (e.g., "Product Details").
    - The values should be the cell content as strings. If a cell's content spans multiple lines, merge it into a single line.
    - Your response must be only the JSON data. Do not include any markdown formatting like \`\`\`json or \`\`\`.
    - Do not add any introductory text, explanations, or summaries.
4.  **If no table is found**, return an empty JSON array: [].

Example of a correct response:
[
  {
    "S No.": "1",
    "Product Details": "72085110 PLATE MILL PLATES IS 2062 E250BR",
    "Quantity": "0.912 TO"
  },
  {
    "S No.": "2",
    "Product Details": "72085110 PLATE MILL PLATES IS 2062 E250BR",
    "Quantity": "1.484 TO"
  }
]
`;

    const processApiResponse = (text: string): string[][] => {
      let cleanText = text.trim();
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.substring(7, cleanText.length - 3).trim();
      } else if (cleanText.startsWith("```")) {
        cleanText = cleanText.substring(3, cleanText.length - 3).trim();
      }

      if (!cleanText) return [];

      try {
        const jsonData: Record<string, string>[] = JSON.parse(cleanText);
        if (jsonData.length === 0) return [];

        const headers = Object.keys(jsonData[0]);
        const table: string[][] = [headers];
        jsonData.forEach((rowObject) => {
          const row = headers.map((header) => rowObject[header] || "");
          table.push(row);
        });
        return table;
      } catch (e) {
        console.error("Failed to parse JSON from model response:", e);
        console.error("Problematic text:", cleanText);
        return []; // Return empty table on parsing error
      }
    };

    if (file.type === "application/pdf") {
      const pdfBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pageCount = pdfDoc.getPageCount();
      let combinedTable: string[][] = [];

      for (let i = 0; i < pageCount; i++) {
        const subDoc = await PDFDocument.create();
        const [copiedPage] = await subDoc.copyPages(pdfDoc, [i]);
        subDoc.addPage(copiedPage);
        const pdfBytes = await subDoc.save();
        const base64 = btoa(
          new Uint8Array(pdfBytes).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        const result = await model.generateContent([
          { inlineData: { data: base64, mimeType: "application/pdf" } },
          prompt,
        ]);
        const response = await result.response;
        const pageTable = processApiResponse(response.text());

        if (pageTable.length > 0) {
          if (combinedTable.length === 0) {
            combinedTable = pageTable;
          } else {
            combinedTable = combinedTable.concat(pageTable.slice(1)); // Append rows, skipping header
          }
        }
      }

      if (combinedTable.length > 0) {
        return combinedTable;
      }
      throw new Error("Could not find a table in the PDF.");
    } else {
      // Handle images and other file types
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      const result = await model.generateContent([
        { inlineData: { data: base64, mimeType: file.type } },
        prompt,
      ]);
      const response = await result.response;
      const table = processApiResponse(response.text());

      if (table.length > 0) {
        return table;
      }
      throw new Error("Could not find a table in the image.");
    }
  } catch (error) {
    console.error("Error processing file:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract table from file: ${error.message}`);
    }
    throw new Error("Failed to extract table from file");
  }
}
