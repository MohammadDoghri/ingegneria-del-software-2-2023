var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//const schema = new mongoose.Schema({
//const biciSchema = {}
    
bikeSchema = new Schema( {
	//id : Number,
    Modello: String,
    Marca: String,
    Prezzo: Number,
    Descrizione: String,
    Stato: Boolean
}),
Bike = mongoose.model('Bike', bikeSchema);

module.exports = Bike;
