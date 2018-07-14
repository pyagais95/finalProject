var express = require('express');
var router = express.Router();

var request = require('request');
const cheerio = require('cheerio');
const utf8 = require('utf8');
var async = require('async');
var saveImage = require('../helpers/downloadImage')
var getName = require('../helpers/getName')
var decode = require('../helpers/decode')

module.exports = function(app, db) {

	router.get('/',function(req, res) {
		request({uri: 'http://localhost:3000/parse/page', method:'GET', encoding:'binary'}, function (err, res, urls) {
			urls = JSON.parse(urls)
			async.eachSeries(urls, function iterator(elem, callback) {
				parseSingleBook('https://mybook.ru' + elem).then(function(resolve, reject){
					db.Book.create({
						title: resolve.title,
				        author: resolve.author,
				        description: resolve.description,
				        image: resolve.image
					});
					console.log(resolve)
					callback()
				})
			}, function done() {
				res.send('done')
			});
		});
	});
	
	router.get('/page',function(req, res) {
		var promise = new Promise(function(resolve, reject) {
			var urls = []
			request({uri: 'https://mybook.ru/catalog/', method:'GET', encoding:'binary'}, function (err, res, page) {
				let $ = cheerio.load(page, { decodeEntities: false });
				$('div .book-name').each(function(index,elem) {
					elem = $(elem).find('a')
					elem = utf8.decode($(elem).attr('href'))
					urls.push(elem)
				});

				resolve(urls)
			});
		});

		promise.then(function(resolve, reject) {
			res.send(resolve)
		})
	});


	router.get('/book',function(req, res) {
		var values = parseSingleBook('https://mybook.ru/author/rao-lu/dnevnik-blazhenstva/').then(function(resolve){
			res.send(resolve)
		})
	})

	var parseSingleBook = function(url) {
		var promise = new Promise(function(resolve, reject) {
			request({uri: url, method:'GET', encoding:'binary'}, function (err, res, page) {
				let $ = cheerio.load(page, { decodeEntities: false });
				var title = utf8.decode($('div .book-page-book-name').text())
				var description = utf8.decode($('div .definition-section').children().first().text())
				var image = $('div .book-cover').find('img').attr('src')
				var author = decode($('div .book-page-author').find('a').text())

				var imageName = getName(image)

				saveImage(image, 'public/img/' + imageName , function(){
				  console.log('Done')
				});

				//remove trash signs
				title = title.replace(/ /g,'')
				title = title.replace(/\n/g,'')
				author = author.replace(/ /g,'')
				author = author.replace(/\n/g,'')


				resolve({
					title,
					author,
					description,
					image: imageName
				})

				
			});
		});

		return promise
	}



	app.use('/parse', router);
};