let express = require('express');
let app = express.Router();
let FoodCategoryModel = require('../models/foodCategory');
let FoodModel = require('../models/food');

app.post('/create-food', async function(req, res){
    try{
        let {categoryId} = req.body;
        let category = await FoodCategoryModel.findById(categoryId);
        if(!category){
            return res.status(403).send({
                message: "Bad Request"
            })
        }

         const newFood = new FoodModel(req.body);
         await newFood.save();
         category.foodId.push(newFood._id);
         await category.save();

         return res.status(200).send({
             message: "Food Created",
             data: newFood,
})

    }catch(e){
        res.status(500).send(e.message)
    }
});

app.get('/food', async function(req, res){
    try{
        let food = await FoodModel.find();
        res.json(food);

    }catch(e){
        res.status(500).send(e.message)
    }
});

app.get('/food/:id', async function(req, res){
    try{
        let {id} = req.params;
        let food = await FoodModel.findById(id).populate("categoryId");
        // console.log(food)
        res.send(food);
    }catch(e){
        res.status(500).send(e.message)
    }
});

app.put('/food/update/:id', async function(req, res){
    try{
        let {id} = req.params;
        let updateFood = await FoodModel.findByIdAndUpdate(id, req.body);
        if(!updateFood) {
            return res.status(404).send({
                message: "Food does not exist"
            })
        }
        return res.status(200).send({
            message: "Food details updated",
            data: updateFood,
        })

    }catch(e){
        res.status(500).send(e.message)
    }
});

app.delete('/food/delete/:id', async function(req, res){
    try{
        let {id} = req.params;
        let deleteFood = await FoodModel.findByIdAndDelete(id);
        res.json(deleteFood);
    }catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = app;