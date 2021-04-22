const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
        // unique:true
    },
    mobile:{
        type: String,
        required: true
    },
    message:{
        type: String,
        // required: true
    }
})

const model = mongoose.model('ContactSchema', ContactSchema)
module.exports = model