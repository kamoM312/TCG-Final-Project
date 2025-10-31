// import express from 'express';
// import bodyParser from 'body-parser';
// import axios from 'axios';
// import session from 'express-session';

// const app = express();
// const port = 4000;

// app.use(express.static('public'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Use sessions to track login state per user
// app.use(session({
//   secret: 'supersecretkey', // replace with env var in production
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } // set true if HTTPS
// }));

// // ignore favicon requests
// app.get('/favicon.ico', (req, res) => res.status(204).end());

// // login page
// app.get("/", (req, res) => {
//   res.render("login.ejs", { error: null });
// });

// // register page
// app.get("/register", (req, res) => {
//   res.render("register.ejs", { error: null });
// });

// // handle login
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   console.log(email)
//   try {
//     const results = await axios.post("http://localhost:3000/login", { data: { email, password } });
//     req.session.userUid = results.data; // store UID in session
//     console.log("success")
//     res.redirect("/dashboard");
//   } catch (error) {
//     let msg = "Server unavailable. Please try again.";
//     if (error.response) msg = error.response.data.message;
//     res.render("login.ejs", { error: msg });
//   }
// });

// // handle registration
// app.post("/register", async (req, res) => {
//   const { full_name, email, password, retypePassword } = req.body;
//   try {
//     await axios.post("http://localhost:3000/register", { data: { full_name, email, password, retypePassword } });
//     res.redirect("/");
//   } catch (error) {
//     let msg = "Server unavailable. Please try again.";
//     if (error.response && error.response.data && error.response.data.message) {
//       msg = error.response.data.message;
//     }
//     res.render("register.ejs", { error: msg });
//   }
// });

// // dashboard (user’s personal wordbank)
// app.get("/dashboard", async (req, res) => {
//   const uid = req.session.userUid;
//   if (!uid) return res.redirect("/");

//   try {
//     const response = await axios.get(`http://localhost:3000/${uid}`);
//     const words = response.data;
//     console.log(words);
//     if (!words || words.length < 1) throw new Error("No words found");
//     res.render("index.ejs",  {data: words});
//   } catch (error) {
//     res.render("index.ejs", { data: [], error: error.message });
//   }
// });

// // full wordbank
// app.get("/wordbank", async (req, res) => {
//   const uid = req.session.userUid;
//   if (!uid) return res.redirect("/");

//   try {
//     const response = await axios.get(`http://localhost:3000/${uid}/wordbank`);
//     const words = response.data;
//     console.log(words);
//     if (!words || words.length < 1) throw new Error("No words found");
//     res.render("index2.ejs",  {userUid: uid, data: words});
//   } catch (error) {
//     res.render("index2.ejs", { userUid: uid, data: [], error: error.message });
//   }
// });

// // random word
// app.get("/random", async (req, res) => {
//   const uid = req.session.userUid;
//   if (!uid) return res.redirect("/");

//   try {
//     const response = await axios.get(`http://localhost:3000/${uid}/random`);
//     const words = response.data;
//     console.log(words);
//     if (!words || words.length < 1) throw new Error("No words found");
//     res.render("index2.ejs",  {userUid: uid, data: words});
//   } catch (error) {
//     res.render("index2.ejs", { userUid: uid, data: [], error: error.message });
//   }
// });

// // search word
// app.post("/search", async (req, res) => {
//   const uid = req.session.userUid;
//   if (!uid) return res.redirect("/");

//   const word = req.body.word;
//   try {
//     const result = await axios.post(`http://localhost:3000/${uid}/search`, { word });
//     res.render("index2.ejs", { userUid: uid, data: result.data });
//   } catch (error) {
//     res.render("index2.ejs", { userUid: uid, data: [], error: error.message });
//   }
// });

// // delete word 
// app.post(`/delete/:wordId`, async (req, res) => {
//   const uid = req.session.userUid;

//   const wordId = req.params.wordId;
//   console.log("word id "+wordId);
//   try {
//     await axios.post(`http://localhost:3000/${uid}/delete-word`, { wordId });
//     console.log("Successfully deleted");
//     res.redirect(`/dashboard`);
//   } catch (error) {
//     console.error(`Delete operation failed: `, error.message);
//     res.redirect(`/dashboard`);
//   }
// })

// // add word 
// // Add word to user's wordbank (Frontend → Backend)
// app.post('/add', async (req, res) => {
//   try {
//     // Get the current user's UID (you likely stored it after login)
//     const uid = req.session.userUid; 
//     if (!uid) {
//       console.error("No UID found in session or login.");
//       return res.status(401).send("Not logged in");
//     }

//     // Extract word data from form
//     const { word, definition, pronunciation, example } = req.body;

//     // Forward to backend (port 3000)
//     const response = await axios.post(`http://localhost:3000/${uid}/add`, {
//       word,
//       definition,
//       pronunciation,
//       example,
//     });

