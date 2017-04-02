const misc = require('./lib/angel');
const LIAPI = require('./lib/linkedin');
const db = require('monk')('mongodb://cold:Test12345!@ds149030.mlab.com:49030/hill')
const homes = db.get('casas')
const express = require('express');
const async = require('async');

var app = express()

app.get('/users', (req, res) => {
	homes.find({}, {sort: {totalMatches: -1, value: -1}}).then((docs) => {
		console.log(docs);
  	// sorted by name field
	});
});

app.get('/users/:id', (req, res) => {
	homes.find({}, {sort: {value: 1}, totalMatches: {$exists : false }}).then((docs) => {
		console.log(docs);
  	// sorted by name field
	});
});

app.get('/users/:id/email', (req, res) => {

});

app.post('/users/:id/email', (req, res) => {

});

app.get('/users/:id/mail', (req, res) => {

});

app.post('/users/:id/mail', (req, res) => {

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
