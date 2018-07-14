module.exports = function(url) {
	var names = url.split('/')
	return names[names.length - 1]
}