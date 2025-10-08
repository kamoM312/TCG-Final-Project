import express from "express";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

const PORT = 3000;
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get("/", async (req, res) => {
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
})

// get word of the day 
app.get("/random", async (req, res) => {
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Provide a completely random english word with a definition, pronunciation, and usage example. Turn this into a json response, object, attributes: definition, pronunciation, example",
  });
  console.log(response.text);
})

// search for word
app.post("/search", async (req, res) => {
    const word = req.body.word;
    console.log(`Search for: ${word}`)
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Provide a definition, pronunciation, and usage example for the word '${word}'. Turn this into a json response, object, attributes: definition, pronunciation, example`,
  });
  console.log(response.text);
})


app.listen(PORT, () => {
    console.log(`Server connected on port: ${PORT}!`);
})