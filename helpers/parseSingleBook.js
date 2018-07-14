var request = require('request');
const cheerio = require('cheerio')
const utf8 = require('utf8');

module.exports = function(url) {
	var promise = new Promise(function(resolve, reject) {
		request({uri: url, method:'GET', encoding:'binary'}, function (err, res, page) {
			let $ = cheerio.load(page, { decodeEntities: false });
			var title = utf8.decode($('div .book-page-book-name').text())
			var description = utf8.decode($('div .definition-section').children().first().text())
			var imgLink = $('div .book-cover').find('img').attr('src')

			title = title.replace(/ /g, '');
			title = title.replace(/\n/g, '');
			console.log(title)
			resolve({
				title,
				description,
				imgLink
			})
		});
	});

	return promise
}