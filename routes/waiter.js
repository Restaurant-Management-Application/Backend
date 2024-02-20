let express = require('express');
let app = express.Router();
let UserModel = require('../models/user');
let AdminModel = require('../models/admin');
let WaiterModel = require('../models/waiter');
let DeliveryPersonnelModel = require('../models/delivery-personnel');
let KitchenStaffModel = require('../models/kitchen-staff');
require("dotenv").config();
const jwt = require("jsonwebtoken");
let verifyToken = require("../middlewares/verifyToken");

app.post("/create-waiter", async function(req, res) {
    const existingWaiter = await WaiterModel.findOne({ email: req.body.email });

    if (existingWaiter) {
        return res.status(200).send({ message: "User already exists" });
    }

    try {
        const newWaiter = new WaiterModel(req.body);
        await newWaiter.save();

            if(req.body.role == "admin"){
                const newAdmin = new AdminModel({user_id:newWaiter._id, email:newWaiter.email })
                await newAdmin.save();
            }

            else if(req.body.role == "user"){
                const newUser = new UserModel({user_id:newWaiter._id, email:newWaiter.email })
                await newUser.save();
            }
            else if(req.body.role == "kitchen-staff"){
                const newKitchenStaff = new KitchenStaffModel({user_id:newWaiter._id, email:newWaiter.email })
                await newKitchenStaff.save();
            }
            else if(req.body.role == "delivery-personnel"){
                const newDeliveryPersonnel = new DeliveryPersonnelModel({user_id:newWaiter._id, email:newWaiter.email })
                await newDeliveryPersonnel.save();
            }
            return res.status(200).send({            
                message: "Waiter created ",
                data: newWaiter,
            });
            
    }catch (e) {
        console.log(e)
        res.status(500).send({message: "Server error"});
    }
});

app.post("/auth/waiter/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return handleError(res, 400, "Email and password are required");

    try {
        const waiter = await WaiterModel.findOne({email,  password });

        if (waiter && waiter.password === password && waiter.email === email) {
            const { password: waiterPassword, ...noPasswordWaiter } = waiter.toObject();
            const token = jwt.sign(
                { noPasswordWaiter },
                process.env.NODE_APP_JWT_SECRET,
                {
                    expiresIn: "24h"
                }
            );

            res.status(200).send({
                status: "success",
                message: "Login successful",
                data: waiter,
                token,
            });
        } else if (!waiter) {
            res.status(404).send({
                status: "error",
                message: "Waiter does not exist",
            });
        } else {
            res.status(400).send({
                status: "error",
                message: "Incorrect Password",
                data: {},
            });
        }
    } catch (err) {
        console.log(err);
        return handleError(res, 500, "Internal error occurred");
    }
});


app.get('/waiters', async function(req, res) {
    try{
        let waiters = await WaiterModel.find();
        res.json(waiters);
    }catch(e){
        res.status(500).send(e.message)
    }
});

app.get("/waiter/:id", async function(req, res) {
    try{
        let {id} = req.params;
        let waiter = await WaiterModel.findById(id);

        const token = waiter.token;
        res.send({ waiter, token });
    }catch(e){
        res.status(500).send(e.message)
    }
})

app.put("/waiter/update/:id", verifyToken, async function(req, res) {
    try{
        let {id} = req.params;

        let updateWaiter = req.body;

        let output = await WaiterModel.findByIdAndUpdate(id, updateWaiter);
        
        if(!output) {
            return res.status(404).send({
                message: 'Waiter does not exist',
            })
        }
        return res.status(200).send({
            message: 'Waited updated',
            data: output,
        })
    }catch(e) {
        res.status(500).send(e.message)
    }
})

app.delete("/waiter/delete/:id", async function(req, res) {
    try{
        let {id} = req.params;

        let deleteWaiter = await WaiterModel.findByIdAndDelete(id);

        res.send(deleteWaiter);

    }catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = app