const mongoose = require('mongoose');

const FoodCategorySchema = new mongoose.Schema({
    name: {type:String, required:true},
    kitchenId: {type:String, ref:"kitchen"},
    foodId : [{type: mongoose.Schema.Types.ObjectId, ref:"food"}],
}, {timestamps:true});


const FoodCategory = mongoose.model('food-category', FoodCategorySchema);
module.exports = FoodCategory;