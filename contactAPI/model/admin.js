const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        // required : true
    },
    // phone: {
    //     type: Number,
    //     // required : true
    // }, 
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }

},
    {
        collection: 'admin'
    }
)

const model = mongoose.model('AdminSchema', AdminSchema)
module.exports = model