//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const exp = require("constants");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const { stringify } = require("querystring");

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});


app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err) {
        if (!err) {
            console.log("New user saved");
            res.render("secrets");
        } else {
            console.log(err);
        };
    });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function(err, result) {
        if (!err) {
            if (result) {
                if (result.password === password) {
                    res.render("secrets");

                } else {
                    res.send("User e/o password errate");
                }
            } else {
                res.send("Utente non registrato");
            }
        } else {
            console.log(err);
        }
    });
});

//______________________________________________________//

app.listen(3000, function() {
    console.log("Server started on port 3000");
});