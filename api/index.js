var express = require("express")
// var http    = require("http")
var router  = express.Router()

// Set up the DB
var low = require("lowdb")
var dbStorage = require("lowdb/file-async")
var dbFile = require("path").resolve(__dirname, "data/db.json")
var db = low(dbFile, { storage: dbStorage })

// Send list of tracked shows
router.get("/shows", function(req, res) {
	var shows = db("shows")

	// Populate with defaults on first run
	if (shows.length == 0) {
		var defaults = require("./data/shows.json")
		defaults.forEach(function(name) {
			shows.push({ name: name })
		})
	}
/*
	var MAX_AGE = (24 * 60 * 60 * 1000) * 3

	var today = new Date()
	today.setHours(0)
	today.setMinutes(0)
	today.setSeconds(0)
	today.setMilliseconds(0)

	shows.forEach(function(show) {
		var lastUpdate = show.updated || 0
		var nextAirdate = show.nextairdate || 0

		if ((today - lastUpdate) > MAX_AGE) || (nextAirdate < today) {
			var URL
			if (show.tvmaze) {
				URL = "http://api.tvmaze.com/shows/" + show.tvmaze
			} else if (show.imdb) {
				URL = "http://api.tvmaze.com/lookup/shows?imdb=tt" + show.imdb
			} else {
				URL = "http://api.tvmaze.com/singlesearch/shows?q=" + encodeURIComponent(show.name.toLowerCase())
			}

			show.tvmaze = data.id
			show.status = data.status
			show.premiered = data.premiered
			show.day = data.schedule.days[0]
			show.imageURL = data.image.original // TODO: base64 encode it?

			show.updated = now

			var next = data._links.nextepisode
		}
	})

	shows.sort(function(a, b) {
		return a.name.toLowerCase().replace(/^the /, "") > b.name.toLowerCase().replace(/^the /, "")
	})
*/
	return res.status(200).json(shows)
})

// Add new show to be tracked
function addShow(name)
	if (name) {
		console.log("Received request to add show: " + name)
		db("shows").push({ name: name })
		return res.status(200).json({
			message: "Success"
		})
	}
	else {
		return res.sendStatus(400)
	}
end

router.route("/addshow")
	.get(function(req, res) {
		addShow(req.query && req.query.name)
	})
	.post(function(req, res) {
		addShow(req.body && req.body.name)
	})

// EOF
module.exports = router

