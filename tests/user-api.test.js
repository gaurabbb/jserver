const chai = require('chai');
const chaiHttp = require('chai-http');
const {db, app, mongoose, server} = require('../server');
require('dotenv').config();

chai.use(chaiHttp);
const expect = chai.expect;
before(function (done) {
  this.timeout(5000)
  db.once('open', () => {
    console.log('Connected to MongoDB');
    done(); // Signal that the connection is established
  });

  db.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    done(err); // Signal an error if connection fails
  });
});

describe('API Tests', function () {
  this.timeout(10000)
  let createdAccounts = [];
  
  // Test creating 50 accounts
  it('should create 50 accounts', async () => {
    for (let i = 0; i < 50; i++) {
      const res = await chai
        .request(app)
        .post('/api/createuser')
        .send({ firstname: `User${i}`, lastname: 'Doe', email: `user${i}@example.com` });

      expect(res).to.have.status(201);
      createdAccounts.push(res.body.user); 
    }
  });

  // Test finding accounts
  it('should find accounts', async () => {
    const res = await chai.request(app).get('/api/finduser?firstname=User0');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf.at.least(1);
  });

  // Test updating 50 accounts
  it('should update 10 accounts', async () => {
    for (let i = 0; i < 10; i++) {
      const userId = createdAccounts[i]._id; 
      const res = await chai
        .request(app)
        .put('/api/updateuseremail')
        .send({ id: userId, email: `updated${i}@example.com` });

      expect(res).to.have.status(204);
    }
  });

  // Test deleting 20 accounts
  it('should delete 20 accounts', async () => {
    for (let i = 0; i < 20; i++) {
      const userId = createdAccounts[i]._id;
      const res = await chai.request(app).post(`/api/deleteuser/${userId}`);

      expect(res).to.have.status(204);
    }
  });
 
});

