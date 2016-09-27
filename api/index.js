"use strict"

const router    = require("express").Router()

router.use("/addshow",    require("./add"))
router.use("/editshow",   require("./edit"))
router.use("/deleteshow", require("./delete"))

// -----------------------------------------------------------------------------
// Send list of tracked shows
//

const http  = require("http")
const shows = require("./db").get("shows")

const REQUEST_TIMEOUT = 3000
const UPDATE_INTERVAL = 3 * 24 * 60 * 60 * 1000

const getJSON = function(url, callback, name) {
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

const getDateString = function(date) {
	const m = date.getMonth() + 1
	const d = date.getDate()
	return date.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
}

const NOW   = new Date()
const TODAY = new Date(getDateString(NOW))

router.get("/shows", (req, res) => {
	const showsCount = shows.size()
	console.log("Tracking " + showsCount + " shows.")

	// Fetch show details from TVmaze API
	let waiting = showsCount

	shows.value().forEach((show) => {
		const lastUpdated = new Date(show.updated || 0)
		const nextEpisode = show.nextDate ? new Date(show.nextDate) : TODAY
		if (
			((NOW - lastUpdated) > UPDATE_INTERVAL)
			|| (nextEpisode && (TODAY > nextEpisode))
			|| req.query.force
		) {
			console.log("Getting fresh data for show:", show.name)
			fetchDataForShow(show)
		} else {
			console.log("Using cached data for show:", show.name)
			useDataForShow(show.name)
		}
	})

	function fetchDataForShow(show) {
		const showName = show.name

		let url = show.tvmaze ? "http://api.tvmaze.com/shows/" + show.tvmaze
			// : show.imdb ? "http://api.tvmaze.com/lookup/shows?imdb=" + show.imdb
			// ^ Doesn't work for most "in development" shows
			: "http://api.tvmaze.com/singlesearch/shows?q=" + encodeURIComponent(showName)

		console.log("Fetching data for show:", showName, url)
		getJSON(url, (showData, errorText) => {
			processDataForShow(showName, showData)
		}, "show " + showName)
	}

	function processDataForShow(showName, showData) {
		if (!showData || showData.status === 404) {
			console.log("No data for show:", showName)
			if (showData && showData.status === 404) {
				console.log("Bad TVmaze ID for show:", showName)
				const show = shows
					.find({ name: showName })
					.assign({ tvmaze: undefined })
					.value()
				fetchDataForShow(show)
			}
			return useDataForShow(showName)
		} else if (showData._links && showData._links.nextepisode) {
			console.log("Fetching data for next episode:", showName, showData._links.nextepisode.href)
			getJSON(showData._links.nextepisode.href, (epData, errText) => {
				useDataForShow(showName, showData, epData)
			}, "episode " + showName)
		} else {
			console.log("No next episode for show:", showName)
			return useDataForShow(showName, showData)
		}
	}

	function useDataForShow(showName, showData, epData) {
		if (typeof(showData) !== "undefined") {
			shows.find({ name: showName })
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
		console.log("Waiting on data for", waiting, "shows.")
		if (waiting === 0) {
			console.log("All data received.")
			return res.status(200).json(shows.value())
		}
	}
})

// EOF
module.exports = router

