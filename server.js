const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const session = require("express-session");

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, "data", "users.json");

// Ensure data directory and file exist
if (!fs.existsSync(path.dirname(dataFilePath))) {
  fs.mkdirSync(path.dirname(dataFilePath));
}

if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up session middleware
app.use(
  session({
    secret: "your-secret-key", // Replace with a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to `true` if using HTTPS
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Route to handle form submission
app.post("/submit", (req, res) => {
  const { name, password, age, height, weight } = req.body;
  const bmr = Math.floor(10 * weight + 6.25 * height - 5 * age + 5);

  // Read existing users from file
  let users = JSON.parse(fs.readFileSync(dataFilePath));

  // Add new user to the array
  users.push({ name, password, age, height, weight, bmr });

  // Write updated users to file
  fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));

  res.send(`
        <h1>Form Submitted</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p><strong>Age:</strong> ${age}</p>
        <p><strong>Height:</strong> ${height} cm</p>
        <p><strong>Weight:</strong> ${weight} kg</p>
        <p><strong>Daily calories:</strong> ${bmr}</p>
    `);
});

// Route to get all users
app.get("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync(dataFilePath));
  res.json(users);
});

app.post("/login", (req, res) => {
  const { name, password } = req.body;
  let users = JSON.parse(fs.readFileSync(dataFilePath));

  const user = users.find(
    (user) => user.name === name && user.password === password
  );

  if (user) {
    req.session.user = user; // Set the user in session
    res.redirect("/index.html"); // Redirect to index.html after login
  } else {
    res.send(`<h1>Invalid credentials</h1><a href="/login.html">Try again</a>`);
  }
});


app.get("/login-status", (req, res) => {
  // Assuming user information is stored in a session or similar after login
  const loggedInUser = req.session?.user; // Replace with actual session handling

  if (loggedInUser) {
    const { name, bmr } = loggedInUser;
    res.json({ loggedIn: true, name, bmr });
  } else {
    res.json({ loggedIn: false });
  }
});
// Add this route to your server.js
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Unable to log out.");
    }
    res.redirect("/"); // Redirect to the home page or login page
  });
});



// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
