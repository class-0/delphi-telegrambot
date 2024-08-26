import OpenAI from "openai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/index.mjs";

export const OPENAI_ERROR = "OPENAI_ERROR";

export const fetchUrlSummary = async (url: string, openaiKey: string) => {
  try {
    const openai = new OpenAI({ apiKey: openaiKey });

    const chatInput: ChatCompletionCreateParamsNonStreaming = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: `Can you help create a 500 word general summary of the following url? ${url}`,
        },
      ],
      temperature: 0.4,
    };

    const res = await openai.chat.completions.create(chatInput);

    return res.choices[0].message.content;
  } catch (err) {
    console.log(`received ${err} fetching url summary for ${url}`);
    throw new Error(OPENAI_ERROR);
  }
};
