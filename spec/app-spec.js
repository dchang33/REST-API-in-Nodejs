const request = require("request");

const api = request.defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true
});

describe('User Tests:', function () {
  it('User registration Success', function (done) {
      api.post({
        url: '/users',
        body: {
          username: 'John',
          password: 'myPassword',
          role: 'USER'
        }
      }, function (err, res, body) {
        expect(res.statusCode).toBe(200);
        done();
      });
  });
  //Failure due to missing required field(s)
  it('User registration Fail', function (done) {
      api.post({
        url: '/users',
        body: {
          username: 'Johnson'
        }
      }, function (err, res, body) {
        expect(res.statusCode).toBe(400);
        expect(res.body).toBe("missing required field(s)");
        done();
      });
  });
  it('User Login Success', function (done) {
      api.post({
        url: '/login',
        body: {
          username: 'Admin',
          password: 'admin'
        }
      }, function (err, res, body) {
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe("Login Successful");
        done();
      });
  });
  //Failure due to incorrect credentials
  it('User Login Fail', function (done) {
      api.post({
        url: '/login',
        body: {
          username: 'Admin',
          password: 'adminnn'
        }
      }, function (err, res, body) {
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Wrong Password");
        done();
      });
  });
});
describe('Programs API Tests:', function () {

  let jwtToken = '';
  let p_id = '';

  beforeAll(function (done) {
    api.post({
      url: '/login',
      body: {
        username: 'Admin',
        password: 'admin'
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      jwtToken = body.token;
    });
    api.get({
      url: '/programs'
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      p_id = body[0]._id;
      done();
    });
  });
  it('Get a program by id', function (done) {
    api.get({
      url: '/programs/' + p_id
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      expect(body[0]._id).toBe(p_id);
      done();
    });
  });
  //Create a new program
  it('Success Create a new program', function (done) {
    api.post({
      url: '/programs',
      headers: {
        'Authorization': 'jwt ' + jwtToken
      },
      body:{
        "name": "GO",
        "fullname": "Graduate Orientaion at ECST",
        "description": "Orientaion for Graduate student"
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe("Prgram created");
      done();
    });
  });
  //Failure due to access control
  it('Fail Create a new program', function (done) {
    api.post({
      url: '/programs'
    }, function (err, res, body) {
      expect(res.statusCode).toBe(401);
      expect(res.body).toBe("Unauthorized");
      done();
    });
  });
  //Edit program
  it('Edit a program', function (done) {
    api.put({
      url: '/programs/'+ p_id,
      headers: {
        'Authorization': 'jwt ' + jwtToken
      },
      body:{
        "name": "GO"
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      expect(res.body).toBe("Program updated");
      done();
    });
  });
});

describe('Event API Tests:', function () {

  let jwtToken = '';
  let e_id = '';
  let u_id = '';

  beforeAll(function (done) {
    api.post({
      url: '/login',
      body: {
        username: 'Admin',
        password: 'admin'
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      jwtToken = body.token;
    });
    api.get({
      url: '/events'
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      e_id = body[0]._id;
    });
    api.get({
      url: '/users'
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      u_id = body[0]._id;
      done();
    });
  });

  //Create a new event
  it('Success Create a new event', function (done) {
    api.post({
      url: '/events',
      headers: {
        'Authorization': 'jwt ' + jwtToken
      },
      body:{
          "name": "Orientation",
          "location": "Golden Eagle Ball Room",
          "startTime": "2018-11-01T07:00:00.000Z",
          "endTime": "2018-11-01T07:00:00.000Z",
          "organizer": "5bff3b2f72826ff15ca06b81"
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Created new event");
      done();
    });
  });
  //Failure due to access control
  it('Fail Create a new event', function (done) {
    api.post({
      url: '/events',
      body:{
          "name": "Orientation",
          "location": "Golden Eagle Ball Room",
          "startTime": "2018-11-01T07:00:00.000Z",
          "endTime": "2018-11-01T07:00:00.000Z",
          "organizer": "5bff3b2f72826ff15ca06b81"
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(401);
      expect(res.body).toBe("Unauthorized");
      done();
    });
  });
  //Approve/reject an event
  it('Success Approve/reject an event', function (done) {
    api.put({
      url: '/events/'+ e_id,
      headers: {
        'Authorization': 'jwt ' + jwtToken
      },
      body:{
        "status": "POSTED"
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      expect(res.body).toBe("Update Success");
      done();
    });
  });
  //Failure due to access control
  it('Fail Approve/reject an event', function (done) {
    api.put({
      url: '/events/'+ e_id,
      body:{
        "status": "POSTED"
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(401);
      expect(res.body).toBe("Unauthorized");
      done();
    });
  });
  it('Get all attendee of an event', function (done) {
    api.get({
      url: '/events/'+ e_id + '/attendees',
      headers: {
        'Authorization': 'jwt ' + jwtToken
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
  it('Add an attendee to an event', function (done) {
    api.put({
      url: '/events/'+ e_id + '/attendee',
      headers: {
        'Authorization': 'jwt ' + jwtToken
      },
      body:{
        "attendees": u_id
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
});
