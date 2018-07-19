var express = require('express');
var router = express.Router();
var sendEmail = require('../helpers/sendEmail')
const config = require('../config')
var hash = require('../helpers/generateHash')

module.exports = function(app, db) {

	router.get('/signup',function(req, res) {
		res.render('signup', {});
	});

	router.get('/signin',function(req, res) {
		res.render('signin', {message: null});
	});

	router.get('/profile',function(req, res) {
		res.render('profile');
	});

	router.get('/logout',function(req, res) {
		res.clearCookie("user");
		res.clearCookie("admin");

		res.redirect('/');
	});

	router.post('/update/info',function(req, res) {
		db.User.update(
			{
				name: req.body.name,
				phone: req.body.phone
			},
			{where: {id: req.body.id}}
		).then(function() {
			db.User.findOne({where: {id: req.body.id}}).then(function(user){
				res.cookie('user', user)
				res.redirect('/users/profile')
			})

		})
	});

	router.post('/signup',function(req, res) {
		db.User.create({
			email: req.body.email,
					password: hash(req.body.pass)
		});
		
		res.render('index')
	});

	router.post('/signin',function(req, res) {
		db.User.findOne({ 
			where: {
				email: req.body.email,
				password: hash(req.body.pass)
			}}).then(user => {
				if(!user) { 
					res.render('signin', {message: 'Не верный логин или пароль'})				
				} else {
					for(elem of config.admins) {
						if(elem == user.email) {
							res.cookie('admin', true)
						}
					}

					//save cookie
					res.cookie('user', user)
					res.redirect('/')
				}
		})
	});

	app.use('/users', router);
};