const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: {type:String, required:true},
    email: {type:String, required:true},
    phone: {type:String, required:true},
    password: {type:String, required:true},
    role: {type:String, required:true, default:'user'},
    orderId: [{type:mongoose.Schema.Types.ObjectId, ref:"order"}]
}, {timestamps:true});

const User = mongoose.model('users', UserSchema);
module.exports = User;

