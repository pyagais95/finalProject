var express = require('express');
var router = express.Router();
var sendEmail = require('../helpers/sendEmail')

/* libraries for photo upload */
var multer = require('multer');
var upload = multer({dest: './public/img'});

module.exports = function(app, db) {

	router.get('/',function(req, res) {
		db.Book.findAll().then(books => {
			res.render('books', {books});
		})
	});

	router.get('/remove',function(req, res) {
		if(req.cookies.admin) {
			db.Book.destroy({where: {id: req.query.id }}).then(function(){
				res.redirect('/admin')
			})
		} else {
			res.send('Not allowed')
		}
		
	});

	router.get('/single/:id',function(req, res) {
		db.Book.findOne({ 
			where: {
				id: req.params.id
			}}).then(book => {
				console.log(book)
				res.render('single', {book})
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

	router.post('/update',function(req, res) {
		console.log(req.body)
		db.Book.update(
			{
				title: req.body.title,
				author: req.body.author,
				description: req.body.description
			},
			{where: {id: req.body.id}}
		).then(function() {
				
				res.redirect('/books')
			
		})
	});

	router.get('/redact/:id',function(req, res) {
		db.Book.findOne({ 
			where: {
				id: req.params.id
			}}).then(book => {
				console.log(book)
				res.render('redact', {book})
			})
	});

	
	app.use('/books', router);
};