const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/facebook-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})



// const me = new User({
//     name: '      Meli',
//     email: "ATALIA@NANA.CO.IL    ",
//     password: "Passwordert5    "
// })

// me.save().then((me) => {
//     console.log(me)
// }).catch((e) => { console.log(e) })