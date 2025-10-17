import express from 'express';
 import bodyParser from 'body-parser';
 import axios from 'axios';

 const app = express();
 const port = 4000;

 let login_id;
 let isLogged = false;
 let userType;
 let login_uid;

 app.use(express.static('public'));

 app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// login
app.get("/", async (req, res) => {
  res.render("login.ejs");
});

// register
app.get("/", async (req, res) => {
  res.render("register.ejs");
});

// get user wordbank
app.get("/:uid", async (req, res) => {
  if(!isLogged){
    res.redirect("/");
  }
  const user_id = req.params.uid;
  try {
    const response = await axios.get(`http://localhost:3000/${user_id}`);
    const result = response.data;
    if(result.length < 1){
      throw new Error("No words found");
    }
    console.log(result)
    // result.forEach(e => {
    //   e.date = e.date_of_birth.substring(0, 10);
    //   e.user_id = user_id;
    // });
    // res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    // res.render("index.ejs", {
    //   error: error.message,
    // });
  }
});

// get website wordbank 
app.get("/:uid/wordbank", async (req, res) => {
  try {
    const user_id = req.params.uid;
    const response = axios.get(`http:localhost:3000/${user_id}`);
    const result = (await response).data;
    if(result.length < 1){
      throw new Error("No words founnd");
    }
    console.log(result);
  } catch (error) {
    console.error("Failed to make request: ", error.message);
  }
})







// register
app.post("/register", async (req, res) => {
const { full_name, email, password, retypePassword } = req.body;

const data = { 
  full_name: full_name,
  email: email,
  password: password,
  retypePassword : retypePassword
};
console.log("Frontend data:", data);

try {
 await axios.post("http://localhost:3000/register", { data });
//  res.redirect("/");
  console.log("success");
} catch (error) {
 if (error.response) {
   // API responded with error (validation, duplicate email, etc.)
   console.log("API responded with error:", error.response.data);
   res.render("register.ejs", { error: error.response.data.message });
 } else {
   // Network/server issue
   console.log("Network/API error:", error.message);
   res.render("register.ejs", { error: "Server unavailable. Please try again." });
 }
}
});


// submit login
app.post("/login", async (req, res) => {
  // if(isLogged){
  //   res.redirect(`/user/${login_id}`);
  // }
  const { email, password } = req.body;
  const data = {
    email: email,
    password: password,
  }

  // console.log("data "+data.email);

  try {
    const results = await axios.post("http://localhost:3000/login", { data });
    // console.log(results)
    console.log(results.data)
    login_id = results.data;
    isLogged = true;
    
    res.redirect(`/${login_id}`);
  } catch (error) {
    if (error.response) {                                                                                                                                                                                                                                                                                                                                                                                                                              
  
   console.log("API responded with error:", error.response.data);
  //  res.render("login.ejs", { error: error.response.data.message });

  } else {
   // Network/server issue
   console.log("Network/API error:", error.message);
  //  res.render("login.ejs", { error: "Server unavailable. Please try again." });
 }
}})

// search word 
app.post("/:uid/search", async (req, res) => {
  //  if(!isLogged){
  //   res.redirect("/");
  // } else {
  const word = req.body.word;
 
  // }

  console.log("data: " + word);

  try {
    const result = await axios.post(`http://localhost:3000/:uid/search`, { word });
    console.log(result.data[0]);
    // res.redirect(`/user/${login_id}`);
  } catch (error) {
    console.error("Failed to create user:", error.message);
    // res.redirect(`/user/${login_id}`);
  }}
);








app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
});