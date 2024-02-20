const mongoose = require('mongoose');

const OrderFoodSchema = new mongoose.Schema({
    foodId : {type:String, required:true, ref: "food"},
    userId : {type:String, required:true, ref: "user"},
}, {timestamps:true});

const Orderfood = mongoose.model('order-food', OrderFoodSchema);

module.exports = Orderfood;