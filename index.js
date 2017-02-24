var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://localhost/assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);
    
    db.user_create_seed(function(){
      console.log("User Table Init");
    });
    db.vehicle_create_seed(function(){
      console.log("Vehicle Table Init")
    });
})

// all users
app.get('/api/users', function(req, res) {
  db.get_users(function(err, users) {
  if (err) {
    res.status(500).json(err);
  } else {
    res.json(users);
  }
});
});

// all vehicles
app.get('/api/vehicles', function(req, res) {
  db.get_vehicles(function(err, vehicles) {
  if (err) {
    res.status(500).json(err);
  } else {
    res.status(200).json(vehicles);
  }
});
});

// new user
app.post('/api/users', function(req, res) {
  db.create_user([req.body.firstname, req.body.lastname, req.body.email], function(err, user) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(user);
    }
  });
});

// new vehicle 
app.post('/api/vehicles', function(req, res) {
  db.create_vehicle([req.body.make, req.body.model, req.body.year, parseInt(req.body.ownerId)], function(err, vehicle) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(vehicle);
    }
  });
});

// vehicle count for owner
app.get('/api/users/:userId'/*vehiclecount*/, function(req, res) {
  db.get_vehicle_count_by_user([parseInt(req.params.userId)], function(err, count) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(count);
    }
  });
});

// all vehicles for owner
app.get('/api/user/:userId'/*vehicle*/, function(req, res) {
  db.get_all_vehicles_by_user([req.params.userId], function(err, vehicle) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(vehicle);
    }
  });
});

// 
app.get('/api/vehicle'/*?email=UserEmail or ?userFirstStart=letters*/, function(req, res) {
  if (req.query.userFirstStart) {
    db.get_vehicle_by_user_firstname([req.query.userFirstStart + '%'], function(err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(response);
      }
    });
  } else {
    db.get_vehicle_by_email([req.query.userEmail], function(err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(response);
      }
    });
  }
});


// all vehicles 2000 or newer
app.get('/api/newervehiclesbyyear', function(req, res) {
  var year = 2000;
  db.vehicle_by_year([year], function(err, vehicle) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(vehicle);
    }
  });
});

//  
app.put('/api/vehicle/:vehicleId/user/:userId' , function(req, res) {
  db.new_user_owner([req.params.vehicleId, req.params.userId,], function(err, vehicle) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(vehicle);
    }
  });
});

// 
app.delete('/api/user/:userId/vehicle/:vehicleId', function(req, res) {
  db.delete_owner([parseInt(req.params.vehicleId)], function(err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(response);
    }
  });
});

// 
app.delete('/api/vehicle/:vehicleId', function(req, res) {
  db.delete_vehicle([req.params.vehicleId], function(err, vehicle) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(vehicle);
    }
  });
});


app.listen('3000', function(){
  console.log("Successfully listening on : 3000");
});

module.exports = app;;
