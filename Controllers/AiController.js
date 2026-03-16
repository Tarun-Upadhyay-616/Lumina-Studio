
import dotenv from "dotenv"
import OpenAI from "openai";

dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const AiGenerator = async () => {
  try {
    const response = await openai.images.generate({
      model: "gemini-2.0-flash",
      prompt: "Generate a image of dog",
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json" 
    });
    const b64Data = response.data[0].b64_json;
    
    const imageSource = `data:image/png;base64,${b64Data}`;

    return res.status(200).json({
      success: true,
      data: imageSource
    });

  } catch (error) {

    console.error("Error generating AI response:", error.message);
    
    if (error.status === 429) {
      console.error("Rate limit exceeded. Please check your Google AI Studio quota.");
    }
  }
}