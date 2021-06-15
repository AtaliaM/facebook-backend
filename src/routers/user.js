const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

defineRegisterUserEndpoint();
defineLoginUserEndpoint();
definelogoutUserEndpoint();
defineLogoutAllDevicesUserEndpoint();
defineGetAllUsersEndpoint();
defineGetUserProfileEndpoint();
defineGetUserByPathEndpoint();
defineGetUserByIdEndpoint();
defineAddToMyFollowingEndpoint();
defineRemoveUserFromMyFollowingEndpoint();
defineUpdateMyProfileEndpoint();
defineDeleteMyProfileEndpoint();

function defineRegisterUserEndpoint() {
    return (
        router.post('/users', async (req, res) => {
            //creating user's path//
            const path = `${req.body.firstName}-${new Date().getTime()}`;
            const userObj = { ...req.body, path };
            const user = new User(userObj);
            try {
                await user.save();
                const token = await user.generateAuthToken();
                res.status(201).send({ user, token });
            }
            catch (e) {
                res.status(400).send(e);
            }
        })
    )
}


function defineLoginUserEndpoint() {
    return (
        router.post('/users/login', async (req, res) => {
            try {
                const user = await User.findByCredentials(req.body.email, req.body.password);
                const token = await user.generateAuthToken();
                res.send({ user, token });
            } catch (e) {
                res.status(400).send("one or more of your credentials is incorrect");
            }
        })
    )
}

function definelogoutUserEndpoint() {
    return (
        router.post('/users/logout', auth, async (req, res) => {
            try {
                req.user.tokens = req.user.tokens.filter((token) => {
                    return token.token !== req.token;
                })
        
                await req.user.save();
                res.send();
            } catch (e) {
                res.status(500).send()
            }
        })
    )
}

function defineLogoutAllDevicesUserEndpoint() {
    return (
        router.post('/users/logoutAll', auth, async (req, res) => {
            try {
                req.user.tokens = [];
                await req.user.save();
                res.send();
            } catch (e) {
                res.status(500).send()
            }
        })
    )
}

function defineGetAllUsersEndpoint() {
    return (
        router.get('/users', async (req, res) => {
            try {
                const users = await User.find({});
                res.send(users);
            } catch (e) {
                res.status(500).send();
            }
        })
    )
}

function defineGetUserProfileEndpoint() {
    return (
        router.get('/users/me', auth, async (req, res) => {
            res.send(req.user);
        })
    )
}

function defineGetUserByPathEndpoint() {
    return (
        router.get('/users/:path', async (req, res) => {
            const path = req.params.path;
            try {
                const user = await User.find({ path });
                // const user = await User.findById(_id);
                if (!user) {
                    return res.status(404).send("User not found");
                }
                res.send(user);
            } catch (e) {
                res.status(500).send();
            }
        })
    )
}

function defineGetUserByIdEndpoint() {
    return (
        router.get('/users/:id', async (req, res) => {
            const _id = req.params.id;
            try {
                const user = await User.findById(_id);
                if (!user) {
                    return res.status(404).send("User not found");
                }
                res.send(user);
            } catch (e) {
                res.status(500).send();
            }
        })
    )
}

function defineAddToMyFollowingEndpoint() {
    return (
        router.patch('/users/me/followUser', auth, async (req, res) => {
            const path = req.body.path;
            try {
                // const userToFollow = await User.find({ path });
                const userToFollow = await User.findOneAndUpdate({ path }, 
                    {$addToSet: {myFollowers: {userId: req.user._id}}});
                if (!userToFollow) {
                    return res.status(404).send("User not found");
                }
                await req.user.updateOne(
                    { $addToSet: { usersIFollow: { userId: userToFollow._id } } }
                );
                res.send(req.user);
        
            } catch (e) {
                res.status(400).send(e);
            }
        })
    )
}

function defineRemoveUserFromMyFollowingEndpoint() {
    return (
        router.patch('/users/me/unfollowUser', auth, async (req, res) => {
            const path = req.body.path;
            try {
                const userToUnfollow = await User.findOneAndUpdate({ path }, 
                    { $pull: { myFollowers: { userId: req.user._id } } });
                if (!userToUnfollow) {
                    return res.status(404).send("User not found");
                }
                await req.user.updateOne(
                    { $pull: { usersIFollow: { userId: userToUnfollow._id } } }
                );
                res.send(req.user);
        
            } catch (e) {
                res.status(400).send(e);
            }
        })
    )
}


function defineUpdateMyProfileEndpoint() {
    return (
        router.patch('/users/me', auth, async (req, res) => {
            const updates = Object.keys(req.body);
            const allowedUpdates = ['firstName', 'lastName', 'password', 'email', 'age'];
            const isValidOperation = updates.every((update) => {
                return allowedUpdates.includes(update);
            })
        
            if (!isValidOperation) {
                return res.status(400).send({ error: "Invalid Updates" });
            }
        
            try {
                // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
                updates.forEach((update) => {
                    req.user[update] = req.body[update];
                })
                await req.user.save();
                res.send(req.user);
            } catch (e) {
                res.status(400).send(e);
            }
        })
    )
}

function defineDeleteMyProfileEndpoint() {
    return (
        router.delete('/users/me', auth, async (req, res) => {
            try {
                await req.user.remove();
                res.send(req.user);
            } catch (e) {
                res.status(500).send()
            }
        })
    )
}


module.exports = router;