// import express from 'express';
// import axios from 'axios';
// import session from 'express-session';

// const app = express();
// const PORT = 5000;

// // Middleware setup
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static('public'));
// app.use(
//   session({
//     secret: 'secret-key',
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// // app.set('view engine', 'ejs');
// // app.set('views', './views');

// // --------------------------------------
// // 🔐 ADMIN ROUTES
// // --------------------------------------

// app.get('/', (req, res) => {
//   res.render('login.ejs', { error: null });
// });

// app.get('/admin/register', (req, res) => {
//   res.render('register.ejs', { error: null });
// });

// app.post('/admin/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const results = await axios.post("http://localhost:3000/admin/login", { data: { email, password } });
//         req.session.adminUid = results.data; 
//     res.redirect(`/admin/dashboard`);
//   } catch (err) {
//     res.render('login.ejs', { error: 'Invalid credentials' });
//   }
// });

// // handle registration
// app.post("/admin/register", async (req, res) => {
//   const { full_name, email, password, retypePassword } = req.body;
//   try {
//     await axios.post("http://localhost:3000/admin/register", { data: { full_name, email, password, retypePassword } });
//     res.redirect("/");
//   } catch (error) {
//     let msg = "Server unavailable. Please try again.";
//     if (error.response) msg = error.response.data.message;
//     res.render("register.ejs", { error: msg });
//   }
// });

// app.get('/admin/logout', (req, res) => {
//   req.session.destroy(() => res.redirect('/'));
// });

// app.get('/admin/dashboard', (req, res) => {
//   if (!req.session.adminUid) return res.redirect('/');
//   res.render('index.ejs', { adminUid: req.params.uid });
// });

// // ---------------------------------------------
// // 👥 USERS MANAGEMENT
// // ---------------------------------------------
// app.get('/admin/users', async (req, res) => {
//   if (!req.session.adminUid) return res.redirect('/');
//   try {
//     const { data } = await axios.get(`http://localhost:3000/admin/${req.params.uid}/users`);
//     res.render('users.ejs', { users: data, adminUid: req.params.uid });
//   } catch (err) {
//     console.error(err.message);
//     res.render('users.ejs', { users: [], error: 'Failed to load users', adminUid: req.params.uid });
//   }
// });

// app.post('/admin/deleteUser', async (req, res) => {
//   try {
//     await axios.post(`http://localhost:3000/admin/${req.params.uid}/deleteUser`, {
//       userUid: req.body.userUid,
//     });
//     res.redirect(`/admin/users`);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Failed to delete user');
//   }
// });

// app.post('/admin/deleteUsers', async (req, res) => {
//   try {
//     await axios.post(`http://localhost:3000/admin/${req.params.uid}/deleteUsers`);
//     res.redirect(`/admin/users`);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Failed to delete all users');
//   }
// });

// // ---------------------------------------------
// // 📚 WORDBANK MANAGEMENT
// // ---------------------------------------------
// app.get('/admin/wordbank', async (req, res) => {
//   if (!req.session.adminUid) return res.redirect('/');
//   try {
//     const { data } = await axios.get(`http://localhost:3000/${req.params.uid}/wordbank`);
//     res.render('wordBank.ejs', { words: data, adminUid: req.params.uid });
//   } catch (err) {
//     console.error(err.message);
//     res.render('wordBank.ejs', { words: [], error: 'Failed to load wordbank', adminUid: req.params.uid });
//   }
// });

// app.post('/admin/deleteWordbank', async (req, res) => {
//   try {
//     await axios.post(`http://localhost:3000/admin/${req.params.uid}/deleteWordbank`);
//     res.redirect(`/admin/wordbank`);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Failed to clear wordbank');
//   }
// });

// // --------------------------------------
// // Start server
// // --------------------------------------
// app.listen(PORT, () => {
//   console.log(`Administrator frontend running at Port: ${PORT}`);
// });

import express from 'express';
import axios from 'axios';
import session from 'express-session';

const app = express();
const PORT = 5000;

// ✅ Use backend service name for internal communication
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3000';

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

// --------------------------------------
// 🔐 ADMIN ROUTES
// --------------------------------------

app.get('/', (req, res) => {
  res.render('login.ejs', { error: null });
});

app.get('/admin/register', (req, res) => {
  res.render('register.ejs', { error: null });
});

app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const results = await axios.post(`${BACKEND_URL}/admin/login`, { data: { email, password } });
    req.session.adminUid = results.data;
    res.redirect(`/admin/dashboard`);
  } catch (err) {
    res.render('login.ejs', { error: 'Invalid credentials' });
  }
});

app.post('/admin/register', async (req, res) => {
  const { full_name, email, password, retypePassword } = req.body;
  try {
    await axios.post(`${BACKEND_URL}/admin/register`, {
      data: { full_name, email, password, retypePassword },
    });
    res.redirect('/');
  } catch (error) {
    let msg = 'Server unavailable. Please try again.';
    if (error.response) msg = error.response.data.message;
    res.render('register.ejs', { error: msg });
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.get('/admin/dashboard', (req, res) => {
  if (!req.session.adminUid) return res.redirect('/');
  res.render('index.ejs', { adminUid: req.session.adminUid });
});

// ---------------------------------------------
// 👥 USERS MANAGEMENT
// ---------------------------------------------
app.get('/admin/users', async (req, res) => {
  if (!req.session.adminUid) return res.redirect('/');
  try {
    const { data } = await axios.get(`${BACKEND_URL}/admin/${req.session.adminUid}/users`);
    res.render('users.ejs', { users: data, adminUid: req.session.adminUid });
  } catch (err) {
    console.error(err.message);
    res.render('users.ejs', {
      users: [],
      error: 'Failed to load users',
      adminUid: req.session.adminUid,
    });
  }
});

app.post('/admin/deleteUser', async (req, res) => {
  try {
    await axios.post(`${BACKEND_URL}/admin/${req.session.adminUid}/deleteUser`, {
      userUid: req.body.userUid,
    });
    res.redirect(`/admin/users`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to delete user');
  }
});

app.post('/admin/deleteUsers', async (req, res) => {
  try {
    await axios.post(`${BACKEND_URL}/admin/${req.session.adminUid}/deleteUsers`);
    res.redirect(`/admin/users`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to delete all users');
  }
});

// ---------------------------------------------
// 📚 WORDBANK MANAGEMENT
// ---------------------------------------------
app.get('/admin/wordbank', async (req, res) => {
  if (!req.session.adminUid) return res.redirect('/');
  try {
    const { data } = await axios.get(`${BACKEND_URL}/${req.session.adminUid}/wordbank`);
    res.render('wordBank.ejs', { words: data, adminUid: req.session.adminUid });
  } catch (err) {
    console.error(err.message);
    res.render('wordBank.ejs', {
      words: [],
      error: 'Failed to load wordbank',
      adminUid: req.session.adminUid,
    });
  }
});

app.post('/admin/deleteWordbank', async (req, res) => {
  try {
    await axios.post(`${BACKEND_URL}/admin/${req.session.adminUid}/deleteWordbank`);
    res.redirect(`/admin/wordbank`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to clear wordbank');
  }
});

// --------------------------------------
// Start server
// --------------------------------------
app.listen(PORT, () => {
  console.log(`Administrator frontend running at Port: ${PORT}`);
});
