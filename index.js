const express = require ('express');
const mongoose = require ('mongoose');
const bodyParser = require ('body-parser');
const dotenv = require('dotenv');

const app = express();
dotenv.config();


const port = process.env.PORT || 3000;


require('dotenv').config();

// Get the MongoDB connection URL from the environment variable
const dbURL = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

// Rest of your connection handling code
const db = mongoose.connection;
db.on('connected', () => {
    console.log(`Connected to MongoDB at ${dbURL}`);
});
db.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});
db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
//schema
const regisrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

//mondels
const Registration = mongoose.model("Registration", regisrationSchema);
app.use(bodyParser.urlencoded({extended: true}));  //the data is very hard for manual reding we can use body parser
app.use(bodyParser.json());

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/pages/index.html");
})
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Registration.findOne({ email: email });

        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.send(`
                <html>
                    <head>
                        <style>
                            body {
                                background-color: #e6f7ff;
                                text-align: center;
                                padding: 20px;
                            }
                            h2 {
                                color: #007bff;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>Successfully submitted the data</h2>
                    </body>
                </html>
            `);
        } else {
            res.send(`
                <html>
                    <head>
                        <style>
                            body {
                                background-color: #ffe6e6;
                                text-align: center;
                                padding: 20px;
                            }
                            h2 {
                                color: #ff0000;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>User already exists</h2>
                    </body>
                </html>
            `);
        }

    } catch (error) {
        console.log("Error while registration:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, ()=>{
    console.log("server started")
})