const express = require('express'),
path = require('path'),
app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, "client")))

app.get('/', (req, res)=>{
    res.sendFile('/index.html')
})

app.listen(3000, ()=> {
    console.log("Server is running on port 3000");
})