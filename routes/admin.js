var express = require('express');
var router = express.Router();

module.exports = function(app, db) {


	router.get('/',function(req, res) {
		db.Book.findAll().then(function(books){
			res.render('admin', { books })
		})
	});

	app.use('/admin', router);
};