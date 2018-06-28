var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var glob = require('glob');
var mysql = require('mysql');
const config = require('./config');
console.log(config)
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*connection sql*/
var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.dbPassword,
  database: config.database
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(`create table if not exists User(
  	Id int not null auto_increment,
  	Email varchar(255) unique not null,
  	Password varchar(255) not null,
  	Name varchar(255) not null,
  	primary key(Id)
  	);`, function(err, result){
  	if (err) throw err;
  	console.log("table created!")
  })
});


/* Configure routes */
var routes = glob.sync('./routes/*.js');
routes.forEach(function(route) {
	require(route)(app);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
