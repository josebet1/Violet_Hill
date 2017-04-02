const misc = require('./lib/angel');
const LIAPI = require('./lib/linkedin');
const db = require('monk')('mongodb://cold:Test12345!@ds149030.mlab.com:49030/hill')
const homes = db.get('casas')
const express = require('express');
const async = require('async');
const lob = require('lob')('test_233a99c59f3c6c735a9a6b434aedf0d4505');
const parser = require('parse-address'); 
const bodyParser = require('body-parser');
const cors = require('cors')

var app = express()

app.use(cors())

bodyParser.urlencoded({extended: true});

app.get('/users', (req, res) => {
	homes.find({}, {sort: {totalMatches: -1, value: -1}}).then((docs) => {
		res.send(docs);
	});
});

app.get('/users/:id', (req, res) => {
	homes.find({_id: id}).then((docs) => {
		res.send(docs);
	});
});

app.get('/users/:id/email', (req, res) => {
	homes.find({_id: id}).then((user) => {
		res.json(user);
	});
});

app.post('/users/:id/email', (req, res) => {

});

app.get('/users/:id/mail', (req, res) => {
	homes.find({_id: id}).then((user) => {
		res.json(user);
	});
});

app.post('/users/:id/mail', (req, response) => {
	homes.find({_id: id}).then((user) => {
		const parsedAddress = parser.parseLocation(user.address);
		Lob.letters.create({
		  description: `${user.first_name} ${user.last_name} Letter`,
		  to: {
		    name: `${user.first_name} ${user.last_name}`,
		    address_line1: `${parsedAddress.number} ${parsedAddress.prefix} ${parsedAddress.street}`,
		    address_city: `${parsedAddress.city}`,
		    address_state: `${parsedAddress.state}`,
		    address_zip: `${parsedAddress.zip}`,
		    address_country: 'US',
		  },
		  from: {
		    name: 'John Scharff',
		    address_line1: '123 Test Avenue',
		    address_city: 'Mountain View',
		    address_state: 'CA',
		    address_zip: '94041',
		    address_country: 'US',
		  },
		  file: `<html style="padding-top: 3in; margin: .5in;">${req.body.message}</html>`,
		  color: false
		}, function (err, res) {
		  if (!err) {
		  	const lobRes = { lob : { id: res.id, preview: res.url, expected: res.expected_delivery_date } };
		  	homes.update({_id: id}, {$set: lobRes}, () => {
		  		response.json(lobRes);
		  	});
		  }
		});
	});


});


// homes.find({}, {sort: {value: -1}, totalMatches: {$exists : false }}).then((docs) => {
// 	async.forEachLimit(docs, 1, (home, cb) => {
// 		const fullName = `${home.first_name} ${home.last_name}`;

// 		misc.searchBing(fullName, (matches) => {
// 			console.log(matches);
// 			homes.update({_id: home._id}, {$set: {totalMatches: matches}}, () => {
// 				cb();
// 			});
// 		});

// 	}, () => {

// 	});
// 	// sorted by name field
// });

// misc.searchBing('Jose Bethancourt', (matches) => {
// 	console.log(matches);
// });

// homes.find({}, {sort: {value: 1}}).then((docs) => {
// 	console.log(docs);
//   // sorted by name field
// });

// misc.getUnifiedData('Jose Bethancourt', (person) => {
// 	console.log(person);
// });
// const li = new LIAPI('josebethancourt@utexas.edu', '')
// li.auth((success) => {
// 	// li.test();
// 	li.search('Jason Scharff', () => {

// 	});
// });

app.listen(80, function () {
  console.log('o app listening on port 80!')
})
