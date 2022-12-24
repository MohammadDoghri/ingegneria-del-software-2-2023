const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb+srv://provarent:provarent@cluster0.2k797.mongodb.net/biciclette");

const provaSchema = new mongoose.Schema({
    Modello: String,
    Marca: String,
    Prezzo: String,
    Descrizione: String
})

const prova = mongoose.model("bike", provaSchema);

app.post("/",function(req, res){
    let newprova = new prova({
        Modello: req.body.modello,
        Marca: req.body.marca,
        Prezzo: req.body.prezzo,
        Descrizione: req.body.descrizione
    });
    newprova.save();
    res.redirect('/');
})

app.get("/",function(req,res){
    res.sendFile(__dirname + "/inseriscibici.html");
})

app.listen(3000, function(){
    console.log("server is running on 3000");
})
