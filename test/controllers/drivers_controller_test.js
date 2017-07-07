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

  it('Get to /api/drivers finds drivers near a location', done => {
    const seattleDriver = new Driver({ 
      email: 'seattle@mail.com',
      geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
    });
    const miamiDriver = new Driver({ 
      email: 'miami@mail.com', 
      geometry: { type: 'Point', coordinates: [-80.253, 25.791] }
    });

    Promise.all([ seattleDriver.save(), miamiDriver.save() ])
      .then(() => {
        request(app)
          .get('/api/drivers?lng=-80&lat=25')
          .end((err, response) => {
            assert(response.body.length === 1);
            assert(response.body[0].obj.email === 'miami@mail.com');
            done();
          });
      });
  });
});

