const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

//register/add new user//
router.post('/users', async (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user,token});
    }
    catch (e) {
        res.status(400).send(e);
    }
})

//login user//
router.post('/users/login', async (req,res)=> {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch(e) {
        res.status(400).send();
    }
})

//logout user//
router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token)=> {
            return token.token !== req.token;
        })

        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send()
    }
})

//logout user fron all devices//
router.post('/users/logoutAll', auth, async (req,res) => {
    try {
        req.user.tokens = [];

        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send()
    }
})

//fetching all users-for dev purposes//
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send();
    }
    
})

//my profile//
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})


// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send();
//     }

// })

//update my profile//
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'password', 'email', 'age'];
    const isValidOperation = updates.every((update)=> {
        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid Updates"});
    }

    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        updates.forEach((update)=> {
            req.user[update] = req.body[update];
        })
        await req.user.save();

        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }

})

//delete my profile//
router.delete('/users/me', auth, async (req,res)=> {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch(e) {
        res.status(500).send()
    }
})


module.exports = router;