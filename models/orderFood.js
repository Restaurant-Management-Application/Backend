const mongoose = require('mongoose');

const OrderFoodSchema = new mongoose.Schema({
    foodId : {type:String, required:true, ref: "food"},
    userId : {type:String, required:true, ref: "users"},
    kitchenId : {type:String, required:true, ref : 'kitchen'},
    deliveryId : {type:String, required:true, ref: 'delivery-personnel'},
    location: {type:String, required:true},
    status: {type:String, default: 'In Progress'},
}, {timestamps:true});

const Orderfood = mongoose.model('order-food', OrderFoodSchema);

module.exports = Orderfood;