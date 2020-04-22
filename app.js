var express = require("express");
var app     = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/cargoMan",{useNewUrlParser: true,useUnifiedTopology: true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

var containerSchema = new mongoose.Schema({
    length : Number,
    id : Number,
    weight : Number,
    destination : Number
});

var Container = mongoose.model("Container",containerSchema);

var shipSchema = new mongoose.Schema({
    lenShip : Number,
    widShip : Number,
    capShip : Number,
    levShip : Number,
    noDes : Number,
    containers : [containerSchema]
});

var Ship = mongoose.model("Ship",shipSchema);


// Views the new ship form
app.get("/",function(req,res) {
    res.render("home");
});

// adds a ship to the database
app.post("/ship",function(req,res) {
    var lenShip = req.body.lenShip;
    var widShip = req.body.widShip;
    var capShip = req.body.capShip;
    var levShip = req.body.levShip;
    var noDes = req.body.noDes;


    Ship.create({lenShip:lenShip,widShip:widShip,capShip:capShip,levShip:levShip,noDes:noDes},function(err,newShip) {
        if(err) {
            console.log(err);
        }
        else {
            console.log(newShip);
            res.redirect("/ship/" + newShip._id);
        }
    });
});


// views the container form of a ship
app.get("/ship/:id",function(req,res) {
    res.render("container",{id: req.params.id});
});

// adds a container to the ship schema 
app.post("/ship/:id",function(req,res) {
    //res.send("HI");
    Ship.findById(req.params.id,function(err,foundShip) {
        if(err) {
            console.log(err);
        }
        else {
            var length = req.body.length;
            var weight = req.body.weight;
            var destination = req.body.destination;
            var id = req.body.id;

            Container.create({length:length,id:id,weight:weight,destination:destination},function(err,newContainer) {
                if(err) {
                    console.log(err);
                }
                else {
                    foundShip.containers.push(newContainer);
                    foundShip.save();
                    console.log(foundShip);
                    res.redirect("/ship/"+req.params.id);
                }
            });
        }
    });
});

// displays the result
app.get("/ship/:id/result",function(req,res) {

    Ship.findById(req.params.id,function(err,foundShip) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("result",{ship : foundShip})
        }
    });
});

app.listen(3002,'127.0.0.1',function() {
    console.log("Server has started!");
});