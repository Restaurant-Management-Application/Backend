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

app.post("/create-kitchen-staff", async function(req, res) {
    const existingkitchenstaff = await KitchenStaffModel.findOne({ email: req.body.email });

    if (existingkitchenstaff) {
        return res.status(200).send({ message: "Kitchen STaff already exists" });
    }

    try {
        const newkitchenstaff = new KitchenStaffModel(req.body);
        await newkitchenstaff.save();

            if(req.body.role == "admin"){
                const newAdmin = new AdminModel({user_id:newkitchenstaff._id, email:newkitchenstaff.email })
                await newAdmin.save();
            }

            else if(req.body.role == "user"){
                const newUser = new UserModel({user_id:newkitchenstaff._id, email:newkitchenstaff.email })
                await newUser.save();
            }
            else if(req.body.role == "waiter"){
                const newWaiter = new WaiterModel({user_id:newkitchenstaff._id, email:newkitchenstaff.email })
                await newWaiter.save();
            }
            else if(req.body.role == "delivery-personnel"){
                const newDeliveryPersonnel = new DeliveryPersonnelModel({user_id:newkitchenstaff._id, email:newkitchenstaff.email })
                await newDeliveryPersonnel.save();
            }
            return res.status(200).send({            
                message: "Kitchen Staff created ",
                data: newkitchenstaff,
            });
            
    }catch (e) {
        console.log(e)
        res.status(500).send({message: "Server error"});
    }
});

app.post("/auth/kitchen-staff/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return handleError(res, 400, "Email and password are required");

    try {
        const kitchenStaff = await KitchenStaffModel.findOne({email,  password });

        if (kitchenStaff && kitchenStaff.password === password && kitchenStaff.email === email) {
            const { password: kitchenStaffPassword, ...noPasswordKitchenStaff } = kitchenStaff.toObject();
            const token = jwt.sign(
                { noPasswordKitchenStaff },
                process.env.NODE_APP_JWT_SECRET,
                {
                    expiresIn: "24h"
                }
            );

            res.status(200).send({
                status: "success",
                message: "Login successful",
                data: kitchenStaff,
                token,
            });
        } else if (!waiter) {
            res.status(404).send({
                status: "error",
                message: "Kitchen Staff does not exist",
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


app.get('/kitchen-staff', async function(req, res) {
    try{
        let kitchenStaff = await KitchenStaffModel.find();
        res.json(kitchenStaff);
    }catch(e){
        res.status(500).send(e.message)
    }
});

app.get("/kitchen-staff/:id", async function(req, res) {
    try{
        let {id} = req.params;
        let kitchenStaff = await KitchenStaffModel.findById(id).populate('orderId');

        const token = kitchenStaff.token;
        res.send({ kitchenStaff, token });
    }catch(e){
        res.status(500).send(e.message)
    }
})

app.put("/kitchen-staff/update/:id", verifyToken, async function(req, res) {
    try{
        let {id} = req.params;

        let updateKitchenStaff = req.body;

        let output = await KitchenStaffModel.findByIdAndUpdate(id, updateKitchenStaff);
        
        if(!output) {
            return res.status(404).send({
                message: 'Kitchen Staff does not exist',
            })
        }
        return res.status(200).send({
            message: 'Kitchen Staff updated',
            data: output,
        })
    }catch(e) {
        res.status(500).send(e.message)
    }
})

app.delete("/kitchen-staff/delete/:id", async function(req, res) {
    try{
        let {id} = req.params;

        let deleteKitchenStaff = await KitchenStaffModel.findByIdAndDelete(id);

        res.send(deleteKitchenStaff);

    }catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = app