const User = require('../models/user');
const assert = require('assert');
  
let user;
// this will run before running every test
beforeEach(() => {
    // Creating a new Instance of User Model
    user = new User({  email: 'test1@test1.it' });
    user.save()
        .then(() => done());
});
  
describe('Reading Details of User', () => {
    it('Finds user with the name', (done) => {
        User.findOne({ email: 'test1@test1.it' })
            .then((user) => {
                assert(user.email === 'test1@test1.it');
                done();
            });
    })
})