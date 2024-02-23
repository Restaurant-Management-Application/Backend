const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
// const whatsappClient = require("./services/whatsappClient")


// whatsappClient.initialize()
const cors = require("cors");
const PORT = process.env.PORT || 7000;

// const merchant = require("./models/merchant")
const admin = require("./routes/admin")
// const category = require("../Backend/routes/category")
const kitchenStaff = require("./routes/kitchen-staff");
const deliveryPersonnel = require("./routes/delivery-personnel");
const user = require("./routes/user");
const waiter = require("./routes/waiter");
const foodCategory = require("./routes/food-category");
const food = require("./routes/food");
const orderFood = require("./routes/orderFood");

// const authRoute = require("../Backend/controllers/auth.admin.login")

const { default: mongoose } = require("mongoose");
require("dotenv").config()

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());  // cors enables to actualise secure connection between the frontend and the server

app.use("/", food);
app.use("/", admin);
app.use("/", foodCategory);
app.use("/", kitchenStaff );
app.use("/", deliveryPersonnel);
app.use("/", user);
app.use("/", waiter);
app.use("/", orderFood);

const URI = process.env.MONGO_URL;

mongoose.connect(URI, 
  { useNewUrlParser: true, 
    useUnifiedTopology: true, 
    family: 4 
  })
  .then(() => {
    console.log("Database Connected");
    // Your code here
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });

app.listen(PORT, ()=> {
    console.log(`Running on http://localhost:${PORT}`)
})