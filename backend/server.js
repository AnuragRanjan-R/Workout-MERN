require("dotenv").config();

const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");
const requireAuth = require("./middleware/requireAuth");

//express app
const app = express();
app.use(cors());

//middleware
app.use(express.json())

app.use((req,res,next)=>{
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/user', userRoutes);
app.use('/api/workouts', requireAuth, workoutRoutes);

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests only after db connection is successful
        app.listen(process.env.PORT, () => {
            console.log("Connected to DB and listening on port", process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })
