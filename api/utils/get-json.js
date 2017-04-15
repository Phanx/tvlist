const fetch = require("node-fetch")

const getJSON = function(url, callback) {
	fetch(url, {
		timeout: 3000,
	})
	.then(res => {
		if (res.status >= 200 && res.status <= 299) {
			return res.json()
		}
	})
	.then(data => {
		return callback(data)
	})
	.catch(err => {
		console.log(err)
		return callback()
	})
}

module.exports = getJSON
