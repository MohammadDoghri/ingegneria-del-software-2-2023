const Bike = require('../models/bike');
const assert = require('assert');
  
let bike;
// this will run before running every test
beforeEach(() => {
    // Creating a new Instance of Bike Model
    bike = new Bike({  Modello: 'Test' });
    bike.save()
        .then(() => done());
});
  
describe('Reading Details of Bike', () => {
    it('Finds bike with the name', (done) => {
        Bike.findOne({ Modello: 'Test' })
            .then((bike) => {
                assert(bike.Modello === 'Test');
                done();
            });
    })
})