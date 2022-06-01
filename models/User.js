const {Schema,model} = require('mongoose')
const userschema = new Schema({name:{type:String, required:true},
        lastname:{type:String, required:true},
        login:{type:String, required:true},
        password:{type:String, required:true},
        email:{type:String, required:true},
        role:{type:String, default: 'User'}
    }
)
module.exports = model('user',userschema)
