let express = require('express');
let app = express.Router();
let UserModel = require('../models/user');
let FoodModel = require('../models/food');
let OrderFoodModel = require('../models/orderFood');

app.post("/order-food", async function(req, res){
    try{
        let {foodId, userId} = req.body;
        let food = await FoodModel.findById(foodId);
        let user = await UserModel.findById(userId);
        if (!user || !food){
            res.status(400).send({
                message: "Log in to place order"
            })
        }
        const foodOrder = new OrderFoodModel(req.body);
        await foodOrder.save();
        food.orderId.push(foodOrder._id);
        await food.save();

        return res.status(200).send({
            message: "Food Order Created",
            data: foodOrder,
        })

    }catch(e){
        res.status(500).send(e.message)
    }
});

app.get("/orders", async function (req, res){
    try{
        let order = await OrderFoodModel.find();
        res.json(order);
    }catch(e){
        res.status(500).send(e.message);
    }
})

app.get("/order/:id", async function (req, res){
    try{
        let {id} = req.params;
        let order = await OrderFoodModel.findById(id).populate("foodId userId");
        res.send(order);
    }catch(e){
        res.status(500).send(e.message)
    }
});

app.delete("/")

module.exports = app;