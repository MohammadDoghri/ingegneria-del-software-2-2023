//import the User model
const User = require('../models/user');
const assert = require('assert');
  
describe('Creating documents in MongoDB', () => {
    it('Creates a New User', (done) => {
        const newUser = new User({ email: 'test@test.it', username : 'test' });
        newUser.save() // returns a promise after some time
            .then(() => {
                //if the newUser is saved in db and it is not new
                assert(!newUser.isNew);
                done();
            });
    });
});