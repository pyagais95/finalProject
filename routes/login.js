var express = require('express');
var router = express.Router();

module.exports = function(app, db) {

	router.get('/login',function(req, res) {
		res.render('login', {});
	});

	app.use('/', router);
};