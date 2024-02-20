let express = require('express');
let app = express.Router();
let FoodCategoryModel = require('../models/foodCategory');
let KitchenStaffModel = require('../models/kitchen-staff');
let FoodModel = require('../models/food');

app.post('/create-food-category', async (req, res) => {
    // if (!req.user) {
    //     return res.status(401).send({ message: 'Unauthorized' });
    // }

    // const kitchenStaff = await KitchenStaffModel.findOne({ _id: req.user._id });
    // if (!kitchenStaff) {
    //     return res.status(403).send({ message: 'Only kitchen staff can create food categories.' });
    // }

    // const existingfoodcategory = await FoodCategoryModel.findOne({name: req.body.name});

    // if (existingfoodcategory){
    //     return res.status(200).send({message: 'Category already exist'})
    // }
    try{
        let {kitchenId} = req.body;
        let kitchen = await KitchenStaffModel.findById(kitchenId);
        // console.log(kitchen)
        if(!kitchen){
            return res.status(403).send({message: "Incorrect kitchen staff id"});
        }
        const newFoodCategory = new FoodCategoryModel(req.body);
        // console.log(newFoodCategory)
        await newFoodCategory.save();

        return res.status(200).send({
            message: "Category Created",
            data: newFoodCategory,
        })
    }catch(e){
        console.log(e)
        res.status(500).send({
            message: 'Server Error'
        })
        }
});


app.get('/food-categories', async function(req, res) {
    try {
        let foodCategories = await FoodCategoryModel.find();
        res.json(foodCategories);
    } catch(e) {
        res.status(500).send(e.message);
    }
});


app.get('/food-category/:id', async function(req, res) {
    try{
        let {id} = req.params;
        let foodCategory = await FoodCategoryModel.findById(id).populate("foodId");
        // let foodItems = await FoodModel.find({ categoryId: id }); 
        // console.log(foodItems);
        
        // foodCategory.foodItems = foodItems;
        res.json(foodCategory);
    }catch(e){
        res.status(500).send(e.message);
    }
});

app.put('/food-category/update/:id', async function(req, res){
    try{
        let { kitchenId } = req.body;
        let kitchen = await KitchenStaffModel.findById(kitchenId);
        
        if (!kitchen) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        
        let {id} = req.params;

        // let result = await new FoodCategoryModel.findByIdAndUpdate(id, req.body);
        let updateFoodCategory = req.body;
        let result = await FoodCategoryModel.findByIdAndUpdate(id, updateFoodCategory);

        if(!result){
            return res.status(404).send({message: "This Category does not exist"})
        }
        return res.status(200).send({
            message: "Food Category updated successfully"
        })
    }catch(e){
        res.status(500).send(e.message)
    }
});


app.delete('/food-category/delete/:id', async function(req, res){
    try{
        let { kitchenId } = req.body;
        let kitchen = await KitchenStaffModel.findById(kitchenId);
        
        if (!kitchen) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        let {id} = req.params;
        let deleteFoodCategory = await FoodCategoryModel.findByIdAndDelete(id);
        res.send(deleteFoodCategory);
    }catch(e){
        res.status(500).send(e.message)
    }
});


module.exports = app;