let express = require('express');
let app = express.Router();
let UserModel = require('../models/user');
let FoodModel = require('../models/food');
let OrderFoodModel = require('../models/orderFood');
let KitchenModel = require('../models/kitchen-staff');
let DeliveryModel = require('../models/delivery-personnel');

app.post("/order-food", async function(req, res){
    try{
        let {foodId, userId, kitchenId, deliveryId} = req.body;
        let food = await FoodModel.findById(foodId);
        let user = await UserModel.findById(userId);
        let kitchen = await KitchenModel.findById(kitchenId);
        let delivery = await DeliveryModel.findById(deliveryId);
        if (!user || !food || !kitchen || !delivery){
            return res.status(400).send({
                message: "Bad request"
            })
        }
        const foodOrder = new OrderFoodModel(req.body);
        await foodOrder.save();
        food.orderId.push(foodOrder._id);
        await food.save();

        kitchen.orderId.push(foodOrder._id);
        await kitchen.save();

        delivery.orderId.push(foodOrder._id);
        await delivery.save();

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

app.put("/order/update/:id", async function(req, res){
    try{
        let {id} = req.params;
        let updateOrder = await OrderFoodModel.findByIdAndUpdate(id, req.body);
        if(!updateOrder) {
            return res.status(404).send({
                message: "Order does not exist"
            })
        }
        return res.status(200).send({
            message: 'Order status updated',
            data: updateOrder,
        })
    }catch(e){
        res.status(500).send(e.message)
    }
})

app.delete("/cancel-order/:id", async function(req, res){
    try{
        let {id} = req.params;
        let cancelOrder = await OrderFoodModel.findByIdAndDelete(id);
        res.send(cancelOrder);
    }catch(e){
        res.status(500).send(e.message)
    }
});

module.exports = app;