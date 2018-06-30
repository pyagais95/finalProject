var express = require('express');
var router = express.Router();

module.exports = function(app, conn) {

	router.get('/signup',function(req, res) {
		res.render('signup', {});
	});

	router.post('/create',function(req, res) {
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

	app.use('/users', router);
};