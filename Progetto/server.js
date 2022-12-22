const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');

app.set('view engine','ejs');

mongoose.connect('mongodb+srv://provarent:provarent@cluster0.2k797.mongodb.net/biciclette');

//const schema = new mongoose.Schema({
const biciSchema = {
    id : Number,
    modello: String,
    marca: String,
    prezzo: Number,
    descrizione: String
}

const Bici = mongoose.model('Bici', biciSchema);

app.get('/', (req, res) => {
    Bici.find({}, function(err, bicis){
        res.render('index',{
            bicisList: bicis
        })
    })
})

app.listen(4000, function(){
    console.log('server is running');
})