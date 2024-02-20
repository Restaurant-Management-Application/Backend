const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    name: {type:String, required:true},
    categoryId: {type:String, ref:"food-category"},
    desc: {type:String, required:true},
    price: {type:String, required:true},
    orderId: [{type:mongoose.Schema.Types.ObjectId, ref:"order"}],
}, {timestamps:true});

const Food = new mongoose.model('food', FoodSchema); 
module.exports = Food;