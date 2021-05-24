const express = require('express');
const router = new express.Router();
const Post = require("../models/post");
const auth = require("../middleware/auth");
const { findOneAndDelete } = require('../models/post');

//add post//
router.post("/posts", auth, async (req, res) => {
    // const post = new post(req.body);
    const post = new Post({
        ...req.body, //copiyng all the properties from body
        owner: req.user._id
    })

    try {
        await post.save();
        res.status(201).send(post);
    }
    catch (e) {
        res.status(400).send(e);
    }

    console.log(post);
})

//edit post//
router.patch("/posts/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["postBody"];
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
        // const post = await post.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});

        res.send(post);
    }
    catch (e) {
        res.status(400).send(e);
    }
})

//get all posts of a specific user//
router.get("/posts", auth, async (req, res) => {

    try {
        const posts = await Post.find({ owner: req.user._id });
        res.send(posts);
    }
    catch (e) {
        res.status(500).send();
    }

})

//get a specific user post by id//
router.get("/posts/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // const post = await post.findById(_id);
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

//delete a specific post by id//
router.delete("/posts/:id",auth, async (req, res) => {
    try {
        // const post = await post.findByIdAndDelete(req.params.id);
        const post = await findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if (!post) {
            return res.status(404).send();
        }
        res.send(post);
    }
    catch (e) {
        res.status(500).send(e);
    }
})

module.exports = router;