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

  it('Put to /api/drivers/id updates an existing driver', done => {
    const driver = new Driver({ email: 'test@mail.com', driving: false });

    driver.save().then(() => {
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({email: 'updated@mail.com', driving: true})
        .end(() => {
          Driver.findOne({_id: driver._id})
            .then(driver => {
              assert(driver.email === 'updated@mail.com');
              assert(driver.driving === true);
              done();
            });
        });
    });
  });


  it('Post to /api/drivers/id/remove removes an existing driver', done => {
    const driver = new Driver({ email: 'driver@mail.com' });

    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.findOne({_id: driver._id})
            .then(driver => {
              assert(driver === null);
              done();
            });
        });
    });
  });

  it('Get to /api/drivers/id retreives an existing driver', done => {
    const driver = new Driver({ email: 'get@mail.com' });

    driver.save().then(() => {
      request(app)
        .get(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.findOne({_id: driver._id})
            .then(getDriver => {
              assert(getDriver.email === 'get@mail.com');
              done();
            });
        });
    });
  });
});

