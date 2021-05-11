const express = require('express');
require("./db/mongoose");
const User = require("./models/user");

const app = express();
const port = process.env.PORT || 3000;

//configuring exporess to automatically parse the incoming json for us,
//so we have it as an objext we can use
app.use(express.json());
app.use(cors());


app.post('/users', (req,res)=> {
    console.log(req.body);
    const user = new User(req.body);
    user.save().then(()=> {
        res.status(201).send(user)}
    ).catch((e)=>{
        res.status(400).send(e);
    });
})

app.get('/users', (req,res)=> {
    User.find({}).then((users)=> {
        res.send(users);
    }).catch((e)=> {
        res.status(500).send()
    });
})

app.listen((port, ()=> {
    console.log("server is up on port " + port);
}))