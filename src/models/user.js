const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        // required : true
    }, 
    phone: {
        type: Number,
        // required : true
    }, 
    email: {
          type: String,
          unique: true,
          required : true
      }, 

      password:{
          type: String,
          required: true
      }
},
{
    collection: 'users'
} 
)
  

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model