const express = require('express');
const cors = require("cors");
try {
    require("./db/mongoose");
    console.log("success")
} catch(e) {
    console.log("fail");
}
const userRouter = require("./routers/user");
const postRouter = require("./routers/post");

const app = express();
const port = process.env.PORT || 7000;
console.log(process.env.NODE_ENV);
const host = '0.0.0.0';

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(postRouter);

app.listen(port, host, () => {
    console.log(`server is up on port ${port}`);
})

