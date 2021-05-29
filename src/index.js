const express = require('express');
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./routers/user");
const postRouter = require("./routers/post");

const app = express();
const port = process.env.PORT || 7000;
console.log(process.env.NODE_ENV);
const host = '0.0.0.0';

//configuring express to automatically parse the incoming json for us,
//so we have it as an object we can use
app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(postRouter);

app.listen(port, host, () => {
    console.log(`server is up on port ${port}`);
})

