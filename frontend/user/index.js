import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import session from 'express-session';

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use sessions to track login state per user
app.use(session({
  secret: 'supersecretkey', // replace with env var in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set true if HTTPS
}));

// ignore favicon requests
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
    const results = await axios.post("http://localhost:3000/login", { data: { email, password } });
    req.session.userUid = results.data; // store UID in session
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
    await axios.post("http://localhost:3000/register", { data: { full_name, email, password, retypePassword } });
    res.redirect("/");
  } catch (error) {
    let msg = "Server unavailable. Please try again.";
    if (error.response) msg = error.response.data.message;
    res.render("register.ejs", { error: msg });
  }
});

// dashboard (user’s personal wordbank)
app.get("/dashboard", async (req, res) => {
  const uid = req.session.userUid;
  if (!uid) return res.redirect("/");

  try {
    const response = await axios.get(`http://localhost:3000/${uid}`);
    const words = response.data;
    console.log(words);
    if (!words || words.length < 1) throw new Error("No words found");
    res.render("index.ejs",  {data: words});
  } catch (error) {
    res.render("index.ejs", { data: [], error: error.message });
  }
});

// search word
app.post("/search", async (req, res) => {
  const uid = req.session.userUid;
  if (!uid) return res.redirect("/");

  const word = req.body.word;
  try {
    const result = await axios.post(`http://localhost:3000/${uid}/search`, { word });
    res.render("index.ejs", { data: result.data });
  } catch (error) {
    res.render("index.ejs", { data: [], error: error.message });
  }
});

// delete word 
app.post(`/delete/:wordId`, async (req, res) => {
  const uid = req.session.userUid;

  const wordId = req.params.wordId;
  console.log("word id "+wordId);
  try {
    await axios.post(`http://localhost:3000/${uid}/delete-word`, { wordId });
    console.log("Successfully deleted");
    res.redirect(`/dashboard`);
  } catch (error) {
    console.error(`Delete operation failed: `, error.message);
    res.redirect(`/dashboard`);
  }
})

// logout
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
