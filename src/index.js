const express = require('express');
require("./db/mongoose");
const User = require("./models/user");

const app = express();
const port = process.env.PORT || 5000;

//configuring exporess to automatically parse the incoming json for us,
//so we have it as an objext we can use
app.use(express.json());

app.post('/users', (req,res)=> {
    const user = new User(req.body);
    user.save().then(()=> res.send(user)).catch((e)=>{
        res.status(400).send(e);
    });
})

app.listen((port, ()=> {
    console.log("server is up on port " + port);
}))