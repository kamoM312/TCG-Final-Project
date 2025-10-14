import express from "express";
import bodyParser from "body-parser";
import { GoogleGenAI, Type } from "@google/genai";
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
  app.post('/login', async (req, res) => {
        const {email, password} = req.body; 
        let user = "";

         if (!email || email.trim().length === 0) {
    return res.status(400).json({ message: "Email cannot be empty!" });
  }

  if (!password || password.trim().length === 0) {
    return res.status(400).json({ message: "Password cannot be empty!" });
  }

        const hashed = await hashPassword(password);

        try {
            const result = await dbPool.query(`SELECT BIN_TO_UUID(uid) AS uid, password FROM Users WHERE email = '${email}';`);
            console.log(result)
            const user = result[0][0].uid;
            const dbPassword = result[0][0].password;
            const isMatch = await verifyPassword(password, dbPassword);
            console.log("Password matches:", isMatch);

            if(isMatch === true){
                // res.redirect(`/users/${user}`); 
                console.log(user)
                res.json(user)
            } else {
                return res.status(400).json({ message: "Invalid Email and/or Password combination" });
            }
            
        } catch (error) {
            console.log(`Invalid Email and/or Password combination `+error);
            return res.status(500).json({ error: "Server error. Please try again later." });
        }
    })

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
app.post('/admin/login', async (req, res) => {
        const {email, password} = req.body; 
        let user = "";

         if (!email || email.trim().length === 0) {
    return res.status(400).json({ message: "Email cannot be empty!" });
  }

  if (!password || password.trim().length === 0) {
    return res.status(400).json({ message: "Password cannot be empty!" });
  }

        const hashed = await hashPassword(password);

        try {
            const result = await dbPool.query(`SELECT BIN_TO_UUID(uid) AS uid, password FROM admins WHERE email = '${email}';`);
            console.log(result)
            const user = result[0][0].uid;
            const dbPassword = result[0][0].password;
            const isMatch = await verifyPassword(password, dbPassword);
            console.log("Password matches:", isMatch);

            if(isMatch === true){
                // res.redirect(`/users/${user}`); 
                console.log(user)
                res.json(user)
            } else {
                return res.status(400).json({ message: "Invalid Email and/or Password combination" });
            }
            
        } catch (error) {
            console.log(`Invalid Email and/or Password combination `+error);
            return res.status(500).json({ error: "Server error. Please try again later." });
        }
    })

    // user 
    // view word bank
    app.get(`/:uid/wordbank`, async (req, res) => {
      try {
        const [results] = await dbPool.query(`SELECT * FROM Wordbank;`);
        res.json(results);
      } catch(error) {
        console.error('Error retrieving wordbank:', error);
        res.status(500).send('Error retrieving wordbank.');
      }
    });

    // view personal word bank 
 app.get("/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {

    const [userRows] = await dbPool.query(
      `SELECT id FROM Users WHERE uid = ${uid};`

    );

    if (!userRows || userRows.length === 0) {
      return res.status(404).send("User not found");
    }

    const userId = userRows[0].id;

    const [wordRows] = await dbPool.query(
      `SELECT Wordbank.* 
       FROM Wordbank 
       JOIN user_wordbank 
       ON Wordbank.id = user_wordbank.wordbank_id 
       WHERE user_wordbank.user_id = ?;`,
      [userId]
    );

    res.json(wordRows);
  } catch (error) {
    console.error("Error retrieving wordbank:", error.message);
    res.status(500).send("Error retrieving wordbank.");
  }
});


    // add item to personal word bank from search
    app.post(`/:uid/add`, async (req, res) => {
      const uid = req.params.uid;
      console.log("uid "+uid)
      const { word, definition, pronunciation, example } = req.body;

      try {
        await dbPool.query(`INSERT INTO Wordbank (word, definition, pronunciation, example) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);`,
          [word, definition, pronunciation, example]
        );

        // get user id 
        const [rows] = await dbPool.query(`SELECT id FROM Users WHERE uid = ${uid};` 
        );
        
        if (!rows || rows.length === 0) {
      return res.status(404).send("User not found");
    }
    const userId = rows[0].id;
    console.log(`id: ${userId}`);

        await dbPool.query(`INSERT INTO user_wordbank (user_id, wordbank_id) VALUES (?, LAST_INSERT_ID());`,
          [userId]
        );
        res.status(200).send("Success");
      } catch(e) {
        console.error(`Error adding word to personal wordbank. `+e.message);
        res.status(500).send(`Error adding word to personal wordbank.`)
      }
    })

    // add item to personal word bank from main word bank

    // remove item from personal word bank
        app.post("/:uid/delete-word", async (req, res) => {
  const uid = req.params.uid;
  const wordId = req.body.wordId;

  const conn = await dbPool.getConnection(); // mysql2/promise
  try {
    await conn.beginTransaction();

    // Find the user’s numeric id
    const [rows] = await conn.query(`SELECT id FROM Users WHERE uid = ${uid};`);
    if (!rows || rows.length === 0) {
      await conn.rollback();
      return res.status(404).send("User not found.");
    }
    const userId = rows[0].id;

    // Delete all words linked to this user
    await conn.query(`DELETE FROM user_wordbank WHERE user_id = ? AND wordbank_id = ?;`, [userId, wordId]);

    await conn.commit();
    res.status(200).send("Successfully removed word from user's wordbank.");
  } catch (error) {
    await conn.rollback().catch(() => {});
    console.error("Error clearing user's wordbank:", error.message);
    res.status(500).send("Error clearing user's wordbank.");
  } finally {
    conn.release();
  }
});

    // remove all items from personal word bank
    app.post("/:uid/clear", async (req, res) => {
  const uid = req.params.uid;

  const conn = await dbPool.getConnection(); // mysql2/promise
  try {
    await conn.beginTransaction();

    // Find the user’s numeric id
    const [rows] = await conn.query(`SELECT id FROM Users WHERE uid = ${uid};`);
    if (!rows || rows.length === 0) {
      await conn.rollback();
      return res.status(404).send("User not found.");
    }
    const userId = rows[0].id;

    // Delete all words linked to this user
    await conn.query(`DELETE FROM user_wordbank WHERE user_id = ?;`, [userId]);

    await conn.commit();
    res.status(200).send("Successfully cleared user's wordbank without deleting the user.");
  } catch (error) {
    await conn.rollback().catch(() => {});
    console.error("Error clearing user's wordbank:", error.message);
    res.status(500).send("Error clearing user's wordbank.");
  } finally {
    conn.release();
  }
});
 

    // delete account and user_wordbank entries using sql transaction
    app.post("/:uid/delete", async (req, res) => {
  const uid = req.params.uid;

  const conn = await dbPool.getConnection(); // assumes mysql2/promise
  try {
    await conn.beginTransaction();

    // 1. Get the user's numeric ID
    const [rows] = await conn.query(`SELECT id FROM Users WHERE uid = ${uid};`);
    if (!rows || rows.length === 0) {
      await conn.rollback();
      return res.status(404).send("User not found.");
    }
    const userId = rows[0].id;

    // 2. Delete from user_wordbank first (foreign key dependency)
    await conn.query(`DELETE FROM user_wordbank WHERE user_id = ?;`, [userId]);

    // 3. Delete from Users
    await conn.query(`DELETE FROM Users WHERE uid = ${uid};`);

    await conn.commit();
    res.status(200).send("Successfully deleted user and related wordbank entries.");
  } catch (error) {
    await conn.rollback().catch(() => {});
    console.error("Error deleting user:", error.message);
    res.status(500).send("Error deleting user.");
  } finally {
    conn.release();
  }
});


    // search for word
