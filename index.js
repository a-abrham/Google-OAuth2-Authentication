const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
require('./auth'); // Assuming your Passport setup is in 'auth.js'

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// Initialize session before passport
app.use(session({
  secret: 'mister',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Ensure that the '/auth/google' route is defined before passport.authenticate
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/auth/google/failure', (req, res) => {
  res.send('Login failed');
});

app.get('/auth/google/success', isLoggedIn, (req, res) => {
  let name = req.user.displayName;
  res.send(`Login successful, Hello ${name} <a href="/auth/logout">logout</a>`);
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
