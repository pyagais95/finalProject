var express = require('express');
var router = express.Router();
var sendEmail = require('../helpers/sendEmail')
const config = require('../config')

module.exports = function(app, conn) {

	router.get('/signup',function(req, res) {
		res.render('signup', {});
	});

	router.get('/signin',function(req, res) {
		res.render('signin', {message: null});
	});


	router.post('/signup',function(req, res) {
		var sql = "INSERT INTO User (Email, Password) VALUES ('%Email', '%Password')";
			
		sql = sql.replace('%Email', req.body.email)
		sql = sql.replace('%Password', req.body.pass)


		conn.query(sql, function (err, result) {
			console.log(err)
			if (err) {
				res.send('Can not login')
			} else {
				res.render('index')
			}
		});
	});

	router.post('/signin',function(req, res) {
		var sql = "select * FROM User where email = '%Email' and Password = '%Password'";
		
		sql = sql.replace('%Email', req.body.email)
		sql = sql.replace('%Password', req.body.pass)

		if(req.body.email == "admin@gmail.com" && req.body.pass == "12345") {
			res.render('admin')
		}else{

		conn.query(sql, function (err, user) {
			if(user.length == 0) { //result.length == 0 
				res.render('signin', {message: 'Не верный логин или пароль'})				
			} else {
				//save cookie
				res.cookie('user', user[0])
				//send email to user
				console.log(user[0])
				sendEmail(user[0].Email, 'Subject', 'Text')
				res.redirect('/')
			}
		});
	}
	});

	router.get('/admin',function(req, res) {
		res.render('admin', {});
	});

	router.post('/admin',function(req, res) {
		var sql = "INSERT INTO Books (title, author) VALUES ('%title', '%author')";
			
		sql = sql.replace('%title', req.body.title)
		sql = sql.replace('%author', req.body.author)


		conn.query(sql, function (err, result) {
			console.log(err)
			if (err) {
				res.send('Can not login')
			} else {
				res.render('index')
			}
		});
	});


	
	app.use('/users', router);
};