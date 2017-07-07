const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Driver = mongoose.model('driver');

describe('Drivers controller', () => {
  it('Post to /api/drivers creates a new driver', done => {
    request(app)
      .post('/api/drivers')
      .send({email: 'test@test.com'})
      .end(() => {
        Driver.find({})
          .then(drivers => {
            assert(drivers[0].email === 'test@test.com');
            done();
          });
      });
  });
});

