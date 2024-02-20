const mongoose = require('mongoose');

const WaiterSchema = new mongoose.Schema({
    fullname: {type:String, required:true},
    email: {type:String, required:true},
    phone: {type:String, required:true},
    password: {type:String, required:true},
    role: {type:String, default: ''}
}, {timestamps:true});

const Waiter = mongoose.model('waiter', WaiterSchema);
module.exports = Waiter;