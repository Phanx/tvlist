var React = require("react")
var ReactDOM = require("react-dom")
var $ = require("jquery")
var LoadingDots = require("./components/LoadingDots")
var ShowList = require("./components/ShowList")

// Collect all the data from the TVMaze API, join it together,
// sort it, and pass it off to the renderer.

console.log("Fetching show list...")

$.getJSON("/api/shows", function(SHOWS) {
	console.log("Show list received with", SHOWS.length, "shows.")

	function getDateString(date) {
		let y = date.getFullYear()
		let m = date.getUTCMonth() + 1
		let d = date.getUTCDate()
		return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
	}

	const TODAYSTRING = getDateString(new Date())
	const TODAY = new Date(TODAYSTRING)
	const ONEDAY = 1000 * 60 * 60 * 24


	var data = []
	var DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Ended","Future"]
	DAYS.forEach(function(day, i) {
		data.push({ name: day, shows: [] })
	})

	SHOWS.sort(function(a, b) {
		return a.name.toLowerCase().replace(/^the /, '') > b.name.toLowerCase().replace(/^the /, '')
	})
	SHOWS.forEach(function(show) {
		var i = DAYS.indexOf(show.weekday || "Future")
		if (show.status === "Ended") {
			i = DAYS.indexOf("Ended")
		} else if (i === -1 || !show.nextDate || show.status === "In Development" || show.status === "To Be Determined") {
			i = DAYS.indexOf("Future")
		}


		if (show.nextDate) {
			let nextDate = new Date(show.nextDate)
			show.daysToNext = Math.floor((nextDate - TODAY) / ONEDAY)
			if (show.daysToNext > 30) {
				i = DAYS.indexOf("Future")
			}
		}


		data[i].shows.push(show)
	})

	// Iterate over non-day groups, starting at the end and working backward.
	for (var i = DAYS.length - 1; i > 6; i--) {
		// Remove empty non-day data groups.
		if (data[i].shows.length === 0) {
			data.splice(i, 1)
		}
		// Remove non-day names from the DAYS array...
		DAYS.pop()
	}

	// ...and move "Sunday" from end to start because
	// getDay counts up from Sunday, not Monday.
	DAYS.unshift(DAYS.pop())

	var date = new Date()
	var day = date.getDay()
	if (date.getHours() < 17) {
		// Before 9 PM, show yesterday instead of today
		day = (day > 0) ? (day - 1) : (DAYS.length - 1)
	}

	ReactDOM.render(
		<ShowList data={data} initialDay={DAYS[day]} />,
		document.getElementById("content")
	)
})

ReactDOM.render(
	<LoadingDots />,
	document.getElementById("content")
)