//     console.log("Word added successfully:", response.data);

//     // Redirect or render success message
//     res.redirect(`/dashboard`); 
//   } catch (error) {
//     console.error("Failed to add word:", error.message);

//     if (error.response) {
//       res.render("index.ejs", { 
//         error: error.response.data || "Failed to add word.", 
//         data: [] 
//       });
//     } else {
//       res.render("index.ejs", { 
//         error: "Server unavailable. Please try again.", 
//         data: [] 
//       });
//     }
//   }
// });


// // logout
// app.get("/logout", (req, res) => {
//   req.session.destroy(err => {
//     if (err) console.error(err);
//     res.redirect("/");
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import session from 'express-session';

const app = express();
const port = 4000;

// ✅ Use backend container hostname (works inside Docker)
const API_BASE_URL = process.env.API_BASE_URL || "http://backend:3000";

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get('/favicon.ico', (req, res) => res.status(204).end());

// login page
app.get("/", (req, res) => {
  res.render("login.ejs", { error: null });
});

// register page
app.get("/register", (req, res) => {
  res.render("register.ejs", { error: null });
});

// handle login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const results = await axios.post(`${API_BASE_URL}/login`, { data: { email, password } });
    req.session.userUid = results.data;
    res.redirect("/dashboard");
  } catch (error) {
    let msg = "Server unavailable. Please try again.";
    if (error.response) msg = error.response.data.message;
    res.render("login.ejs", { error: msg });
  }
});

// handle registration
app.post("/register", async (req, res) => {
  const { full_name, email, password, retypePassword } = req.body;
  try {
    await axios.post(`${API_BASE_URL}/register`, { data: { full_name, email, password, retypePassword } });
    res.redirect("/");
  } catch (error) {
    let msg = "Server unavailable. Please try again.";
    if (error.response && error.response.data && error.response.data.message) {
      msg = error.response.data.message;
    }
    res.render("register.ejs", { error: msg });
  }
});

// dashboard
app.get("/dashboard", async (req, res) => {
  const uid = req.session.userUid;
  if (!uid) return res.redirect("/");

  try {
    const response = await axios.get(`${API_BASE_URL}/${uid}`);
    const words = response.data;
    res.render("index.ejs", { data: words });
  } catch (error) {
    res.render("index.ejs", { data: [], error: error.message });
  }
});

// full wordbank
app.get("/wordbank", async (req, res) => {
  const uid = req.session.userUid;
  if (!uid) return res.redirect("/");

  try {
    const response = await axios.get(`${API_BASE_URL}/${uid}/wordbank`);
    const words = response.data;
    res.render("index2.ejs", { userUid: uid, data: words });
  } catch (error) {
    res.render("index2.ejs", { userUid: uid, data: [], error: error.message });
  }
});

// random word
app.get("/random", async (req, res) => {
  const uid = req.session.userUid;
  if (!uid) return res.redirect("/");

  try {
    const response = await axios.get(`${API_BASE_URL}/${uid}/random`);
    const words = response.data;
    res.render("index2.ejs", { userUid: uid, data: words });
  } catch (error) {
    res.render("index2.ejs", { userUid: uid, data: [], error: error.message });
  }
});

// search word
app.post("/search", async (req, res) => {
  const uid = req.session.userUid;
  if (!uid) return res.redirect("/");

  const word = req.body.word;
  try {
    const result = await axios.post(`${API_BASE_URL}/${uid}/search`, { word });
    res.render("index2.ejs", { userUid: uid, data: result.data });
  } catch (error) {
    res.render("index2.ejs", { userUid: uid, data: [], error: error.message });
  }
});

// delete word
app.post(`/delete/:wordId`, async (req, res) => {
  const uid = req.session.userUid;
  const wordId = req.params.wordId;

  try {
    await axios.post(`${API_BASE_URL}/${uid}/delete-word`, { wordId });
    res.redirect(`/dashboard`);
  } catch (error) {
    console.error(`Delete operation failed: `, error.message);
    res.redirect(`/dashboard`);
  }
});

// add word
app.post('/add', async (req, res) => {
  try {
    const uid = req.session.userUid;
    if (!uid) return res.status(401).send("Not logged in");

    const { word, definition, pronunciation, example } = req.body;
    await axios.post(`${API_BASE_URL}/${uid}/add`, {
      word, definition, pronunciation, example
    });
    res.redirect(`/dashboard`);
  } catch (error) {
    console.error("Failed to add word:", error.message);
    res.render("index.ejs", {
      error: "Failed to add word. Please try again.",
      data: []
    });
  }
});

// logout
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`User frontend running on http://localhost:${port}`);
  console.log(`Communicating with backend at ${API_BASE_URL}`);
});
