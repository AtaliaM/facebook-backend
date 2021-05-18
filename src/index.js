const express = require('express');
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./routers/user");
// const postRouter = require("./routers/post");

const app = express();
const port = process.env.PORT || 3000;

//configuring express to automatically parse the incoming json for us,
//so we have it as an object we can use
app.use(express.json());
app.use(cors());

app.use(userRouter);
// app.use(postRouter);

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
})

const bcrypt = require('bcryptjs')

const myFunction = async () => {
    const password = "Red12345!";
    const hashedPassword = await bcrypt.hash(password, 8);

    console.log(password);
    console.log(hashedPassword);

    const isMatch = await bcrypt.compare('Red12345!', hashedPassword);
    console.log(isMatch)

}

myFunction();