const mongoose = require('mongoose');

let MONGODB_URI = process.env.ATLAS_URI || "mongodb://127.0.0.1:27017/facebook-api";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})


// const me = new User({
//     name: '      Meli',
//     email: "ATALIA@NANA.CO.IL    ",
//     password: "Passwordert5    "
// })

// me.save().then((me) => {
//     console.log(me)
// }).catch((e) => { console.log(e) })