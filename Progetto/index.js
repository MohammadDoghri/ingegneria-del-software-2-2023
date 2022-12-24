/*const mongoose = require("mongoose");

try{

    mongoose.connect("mongodb+srv://provarent:provarent@cluster0.2k797.mongodb.net/biciclette");

}catch{
    console.log("err");
}


const schema = new mongoose.Schema({
    id : Number,
    modello: String,
    marca: String,
    prezzo: Number,
    descrizione: String
});


const Model = mongoose.model("bici", schema);

const insertBici = async(obj) =>{
    const user = new Model(obj);

    await user.save();
}


insertBici({
    id : 6,
    modello: "sadwefsefg",
    marca: "sdeqweqwewqe",
    prezzo: 1233,
    descrizione: "sdfwertertsrgrth"
})
*/