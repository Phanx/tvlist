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
	let waiting = showsCount

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
		const showName = show.name

		let url = show.tvmaze ? "http://api.tvmaze.com/shows/" + show.tvmaze
			// : show.imdb ? "http://api.tvmaze.com/lookup/shows?imdb=" + show.imdb
			// ^ Doesn't work for most "in development" shows
			: "http://api.tvmaze.com/singlesearch/shows?q=" + encodeURIComponent(showName)

		// console.log("Fetching data for show:", showName, url)
		getJSON(url, (showData, errorText) => {
			processDataForShow(showName, showData)
		}, "show " + showName)
	}

	function processDataForShow(showName, showData) {
		if (!showData || showData.status === 404) {
			console.log("No data for show:", showName)
			if (showData && showData.status === 404) {
				console.log("Bad TVmaze ID for show:", showName)
				db("shows")
					.chain()
					.find({ name: showName })
					.assign({ tvmaze: undefined })
					.value()
				fetchDataForShow(db("shows").find({ name: showName }))
			}
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
				image       : showData.image ? showData.image.medium : undefined,
				imdb        : showData.externals.imdb,
				nextDate    : epData ? epData.airdate : undefined,
				nextDateTime: epData ? epData.airstamp : undefined,
				nextURL     : epData ? epData._links.self.href : undefined,
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
function addShow(req, res) {
	const name = req.query && req.query.name || req.body && req.body.name
	if (typeof(name) === "string") {
		console.log("Received request to add show: " + name)
		const found = db("shows").find({ name: name })
		if (typeof(found) === "undefined") {
			db("shows")
			.push({ name: name })
			.then((show) => {
				// TODO: fetch data for it now
				return res.status(200).json({
					message: "Show added!",
					show: show
				})
			})
		} else {
			return res.status(409).json({
				error: "Show already added.",
				show: found
			})
		}
	} else {
		return res.status(400).json({
			error: "Show name not specified."
		})
	}
}
router.get("/addshow", addShow)
router.post("/addshow", addShow)

// Update a show
router.post("/editshow", (req, res) => {
	const name = req.body.name
	const changes = req.body.changes
	console.log("/editshow", name, changes)
	if (typeof(name) !== "string") {
		return res.status(400).json({ error: "Show name not specified." })
	}
	if (typeof(changes) !== "object" || changes == null || Object.keys(changes).length === 0) {
		return res.status(200).json({ error: "No changes specified." })
	}
	Object.keys(changes).forEach((k) => {
		let v = changes[k]
		// TODO: use empty string to delete?
		// TODO: send list of dropped properties with response?
		if (v == null || VALID_DATA_TYPES[k] == null || typeof(v) !== typeof(VALID_DATA_TYPES[k])) {
			console.log("Dropping invalid property:", k, v, typeof(v), typeof(VALID_DATA_TYPES[k]))
			delete changes[k]
		}
	})
	db("shows")
		.chain()
		.find({ name: name })
		.assign(changes)
		.value()
	return res.status(200).json({ message: "Changes saved." })
})


// Delete a show
router.post("/deleteshow", (req, res) => {
	const name = req.body.name
	if (typeof(name) === "undefined") {
		return res.status(400).json({ error: "Show name not specified." })
	}
	console.log("Received request to delete show: " + name)
	db("shows").remove({ name: name })
	return res.status(200).json({ message: "Show deleted." })
})


// EOF
module.exports = router

