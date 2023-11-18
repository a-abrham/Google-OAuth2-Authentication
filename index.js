const express = require('express'),
passport = require('passport'),
session = require('express-session')
path = require('path')
require('./auth')

app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, "client")))

function isLoggedIn(req, res, next){
    req.user ? next() : res.sendStatus(401)
}

app.get('/', (req, res)=>{
    res.sendFile('/index.html')
})

app.use(session({ 
    secret: 'mister',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

app.use(passport.initialize())
app.use(passport.session())
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get('/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

app.get('/auth/google/failure', (req, res) => {
    res.send('Login failed')
})

app.get('/auth/google/success', isLoggedIn, (req, res) => {
    let name = req.user.displayName
    res.send(`Login sucessful, Hello ${name}     <a href="/auth/logout">logout</a>
    `)
})

app.use('/auth/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/');
})

app.listen(3000, ()=> {
    console.log("Server is running on port 3000");
})