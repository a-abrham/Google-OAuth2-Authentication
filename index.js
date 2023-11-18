const express = require('express'),
passport = require('passport')
path = require('path')
require('./auth')

app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, "client")))

app.get('/', (req, res)=>{
    res.sendFile('/index.html')
})

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

app.get('/auth/google/sucess', (req, res) => {
    res.send('Login sucessful')
})

app.listen(3000, ()=> {
    console.log("Server is running on port 3000");
})