const mongoose = require('mongoose');

const DeliveryPersonnelSchema = new mongoose.Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type:String, required:true},
    role: {type:String, default: ''}
}, {timestamps:true})

const DeliveryPersonnel = mongoose.model('delivery-personnel', DeliveryPersonnelSchema);
module.exports = DeliveryPersonnel;