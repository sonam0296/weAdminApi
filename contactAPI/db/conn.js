const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/MERNPractical', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log("Connection successful");
}).catch(()=>{
    console.log("No Connection");
})