const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    brand:{
        type: String,
        required: true
        // unique:true
    },
    quantity:{
        type: Number,
        required: true
    },
    size:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        // required: true
    }
})

const model = mongoose.model('ContactSchema', ContactSchema)
module.exports = model