const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    fullname: {type:String, required:true},
    phone: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    role: {type:String, default:'admin'}
}, {timestamps:true})

const Admin = mongoose.model('admin', AdminSchema);
module.exports = Admin;