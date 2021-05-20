const express = require('express');
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./routers/user");
const postRouter = require("./routers/post");

const app = express();
const port = process.env.PORT || 3000;

//configuring express to automatically parse the incoming json for us,
//so we have it as an object we can use
app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(postRouter);

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
})

const jwt = require('jsonwebtoken')

const myFunction = async () => {
    const token = jwt.sign({ _id: '123abcde' }, 'thisismynewcourse');

    console.log(token);

    const data = jwt.verify(token, 'thisismynewcourse');
    console.log(data);
}

myFunction();