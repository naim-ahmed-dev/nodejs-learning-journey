import express from 'express';
import session from 'express-session';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse HTML form submissions and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure session storage
app.use(
  session({
    secret: 'super-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
  })
);

// Demo user credentials (in real apps, use a database and hashed passwords)
const DEMO_USER = {
  username: 'admin',
  password: 'password123',
};

// Middleware to protect private routes
function requireLogin(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// 1. Home Route
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

// 2. Render Login Page (GET)
app.get('/login', (req, res) => {
  const error = req.query.error ? '<p style="color: red;">Invalid username or password!</p>' : '';
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Login</title>
      <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; margin-top: 100px; background: #f4f4f9; }
        .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 300px; }
        input { width: 100%; padding: 8px; margin: 8px 0 16px; box-sizing: border-box; }
        button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Login</h2>
        ${error}
        <form action="/login" method="POST">
          <label>Username</label>
          <input type="text" name="username" required placeholder="admin" />
          
          <label>Password</label>
          <input type="password" name="password" required placeholder="password123" />
          
          <button type="submit">Sign In</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// 3. Handle Login Submission (POST)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    req.session.user = username;
    return res.redirect('/dashboard');
  }

  res.redirect('/login?error=1');
});

// 4. Protected Dashboard Page
app.get('/dashboard', requireLogin, (req, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; padding: 40px;">
      <h1>Welcome, ${req.session.user}!</h1>
      <p>You are viewing a protected dashboard.</p>
      <a href="/logout">Logout</a>
    </div>
  `);
});

// 5. Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});