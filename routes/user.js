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

app.post("/create-user", async function(req, res) {
    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (existingUser) {
        return res.status(200).send({ message: "User already exists" });
    }

    try {
        const newUser = new UserModel(req.body);
        await newUser.save();
        // const { password: adminPassword, ...noPasswordAdmin } = newUser.toObject();
        //     const token = jwt.sign(
        //         {noPasswordAdmin},
        //         process.env.NODE_APP_JWT_SECRET,
        //         {
        //             expiresIn: "24h"
        //         }
        //     );

            // newUser.token = token; //this help to save the token to the user doc
            // await newUser.save();

            if(req.body.role == "admin"){
                const newAdmin = new AdminModel({user_id:newUser._id, email:newUser.email })
                await newAdmin.save();
            }
            else if(req.body.role == "waiter"){
                const newWaiter = new WaiterModel({user_id:newUser._id, email:newUser.email })
                await newWaiter.save();
            }
            else if(req.body.role == "kitchen-staff"){
                const newKitchenStaff = new KitchenStaffModel({user_id:newUser._id, email:newUser.email })
                await newKitchenStaff.save();
            }
            else if(req.body.role == "delivery-personnel"){
                const newDeliveryPersonnel = new DeliveryPersonnelModel({user_id:newUser._id, email:newUser.email })
                await newDeliveryPersonnel.save();
            }
            return res.status(200).send({            
                message: "User created ",
                data: newUser,
            });
            
    }catch (e) {
        console.log(e)
        res.status(500).send({message: "Server error"});
    }
});

app.post("/auth/user/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return handleError(res, 400, "Email and password are required");

    try {
        const user = await UserModel.findOne({email,  password });
        // console.log(admin.password)

        if (user && user.password === password && user.email === email) {
            const { password: userPassword, ...noPasswordUser } = user.toObject();
            const token = jwt.sign(
                { noPasswordUser },
                process.env.NODE_APP_JWT_SECRET,
                {
                    expiresIn: "24h"
                }
            );

            res.status(200).send({
                status: "success",
                message: "Login successful",
                data: user,
                token,
            });
        } else if (!user) {
            res.status(404).send({
                status: "error",
                message: "User does not exist",
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


app.get('/users', async function(req, res) {
    try{
        let users = await UserModel.find();
        res.json(users);
    }catch(e){
        res.status(500).send(e.message)
    }
});

app.get("/user/:id", async function(req, res) {
    try{
        let {id} = req.params;
        let user = await UserModel.findById(id);

        // res.send(user)
        const token = user.token;
        res.send({ user, token });
    }catch(e){
        res.status(500).send(e.message)
    }
})

app.put("/user/update/:id", verifyToken, async function(req, res) {
    try{
        let {id} = req.params;

        let updateUser = req.body;

        let output = await UserModel.findByIdAndUpdate(id, updateUser);
        
        if(!output) {
            return res.status(404).send({
                message: 'User does not exist',
            })
        }
        return res.status(200).send({
            message: 'User updated',
            data: output,
        })
    }catch(e) {
        res.status(500).send(e.message)
    }
})

app.delete("/user/delete/:id", async function(req, res) {
    try{
        let {id} = req.params;

        let deleteUser = await UserModel.findByIdAndDelete(id);

        res.send(deleteUser);

    }catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = app