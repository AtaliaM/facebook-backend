const express = require('express');
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./routers/user");
const postRouter = require("./routers/post");

const app = express();
const port = process.env.PORT || 7000;
const environment = process.env.NODE_ENV || 'prod';
console.log(environment);
console.log(process.env.NODE_ENV);
const host = '0.0.0.0';

if (process.env.NODE_ENV === 'prod') {
    // Exprees will serve up production assets
    app.use(express.static('client/build'));
  
    // Express serve up index.html file if it doesn't recognize route
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

//configuring express to automatically parse the incoming json for us,
//so we have it as an object we can use
app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(postRouter);

app.listen(port, host, () => {
    console.log(`server is up on port ${port}`);
})

