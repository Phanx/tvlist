"use strict"

// Useful constants
const UPDATE_INTERVAL = 3 * 24 * 60 * 60 * 1000
const REQUEST_TIMEOUT = 3000

const VALID_DATA_TYPES = {
	name        : "string",
	image       : "string",
	imdb        : "string",
	nextDate    : "string",
	nextDateTime: "string",
	nextURL     : "string",
	premiered   : "string",
	status      : "string",
	tvmaze      : "number",
	url         : "string",
	updated     : "string",
	weekday     : "string",
	pref        : "string"
}

function getDateString(date) {
	const m = date.getMonth() + 1
	const d = date.getDate()
	return date.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
}
const NOW = new Date()
const TODAY = new Date(getDateString(NOW))


// HTTP GET request helper
function getJSON(url, callback, name) {
	// name = name ? name : "<unnamed request>"
	let data = ""
	const req = http.get(url, (res) => {
		// console.log("Requested data for", name, res.statusCode)
		res.on("data", (chunk) => {
			// console.log("Received chunk for", name)
			data += chunk
		})
		res.on("end", () => {
			try {
				data = JSON.parse(data)
			}
			catch (err) {
				// console.log("Error parsing data for", name, "--", err.message)
				return callback(null, err.message)
			}
			// console.log("Received data for", name)
			callback(data)
		})
	})
	req.setTimeout(REQUEST_TIMEOUT, (socket) => {
		// console.log("Timeout getting data for", name)
		req.abort()
		callback(null, "timeout")
	})
	req.on("error", (err) => {
		// console.log("Error getting data for", name, err.message)
		callback(null, err.message)
	})
}
