var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var moment = require('moment');

var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

var agenda = require('agenda')({ db: { address: 'localhost:27017/test' } });
var sugar = require('sugar');
var nodemailer = require('nodemailer');
var _ = require('lodash');

var tokenSecret = 'your unique secret';


var addRoaster = new mongoose.Schema({
        empName: String,
        empID: String,
        managerName: String,
        gender: String,
        designation: String,
        process: String,
        mobileNo: String,
        landline: String,
        address: String,
        empLocation: String,
        role: String,
        date: String,
        inTime: String,
        outTime: String
  
});

var userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String,
  facebook: {
    id: String,
    email: String
  },
  google: {
    id: String,
    email: String
  } 
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);
var Roaster = mongoose.model('Roaster', addRoaster);

mongoose.connect('localhost');
// var app = angular.module('myApp', []);

var app = exports.app = express();
module.exports = mongoose.model('roaster', addRoaster);

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

function ensureAuthenticated(req, res, next) {
  if (req.headers.authorization) {
    var token = req.headers.authorization.split(' ')[1];
    try {
      var decoded = jwt.decode(token, tokenSecret);
      if (decoded.exp <= Date.now()) {
        res.send(400, 'Access token has expired');
      } else {
        req.user = decoded.user;
        return next();
      }
    } catch (err) {
      return res.send(500, 'Error parsing token');
    }
  } else {
    return res.send(401);
  }
}

function createJwtToken(user) {
  var payload = {
    user: user,
    iat: new Date().getTime(),
    exp: moment().add('days', 7).valueOf()
  };
  return jwt.encode(payload, tokenSecret);
}

app.post('/auth/signup', function(req, res, next) {
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });

    // var MongoClient = require('mongodb').MongoClient , format = require('util').format;
    //            MongoClient.connect('mongodb://127.0.0.1:27017/nlogin', function(err, db) {
    //           if (err) throw err;
    //           console.log("Connected to Database");
    //           //console.log('Id is : ' + req.body.userId);
    //           var document = {username:req.body.name, email: req.body.email, password:req.body.password, role: req.body.role.name,Sts:'1' };
    //             //insert record
    //            db.collection('MyLoginDb').save(document, function(err, isSuccess) {
    //          if (err) throw err;
    //          console.log("Success: "+ isSuccess);
    //          res.json(isSuccess);
    //              });
    //     });


});

app.post('/auth/addRoaster', function(req, res, next) {
  console.log('*************** In Server Add roaster ***************');
  var roaster = new Roaster({
        empName: req.body.empName,
        empID: req.body.empID,
        managerName: req.body.managerName,
        gender: req.body.gender,
        designation: req.body.designation,
        process: req.body.process,
        mobileNo: req.body.mobileNo,
        landline: req.body.landline,
        address: req.body.address,
        empLocation: req.body.empLocation,
        role: req.body.role.name,
        date: req.body.date,
        inTime: req.body.inTime,
        outTime: req.body.outTime
  });
  roaster.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });

    // var MongoClient = require('mongodb').MongoClient , format = require('util').format;
    //            MongoClient.connect('mongodb://127.0.0.1:27017/nlogin', function(err, db) {
    //           if (err) throw err;
    //           console.log("Connected to Database");
    //           //console.log('Id is : ' + req.body.userId);
    //           var document = {empname:req.body.empName, emp_id: req.body.empID, manager:req.body.managerName, gender: req.body.gender, designation: req.body.designation, process: req.body.process, mobileNo: req.body.mobileNo, landline: req.body.landline, address: req.body.address, empLocation: req.body.empLocation, date: req.body.date, inTime: req.body.inTime, outTime: req.body.outTime, Sts:'1' };
    //             //insert record
    //            db.collection('rosterDb').save(document, function(err, isSuccess) {
    //          if (err) throw err;
    //          console.log("Success: "+ isSuccess);
    //          res.json(isSuccess);
    //              });
    //     });

});

app.post('/auth/login', function(req, res, next) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) return res.send(401, 'User does not exist');
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) return res.send(401, 'Invalid email and/or password');
      var token = createJwtToken(user);
      res.send({ token: token });
    });
  });

    // var MongoClient = require('mongodb').MongoClient , format = require('util').format;
    //            MongoClient.connect('mongodb://127.0.0.1:27017/nlogin', function(err, db) {
    //           if (err) throw err;
    //           console.log("Connected to Database");
    //           var filter = JSON.parse('{"email" : ' + req.body.email + '}');
    //           db.collection('MyLoginDb').findOne(filter, function(err, isMatch) {

    //                 if (!isMatch) return res.send(401, 'Invalid email and/or password');
    //                 var token = createJwtToken(user);
    //                 res.send({ token: token });
    //           });


});

app.get('/api/users', function(req, res, next) {
  if (!req.query.email) {
    return res.send(400, { message: 'Email parameter is required.' });
  }

  User.findOne({ email: req.query.email }, function(err, user) {
    if (err) return next(err);
    res.send({ available: !user });
  });
});



app.get('/api/emps', function(req, res, next) {
  var query = Roaster.find();
  query.exec(function(err, roaster) {
    if (err) return next(err);
    res.send(roaster);
  });
});

// app.get('/api/principal', function(req, res, next) {
//   console.log('*************** In Server principle get ***************');
//   // var clientUser = {};
//   // clientUser.id = req.user._id;
//   // clientUser.username = req.user.name;
//   // clientUser.email = req.user.email;
//   // console.log(JSON.stringify(clientUser) + '############ clientuser array ##########');
//   // res.send(clientUser);

//   var query = Roaster.find();
//   query.exec(function(err, roaster) {
//     if (err) return next(err);
//     res.send(roaster);
//   });
// });

app.get('/api/empsbyid', function(req, res, next) {
  //console.log( '******************** Server get emp 1***************' + JSON.stringify(req));
  Roaster.findById(req.body._id, function(err, roaster) {
    if (err) return next(err);
    res.send(roaster);
  });
 // console.log(JSON.stringify(emp) + '******************** Server get emp ***************' + req.params.id);
});

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// agenda.define('send email alert', function(job, done) {
//   Show.findOne({ name: job.attrs.data }).populate('subscribers').exec(function(err, show) {
//     var emails = show.subscribers.map(function(user) {
//       if (user.facebook) {
//         return user.facebook.email;
//       } else if (user.google) {
//         return user.google.email
//       } else {
//         return user.email
//       }
//     });

//     var upcomingEpisode = show.episodes.filter(function(episode) {
//       return new Date(episode.firstAired) > new Date();
//     })[0];

//     var smtpTransport = nodemailer.createTransport('SMTP', {
//       service: 'SendGrid',
//       auth: { user: 'hslogin', pass: 'hspassword00' }
//     });

//     var mailOptions = {
//       from: 'Fred Foo ✔ <foo@blurdybloop.com>',
//       to: emails.join(','),
//       subject: show.name + ' is starting soon!',
//       text: show.name + ' starts in less than 2 hours on ' + show.network + '.\n\n' +
//         'Episode ' + upcomingEpisode.episodeNumber + ' Overview\n\n' + upcomingEpisode.overview
//     };

//     smtpTransport.sendMail(mailOptions, function(error, response) {
//       console.log('Message sent: ' + response.message);
//       smtpTransport.close();
//       done();
//     });
//   });
// });

// //agenda.start();

// agenda.on('start', function(job) {
//   console.log("Job %s starting", job.attrs.name);
// });

// agenda.on('complete', function(job) {
//   console.log("Job %s finished", job.attrs.name);
// });