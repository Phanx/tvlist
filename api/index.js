"use strict"

const router    = require("express").Router()
const http      = require("http")

// Set up the DB
const lowdb     = require("lowdb")
const dbStorage = require("lowdb/file-async")
const dbFile    = require("path").resolve(__dirname, "data/db.json")
const db        = lowdb(dbFile, { storage: dbStorage })

// Useful constants
const UPDATE_INTERVAL = 3 * 24 * 60 * 60 * 1000
const REQUEST_TIMEOUT = 3000

const VALID_DATA_TYPES = {
	name        : "string",
	image       : "string",
	imdb        : "string",
	kat         : "string",
	nextDate    : "string",
	nextDateTime: "string",
	nextURL     : "string",
	premiered   : "string",
	status      : "string",
	tvmaze      : "number",
	url         : "string",
	updated     : "string",
	weekday     : "string"
}

function getDateString(date) {
	var m = date.getMonth() + 1
	var d = date.getDate()
	return date.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
}
const NOW = new Date()
const TODAY = new Date(getDateString(NOW))


// HTTP GET request helper
function getJSON(url, callback, name) {
	// name = name ? name : "<unnamed request>"
	var data = ""
	var req = http.get(url, (res) => {
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


// Send list of tracked shows
router.get("/shows", (req, res) => {
	const shows = db("shows")
	const showsCount = shows.size()
	// console.log("Tracking " + showsCount + " shows.")

	// Populate with defaults on first run
	if (showsCount === 0) {
		const defaults = require("./data/shows.json")
		defaults.forEach((name) => {
			shows.push({ name: name })
		})
	}

	// Fetch show details from TVmaze API
	var waiting = showsCount

	shows.forEach((show) => {
		const lastUpdated = new Date(show.updated || 0)
		const nextEpisode = show.nextDate ? new Date(show.nextDate) : TODAY
		if (
			((NOW - lastUpdated) > UPDATE_INTERVAL)
			|| (nextEpisode && (TODAY > nextEpisode))
			|| req.query.force
		) {
			// console.log("Getting fresh data for show:", show.name)
			fetchDataForShow(show)
		} else {
			// console.log("Using cached data for show:", show.name)
			useDataForShow(show.name)
		}
	})

	function fetchDataForShow(show) {
		var showName = show.name

		var url
		if (show.tvmaze) {
			url = "http://api.tvmaze.com/shows/" + show.tvmaze
	//	} else if (show.imdb) {
	//		url = "http://api.tvmaze.com/lookup/shows?imdb=" + show.imdb
	//		// Doesn't work for most "in development" shows
		} else {
			url = "http://api.tvmaze.com/singlesearch/shows?q=" + encodeURIComponent(showName)
		}

		// console.log("Fetching data for show:", showName, url)
		getJSON(url, (showData, errorText) => {
			processDataForShow(showName, showData)
		}, "show " + showName)
	}

	function processDataForShow(showName, showData) {
		if (typeof(showData) === "undefined" || showData === null) {
			// console.log("No data for show:", showName)
			return useDataForShow(showName)
		} else if (showData._links && showData._links.nextepisode) {
			// console.log("Fetching data for next episode:", showName, showData._links.nextepisode.href)
			getJSON(showData._links.nextepisode.href, (epData, errText) => {
				useDataForShow(showName, showData, epData)
			}, "episode " + showName)
		} else {
			// console.log("No next episode for show:", showName)
			return useDataForShow(showName, showData)
		}
	}

	function useDataForShow(showName, showData, epData) {
		if (typeof(showData) !== "undefined") {
			db("shows")
			.chain()
			.find({ name: showName })
			.assign({
				image       : showData.image ? showData.image.medium : null,
				imdb        : showData.externals.imdb,
				nextDate    : epData ? epData.airdate : null,
				nextDateTime: epData ? epData.airstamp : null,
				nextURL     : epData ? epData._links.self.href : null,
				premiered   : showData.premiered,
				status      : showData.status,
				tvmaze      : showData.id,
				url         : showData._links.self.href,
				updated     : NOW,
				weekday     : showData.schedule.days[0]
			})
			.value()
		}

		waiting --
		// console.log("Waiting on data for", waiting, "shows.")
		if (waiting === 0) {
			// console.log("All data received.")
			return res.status(200).json(db("shows"))
		}
	}
})


// Add new show to be tracked
function addShow(res, name) {
	if (typeof(name) === "string") {
		console.log("Received request to add show: " + name)
		var found = db("shows").find({ name: name })
		if (typeof(found) === "undefined") {
			db("shows")
			.push({ name: name })
			.then((show) => {
				return res.status(200).json({
					message: "Show added!",
					show: show
				})
			})
		} else {
			return res.status(200).json({
				error: "Show already added.",
				show: found
			})
		}
	} else {
		return res.status(200).json({
			error: "Show name not specified."
		})
	}
}
router.get("/addshow", (req, res) => {
	addShow(res, req.query.name)
})
router.post("/addshow", (req, res) => {
	addShow(res, req.body.name)
})


// Update a show
router.post("/editshow", (req, res) => {
	var name = req.body.name
	var changes = req.body.changes
	console.log("/editshow", name, changes)
	if (typeof(name) !== "string") {
		return res.status(200).json({ error: "Show name not specified." })
	}
	if (typeof(changes) !== "object" || changes == null || Object.keys(changes).length === 0) {
		return res.status(200).json({ error: "No changes specified." })
	}
	Object.keys(changes).forEach((k) => {
		let v = changes[k]
		// TODO: use empty string to delete?
		if (v == null || VALID_DATA_TYPES[k] == null || typeof(v) !== typeof(VALID_DATA_TYPES[k])) {
			console.log("Dropping invalid property:", k, v, typeof(v), typeof(VALID_DATA_TYPES[k]))
			delete changes[k]
		}
	})
/*
	db("shows")
		.chain()
		.find({ name: name })
		.assign(changes)
		.value()
*/
	return res.status(200).json({ message: "Request received.", data: changes })
})


// Delete a show
router.post("/deleteshow", (req, res) => {
	var name = req.body.name
	if (typeof(name) === "undefined") {
		return res.status(200).json({ error: "Show name not specified." })
	}
	console.log("Received request to delete show:")
	return res.status(200).json({ message: "Request received." })
})


// EOF
module.exports = router

