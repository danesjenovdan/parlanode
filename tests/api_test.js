const request   = require('supertest');
const server    = require('../run');
const mongoose  = require('mongoose');
// const postgres  = require('../server/parlalize_db');

before(function (done) {
  server.init()
    .then(()=>{
      done();
    });
});

describe('Test API route', function() {
  it('respond with json', function(done) {
    request(server.app)
      .get('/test')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

// describe('Test Mongoose', function() {
//   it('connection open', function(done) {

//     if(mongoose.connection.readyState){
//       done();
//     }else{
//       done('connection not found');
//     }

//   });
// });

// describe('Test login', function() {

//   it('logs in', function(done) {
//     request(server.app)
//       .post('/api/login')
//       .send({ email:'email@email.com', password:'fakepass' })
//       .set('Accept', 'application/json')
//       .expect(401, done);
//   });

// });