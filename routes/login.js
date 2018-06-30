var express = require('express');
var router = express.Router();

module.exports = function(app, conn) {

	router.get('/login',function(req, res) {
		res.render('login', {});
	});

	router.post('/login',function(req, res) {
		var sql = "select * from user where email='%email' and password='%pass'"
		
		sql=sql.replace('%email', req.body.email)
		sql=sql.replace('%pass', req.body.pass)
		conn.query(sql, function (err, result) {
			if (err) {
				res.send('Can not login')
			} else {
				res.send('succes')
			}
		});
	});

	app.use('/', router);
};