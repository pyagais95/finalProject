var express = require('express');
var router = express.Router();
var sendEmail = require('../helpers/sendEmail')

/* libraries for photo upload */
var multer = require('multer');
var upload = multer({dest: './public/img'});

module.exports = function(app, db) {

	router.get('/',function(req, res) {
		db.Book.findAll().then(books => {
			console.log(books)
			res.render('books', {books});
		})
	});


	router.post('/add', upload.any(), function(req, res) {

		db.Book.create({
			title: req.body.title,
			author: req.body.author,
			description: req.body.description,
			image: req.files[0].filename
		})

		res.send(req.body)
	});

	router.get('/:id',function(req, res) {
		// search for known ids
	db.Book.findById(req.params.id).then(book => {
	console.log(book.dataValues)
	var b = book.dataValues
	res.render('single', {b})
})
		})
	
	app.use('/books', router);
};