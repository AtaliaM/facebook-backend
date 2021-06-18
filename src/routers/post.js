const express = require('express');
const router = new express.Router();
const Post = require("../models/post");
const auth = require("../middleware/auth");

defineAddNewPostEndpoint();
defineEditPostEndpoint();
defineGetAllPostsByUserEndpoint();
defineGetSpecificPostByIdEndpoint();
defineDeletePostByIdEndpoint();

function defineAddNewPostEndpoint() {
    return (
        router.post("/posts", auth, async (req, res) => {
            const post = new Post({
                ...req.body, 
                owner: req.user._id
            })
            try {
                await post.save();
                res.status(201).send(post);
            }
            catch (e) {
                res.status(400).send(e);
            }
        })
    )
}

function defineEditPostEndpoint() {
    return (
        router.patch("/posts/:id", auth, async (req, res) => {
            const updates = Object.keys(req.body);
            const allowedUpdates = ["postBody", "postHeader"];
            const isValidOperation = updates.every((update) => {
                return allowedUpdates.includes(update);
            })
        
            if (!isValidOperation) {
                res.status(400).send(({ error: "Invalid update" }));
            }
        
            try {
                // const post = await post.findById(req.params.id);
                const post = await Post.findOne({ _id: req.params.id, owner: req.user._id })
                if (!post) {
                    return res.status(404).send();
                }
                
                updates.forEach((update) => {
                    post[update] = req.body[update];
                })
                await post.save();
                res.send(post);
            }
            catch (e) {
                res.status(400).send(e);
            }
        })
    )
}

function defineGetAllPostsByUserEndpoint() {
    return (
        router.get("/posts/user/:id", async (req, res) => {
        const userId = req.params.id;
            try {
                const posts = await Post.find({ owner: userId });
                res.send(posts);
            }
            catch (e) {
                res.status(500).send();
            }
        
        })
    )
}

//get all user posts endpoint with auth//
// function defineGetAllPostsByUserEndpoint() {
//     return (
//         router.get("/posts", auth, async (req, res) => {
        
//             try {
//                 const posts = await Post.find({ owner: req.user._id });
//                 res.send(posts);
//             }
//             catch (e) {
//                 res.status(500).send();
//             }
        
//         })
//     )
// }

function defineGetSpecificPostByIdEndpoint() {
    return (
        router.get("/posts/:id", auth, async (req, res) => {
            const _id = req.params.id;
        
            try {
                const post = await Post.findOne({ _id, owner: req.user._id })
                if (!post) {
                    return res.status(404).send();
                }
                res.send(post);
            }
            catch (e) {
                res.status(500).send();
            }
        
        })
    )
}

function defineDeletePostByIdEndpoint() {
    return (
        router.delete("/posts/:id",auth, async (req, res) => {
            try {
                const post = await Post.findOneAndDelete({_id: req.params.id, owner: req.user._id})
                if (!post) {
                    return res.status(404).send();
                }
                res.send(post);
            }
            catch (e) {
                res.status(500).send(e);
            }
        })
    )
}

module.exports = router;