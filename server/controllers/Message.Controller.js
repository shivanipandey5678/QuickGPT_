//text based ai chat message
import Chat from "../models/Chat.Model.js";
import User from "../models/User.js";
import imagekit from "../config/imageKit.js";
import { openai, CHAT_MODEL } from "../config/openai.js";



export const textMessageController = async (req, res) => {
  try {
      const userId = req.user._id;
      if (req.user.credit < 1) {
          return res.json({
            success: false,
            message: "You don't have enough credits to use this feature",
          });
        }
    const body = req.body || {};
    const { chatId, prompt, persona: personaRaw } = body;
    const persona = typeof personaRaw === "string" ? personaRaw.toLowerCase().trim() : null;

    if (!chatId || prompt === undefined || prompt === null) {
      return res.status(400).json({
        success: false,
        message: "Request body must include chatId and prompt (JSON, Content-Type: application/json).",
      });
    }
    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.message.push({ role: "user", content: prompt, timestamp: Date.now() });

    const systemPrompts = {
      hitesh: "You are Hitesh Sir, a helpful and knowledgeable mentor. You must always reply in character as Hitesh Sir: friendly, teaching style, clear and practical. Sign off or hint that you are Hitesh when appropriate.",
      zakir: "You are Zakir, a helpful and friendly guide. You must always reply in character as Zakir: warm, supportive, easy-to-understand. Sign off or hint that you are Zakir when appropriate.",
    };
    const systemContent = persona && systemPrompts[persona] ? systemPrompts[persona] : (persona ? `You are ${persona}, a helpful and friendly assistant. Reply in a warm, clear way.` : null);

    const messages = systemContent
      ? [
          { role: "system", content: systemContent },
          { role: "user", content: prompt },
        ]
      : [{ role: "user", content: prompt }];

    const { choices } = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages,
    });

    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      
    };
    chat.message.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credit: -1 } });
    return res.json({ success: true, reply });
  } catch (error) {
    const is429 = error.status === 429 || (error.message && String(error.message).includes("429"));
    const message = is429
      ? "AI rate limit reached. Please wait a minute and try again, or check your API quota."
      : "Something went wrong";
    res.status(is429 ? 429 : 500).json({
      success: false,
      message,
      error: error.message,
    });
  }
};



//image generation via OpenAI DALL-E, then upload to ImageKit
export const imageMessageController = async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({
        success: false,
        message: "Image generation requires OpenAI API key. Add OPENAI_API_KEY in server .env",
      });
    }
    const userId = req.user._id;
    if (req.user.credit < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }

    const { prompt, chatId, isPublished } = req.body;
    const chat = await Chat.findOne({ _id: chatId, userId });
    chat.message.push({ role: "user", content: prompt, timestamp: Date.now() });

    const imageResponse = await openai.images.generate({
      model: "dall-e-2",
      prompt: String(prompt),
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });

    const b64 = imageResponse.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(500).json({
        success: false,
        message: "Image generation failed. No image data returned.",
      });
    }

    const base64Image = `data:image/png;base64,${b64}`;
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "quickgpt",
    });

    const reply = {
        role:'assistant',
        content:uploadResponse.url,
        timestamp: Date.now(),
        isImage: true,
        isPublished
      };

      chat.message.push(reply)
      await chat.save()
      await User.updateOne({ _id: userId }, { $inc: { credit: -2 } });
      res.json({success:true, reply})
  } catch (error) {
    const is429 = error.status === 429 || (error.response && error.response.status === 429) || (error.message && String(error.message).includes("429"));
    const message = is429
      ? "AI rate limit reached. Please wait a minute and try again, or check your API quota."
      : "Something went wrong";
    res.status(is429 ? 429 : 500).json({
      success: false,
      message,
      error: error.message,
    });
  }
};
