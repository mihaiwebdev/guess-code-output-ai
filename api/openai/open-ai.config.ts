import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const openai = new OpenAI({
  organization: process.env.ORGANIZATION,

  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
