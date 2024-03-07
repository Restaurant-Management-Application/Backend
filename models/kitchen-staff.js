const mongoose = require('mongoose')

const KitchenStaffSchema = new mongoose.Schema({
    fullname: {type:String, required:true},
    email: {type:String, required:true},
    phone: {type:String, required:true},
    password: {type:String, required:true},
    role: {type:String, default: 'kitchen-staff'},
    orderId: [{type:mongoose.Schema.Types.ObjectId, ref:'order-food'}],
}, {timestamps:true});

const KitchenStaff = mongoose.model('kitchen', KitchenStaffSchema);
module.exports = KitchenStaff;
