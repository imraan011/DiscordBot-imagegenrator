import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

export async function generateImage(prompt) {
    const interaction = await ai.interactions.create({
        model: "gemini-nano-banana-2.1",
        input: prompt,
    });
    const generatedImage = interaction.output_image;
    if (!generatedImage) return null;
    return Buffer.from(generatedImage.data, "base64");
}
