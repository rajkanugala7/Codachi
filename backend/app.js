require("dotenv").config();
const express = require("express");
const app = express();
const mongoose=require("mongoose");
const PORT = process.env.PORT;

const Admin=require("./models/Admin");






const url=process.env.MONGO_URL;

mongoose.connect(url).then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err);
})



app.get("/add",async(req,res)=>{
    const newAdmin=new Admin({
         name:"Raj Kanugala",
         password:"Raj@05112002",
         email:"rajkanugala7@gmail.com"
    });
    await newAdmin.save().then(()=>{
        res.send("Admin added");
       console.log("admin added"); 
    }).catch((er)=>{
        res.send(er);
        console.log(er);
    })
    
})




app.listen(PORT, () => {
    console.log("Server is listening to the port",PORT);
})