app.post("/:uid/search", async (req, res) => {
    const word = req.body.word;
    console.log(`Search for: ${word}`)
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Provide a definition, pronunciation, and usage example for the word '${word}'. `,
    config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
       properties: {
              word: { type: Type.STRING },
              definition: { type: Type.STRING },
              pronunciation: { type: Type.STRING },
              example: { type: Type.STRING },
            },
      
        propertyOrdering: ["word", "definition", "pronunciation", "example",]
      },
    },
  },
  });
  // console.log(response.text);
  const cleanData = JSON.parse(response.text);

    // Send the real object to client
    res.json(cleanData);
})

// get word of the day 
app.get("/:uid/random", async (req, res) => {
    const word = req.body.word;
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Pick a completely random english word from the oxford dictionary. Provide a definition, pronunciation and usage example for the word.`,
    config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
       properties: {
              word: { type: Type.STRING },
              definition: { type: Type.STRING },
              pronunciation: { type: Type.STRING },
              example: { type: Type.STRING },
            },
      
        propertyOrdering: ["word", "definition", "pronunciation", "example",]
      },
    },
  },
  });
  // console.log(response.text);
  const cleanData = JSON.parse(response.text);

    // Send the real object to client
    res.json(cleanData);
});


    // admin 
    // view users 
    app.get(`/admin/users`, async (req, res) => {
      const users = await db.query(`SELECT BIN_TO_UUID(uid) AS uid, full_name, email FROM Users`);
      console.log(users);
      res.json(users);
    })


    // remove user 
    app.post(`/admin/delete/:uid`, async (req, res) => {
      const uid = req.body.uid;
      try {
      await db.query(`DELETE FROM Users WHERE uid=?`,
        [uid]
      );
      res.status(200).send('Succesfully deleted user.');
    } catch {
      console.error('Error deleting user:', error);
      res.status(500).send('Error deleting user.');
    }
    });

    // reset user password 

    // clear word bank
    app.post('/admin/deleteWorbank/:uid', async (req, res) => {
      try {
        await db.query(`DELETE * FROM Wordbank;`);
        await db.query(`DELETE * FROM user_wordbank`);
      } catch {
        console.log(`Error clearing wordbank`);
        res.status(500).send(`Error clearing wordbank`);
      }
    })


app.listen(PORT, () => {
    console.log(`Server connected on port: ${PORT}!`);
})