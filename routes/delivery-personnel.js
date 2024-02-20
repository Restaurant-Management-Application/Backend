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

app.post("/create-delivery-personnel", async function(req, res) {
    const existingDeliveryPersonnel = await DeliveryPersonnelModel.findOne({ email: req.body.email });

    if (existingDeliveryPersonnel) {
        return res.status(200).send({ message: "User already exists" });
    }

    try {
        const newDeliveryPersonnel = new DeliveryPersonnelModel(req.body);
        await newDeliveryPersonnel.save();

            if(req.body.role == "admin"){
                const newAdmin = new AdminModel({user_id:newDeliveryPersonnel._id, email:newDeliveryPersonnel.email })
                await newAdmin.save();
            }

            else if(req.body.role == "user"){
                const newUser = new UserModel({user_id:newDeliveryPersonnel._id, email:newDeliveryPersonnel.email })
                await newUser.save();
            }
            else if(req.body.role == "kitchen-staff"){
                const newKitchenStaff = new KitchenStaffModel({user_id:newDeliveryPersonnel._id, email:newDeliveryPersonnel.email })
                await newKitchenStaff.save();
            }
            else if(req.body.role == "waiter"){
                const newWaiter = new WaiterModel({user_id:newDeliveryPersonnel._id, email:newDeliveryPersonnel.email })
                await newWaiter.save();
            }
            return res.status(200).send({            
                message: "Delivery Personnel created ",
                data: newDeliveryPersonnel,
            });
            
    }catch (e) {
        console.log(e)
        res.status(500).send({message: "Server error"});
    }
});

app.post("/auth/delivery-personnel/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return handleError(res, 400, "Email and password are required");

    try {
        const deliveryPersonnel = await DeliveryPersonnelModel.findOne({email,  password });

        if (deliveryPersonnel && deliveryPersonnel.password === password && deliveryPersonnel.email === email) {
            const { password: deliveryPersonnelPassword, ...noPasswordDeliveryPersonnel } = deliveryPersonnel.toObject();
            const token = jwt.sign(
                { noPasswordDeliveryPersonnel },
                process.env.NODE_APP_JWT_SECRET,
                {
                    expiresIn: "24h"
                }
            );

            res.status(200).send({
                status: "success",
                message: "Login successful",
                data: deliveryPersonnel,
                token,
            });
        } else if (!deliveryPersonnel) {
            res.status(404).send({
                status: "error",
                message: "Delivery Personnel does not exist",
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


app.get('/delivery-personnels', async function(req, res) {
    try{
        let deliveryPersonnels = await DeliveryPersonnelModel.find();
        res.json(deliveryPersonnels);
    }catch(e){
        res.status(500).send(e.message)
    }
});

app.get("/delivery-personnel/:id", async function(req, res) {
    try{
        let {id} = req.params;
        let deliveryPersonnel = await DeliveryPersonnelModel.findById(id);

        const token = deliveryPersonnel.token;
        res.send({ deliveryPersonnel, token });
    }catch(e){
        res.status(500).send(e.message)
    }
})

app.put("/delivery-personnel/update/:id", verifyToken, async function(req, res) {
    try{
        let {id} = req.params;

        let updateDeliveryPersonnel = req.body;

        let output = await DeliveryPersonnelModel.findByIdAndUpdate(id, updateDeliveryPersonnel);
        
        if(!output) {
            return res.status(404).send({
                message: 'Delivery Personnel does not exist',
            })
        }
        return res.status(200).send({
            message: 'Delivery Personnel updated',
            data: output,
        })
    }catch(e) {
        res.status(500).send(e.message)
    }
})

app.delete("/delivery-personnel/delete/:id", async function(req, res) {
    try{
        let {id} = req.params;

        let deleteDeliveryPersonnel = await DeliveryPersonnelModel.findByIdAndDelete(id);

        res.send(deleteDeliveryPersonnel);

    }catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = app;




// app.post("/auth/delivery-personnel/login", async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         console.log("Email and password are required");
//         return res.status(400).send({
//             status: "error",
//             message: "Email and password are required"
//         });
//     }

//     try {
//         const deliveryPersonnel = await DeliveryPersonnelModel.findOne({ email, password });

//         if (deliveryPersonnel && deliveryPersonnel.password === password && deliveryPersonnel.email === email) {
//             const { password: deliveryPersonnelPassword, ...noPasswordDeliveryPersonnel } = deliveryPersonnel.toObject();
//             const token = jwt.sign(
//                 { noPasswordDeliveryPersonnel },
//                 process.env.NODE_APP_JWT_SECRET,
//                 {
//                     expiresIn: "24h"
//                 }
//             );

//             return res.status(200).send({
//                 status: "success",
//                 message: "Login successful",
//                 data: deliveryPersonnel,
//                 token,
//             });
//         } else if (!deliveryPersonnel) {
//             return res.status(404).send({
//                 status: "error",
//                 message: "Delivery Personnel does not exist",
//             });
//         } else {
//             return res.status(400).send({
//                 status: "error",
//                 message: "Incorrect Password",
//                 data: {},
//             });
//         }
//     } catch (err) {
//         console.log(err);
//         return res.status(500).send({
//             status: "error",
//             message: "Internal error occurred"
//         });
//     }
// });
