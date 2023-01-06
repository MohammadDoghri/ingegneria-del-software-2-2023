//import the Bike model
const Bike = require('../models/bike');
const assert = require('assert');
  
describe('Creating documents in MongoDB', () => {
    it('Creates a New Bike', (done) => {
        const newBike = new Bike({ 
                                Modello: 'ModelloTest',
                                Marca : 'MarcaTest', 
                                Prezzo: 999, 
                                Descrizione : 'Questa è una bici Test non noleggiablie' 
                            });
        newBike.save() // returns a promise after some time
            .then(() => {
                //if the newBike is saved in db and it is not new
                assert(!newBike.isNew);
                done();
            });
    });
});