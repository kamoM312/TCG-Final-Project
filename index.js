import express from "express";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import dbPool from './db.js'; // Import the connection pool
import { v4 as uuidv4, parse as uuidParse } from 'uuid';
    import bcrypt from 'bcrypt';

const PORT = 3000;
const saltRounds = 10;
const app = express();

let login_id;
    let isLogged = false;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    async function hashPassword(plainPassword) {
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

    async function verifyPassword(plainPassword, hashedPassword) {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
}

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

// register user 

    app.post('/register', async (req, res) => {

        const {full_name, email, password, retypePassword} = req.body;
        console.log("full name"+full_name);
        console.log("email"+email);


         if (!full_name || full_name.trim().length === 0) {
    return res.status(400).json({ message: "Full name cannot be empty!" });
  }

  if (!email || email.trim().length === 0) {
    return res.status(400).json({ message: "Email cannot be empty!" });
  }

  if (!password || password.trim().length === 0) {
    return res.status(400).json({ message: "Password cannot be empty!" });
  }

  if (!retypePassword || retypePassword.trim().length === 0) {
    return res.status(400).json({ message: "Retype password cannot be empty!" });
  }

  if (password !== retypePassword) {
    return res.status(400).json({ message: "Password and Retype password must match!" });
  }

        try {
    const [rows] = await dbPool.query(`SELECT id FROM Users WHERE email = ?`, [email]);

    if (rows.length > 0) {
      return res.status(400).json({ message: "Email is already in use!" });
    }

    const hPassword = await hashPassword(password);

    const newUuid = uuidv4();
        const uuidBuffer = Buffer.from(uuidParse(newUuid));

    await dbPool.query(
      `INSERT INTO Users (full_name, email, password, uid) VALUES (?, ?, ?, ?)`,
      [full_name, email, hPassword, uuidBuffer]
    );

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }   
    });

// login user 

// register admin 
  app.post('/admin/register', async (req, res) => {

        const {full_name, email, password, retypePassword} = req.body;
        console.log("full name"+full_name);
        console.log("email"+email);


         if (!full_name || full_name.trim().length === 0) {
    return res.status(400).json({ message: "Full name cannot be empty!" });
  }

  if (!email || email.trim().length === 0) {
    return res.status(400).json({ message: "Email cannot be empty!" });
  }

  if (!password || password.trim().length === 0) {
    return res.status(400).json({ message: "Password cannot be empty!" });
  }

  if (!retypePassword || retypePassword.trim().length === 0) {
    return res.status(400).json({ message: "Retype password cannot be empty!" });
  }

  if (password !== retypePassword) {
    return res.status(400).json({ message: "Password and Retype password must match!" });
  }

        try {
    const [rows] = await dbPool.query(`SELECT id FROM admins WHERE email = ?`, [email]);

    if (rows.length > 0) {
      return res.status(400).json({ message: "Email is already in use!" });
    }

    const hPassword = await hashPassword(password);

    const newUuid = uuidv4();
        const uuidBuffer = Buffer.from(uuidParse(newUuid));

    await dbPool.query(
      `INSERT INTO admins (full_name, email, password, uid) VALUES (?, ?, ?, ?)`,
      [full_name, email, hPassword, uuidBuffer]
    );

    return res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    console.error("Error registering admin:", error);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }   
    });

// login admin 

app.listen(PORT, () => {
    console.log(`Server connected on port: ${PORT}!`);
})