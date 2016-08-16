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

	var data = []
	var DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Ended","Pending"]
	DAYS.forEach(function(day, i) {
		data.push({ name: day, shows: [] })
	})

	SHOWS.forEach(function(show) {
		var i = DAYS.indexOf(show.weekday || "Pending")
		if (show.status === "Ended") {
			i = DAYS.indexOf("Ended")
		} else if (i === -1 || !show.nextDate || show.status === "In Development" || show.status === "To Be Determined") {
			i = DAYS.indexOf("Pending")
		}
		data[i].shows.push(show)
	})

	DAYS.pop() // remove "Pending"
	DAYS.unshift(DAYS.pop()) // move "Sunday" from end to start

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
