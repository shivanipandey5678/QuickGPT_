import OpenAI from "openai";

// OpenAI key = OpenAI use karo, nahi to Gemini (Google)
const useOpenAI = !!process.env.OPENAI_API_KEY;

export const openai = new OpenAI(
  useOpenAI
    ? { apiKey: process.env.OPENAI_API_KEY }
    : {
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      }
);

// Model: OpenAI ke liye gpt-3.5-turbo, Gemini ke liye gemini-2.0-flash
export const CHAT_MODEL = useOpenAI ? "gpt-3.5-turbo" : "gemini-2.0-flash";