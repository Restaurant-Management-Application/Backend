let express = require('express');
let app = express.Router();
let UserModel = require('../models/user');
let AdminModel = require('../models/admin');
let WaiterModel = require('../models/waiter');
let DeliveryPersonnelModel = require('../models/delivery-personnel');
let KitchenStaffModel = require('../models/kitchen-staff');
require("dotenv").config();
const jwt = require("jsonwebtoken");
// let verifyToken = require("../middlewares/verifyToken");

app.post("/create-admin", async function(req, res) {
    const existingAdmin = await AdminModel.findOne({ email: req.body.email });

    if (existingAdmin) {
        return res.status(200).send({ message: "Admin already exists" });
    }

    try {
        const newAdmin = new AdminModel(req.body);
        await newAdmin.save();

            if(req.body.role == "user"){
                const newUser = new UserModel({user_id:newAdmin._id, email:newAdmin.email })
                await newUser.save();
            }
            else if(req.body.role == "waiter"){
                const newWaiter = new WaiterModel({user_id:newAdmin._id, email:newAdmin.email })
                await newWaiter.save();
            }
            else if(req.body.role == "kitchen-staff"){
                const newKitchenStaff = new KitchenStaffModel({user_id:newAdmin._id, email:newAdmin.email })
                await newKitchenStaff.save();
            }
            else if(req.body.role == "delivery-personnel"){
                const newDeliveryPersonnel = new DeliveryPersonnelModel({user_id:newAdmin._id, email:newAdmin.email })
                await newDeliveryPersonnel.save();
            }
            return res.status(200).send({            
                message: "Admin created ",
                data: newAdmin
            });
            
    }catch (e) {
        console.log(e)
        res.status(500).send({message: "Server error"});
    }
});

app.post("/auth/admin/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return handleError(res, 400, "Email and password are required");

    try {
        const admin = await AdminModel.findOne({email,  password });
        // console.log(admin.password)

        if (admin && admin.password === password && admin.email === email) {
            const { password: adminPassword, ...noPasswordAdmin } = admin.toObject();
            const token = jwt.sign(
                { noPasswordAdmin },
                process.env.NODE_APP_JWT_SECRET,
                {
                    expiresIn: "24h"
                }
            );

            res.status(200).send({
                status: "success",
                message: "Login successful",
                data: admin,
                token,
            });
        } else if (!admin) {
            res.status(404).send({
                status: "error",
                message: "Admin does not exist",
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


app.get('/admin', async function(req, res) {
    try{
        let admin = await AdminModel.find();
        res.json(admin);
    }catch(e){
        res.status(500).send(e.message)
    }
});



module.exports = app





// app.delete("/admin/delete/:id", async function(req, res) {
//     try{
//         let {id} = req.params;

//         let deleteAdmin = await AdminModel.findByIdAndDelete(id);

//         res.send(deleteAdmin);

//     }catch(e){
//         res.status(500).send(e.message)
//     }
// })