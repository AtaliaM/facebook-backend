const express = require('express');
const cors = require("cors");
require("./db/mongoose");
const User = require("./models/user");
const { findByIdAndUpdate } = require('./models/user');


const app = express();
const port = process.env.PORT || 3000;

//configuring exporess to automatically parse the incoming json for us,
//so we have it as an objext we can use
app.use(express.json());
app.use(cors());


app.post('/users', async (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }

    // user.save().then(()=> {
    //     res.status(201).send(user)}
    // ).catch((e)=>{
    //     res.status(400).send(e);
    // });
})

app.get('/users', async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send();
    }
    // User.find({}).then((users)=> {
    //     res.send(users);
    // }).catch((e)=> {
    //     res.status(500).send()
    // });
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }

    // User.findById(_id).then((user)=> {
    //     if (!user) {
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e)=> {
    //     res.status(500).send();
    // })
})

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'password', 'email', 'age'];
    const isValidOperation = updates.every((update)=> {
        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid Updates"});
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }

})

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
})