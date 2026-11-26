import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files (CSS, images) from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Configure session
app.use(
  session({
    secret: 'super-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
  })
);

// In-memory user store (resets when server restarts)
const users = [];

// Middleware to protect private routes
function requireLogin(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Home route
app.get('/', (req, res) => {
  res.redirect(req.session.user ? '/dashboard' : '/login');
});

// Render Login Page
app.get('/login', (req, res) => {
  res.render('login', {
    error: req.query.error || null,
    success: req.query.success || null,
  });
});

// Handle Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.redirect('/login?error=Invalid+email+or+password');
  }

  req.session.user = {
    name: user.name,
    email: user.email,
    joinedAt: user.joinedAt,
  };
  res.redirect('/dashboard');
});

// Render Register Page
app.get('/register', (req, res) => {
  res.render('register', { error: req.query.error || null });
});

// Handle Registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (users.some((u) => u.email === email)) {
    return res.redirect('/register?error=Email+already+registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    name,
    email,
    password: hashedPassword,
    joinedAt: new Date().toLocaleDateString(),
  });

  res.redirect('/login?success=Account+created!+Please+log+in.');
});

// Protected Dashboard
app.get('/dashboard', requireLogin, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
