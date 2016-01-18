var React = require("react")
var ReactDOM = require("react-dom")
var $ = require("jquery")
var LoadingDots = require("./components/LoadingDots")
var ShowList = require("./components/ShowList")

// Collect all the data from the TVMaze API, join it together,
// sort it, and pass it off to the renderer.

console.log("Fetching show list...")

$.getJSON("/api/shows", function(SHOWS) {
	console.log("Show list received...")

	var numShows = SHOWS.length
	var numFetched = 0

	var data = []
	var DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Unknown"]
	DAYS.forEach(function(day, i) {
		data.push({ name: day, shows: [] })
	})

	SHOWS.forEach(function(show) {
		var URL = "http://api.tvmaze.com/singlesearch/shows?q=" + encodeURIComponent(show.name.toLowerCase()) + "&embed=episodes"
		console.log("Fetching data for show: " + show.name + " @ " + URL)

		$.getJSON(URL, function(show) {
			numFetched++
			console.log("Received data for show: " + show.name + " (" + numFetched + "/" + numShows + ")")
			console.log(show)

			var i = DAYS.indexOf(show.schedule.days[0] || "Unknown")
			if (i === -1) {
				i = DAYS.indexOf("Unknown")
			}
			data[i].shows.push(show)
			data[i].shows.sort(function(a, b) {
				return a.name.toLowerCase().replace(/^the /, "") > b.name.toLowerCase().replace(/^the /, "")
			})

			if (numFetched === numShows) {
				console.log("All data received!")
				console.log(data)

				DAYS.pop() // remove "Unknown"
				DAYS.unshift(DAYS.pop()) // move "Sunday" from end to start
				var date = new Date()
				var day = date.getDay()
				if (date.getHours() < 17) {
					// Before 9 PM, show yesterday instead of today
					day = (day > 0) ? (day - 1) : (DAYS.length - 1)
				}

				ReactDOM.render(
					<ShowList data={data} today={DAYS[day]} />,
					document.getElementById("content")
				)
			}
		})
	})
})

ReactDOM.render(
	<LoadingDots />,
	document.getElementById("content")
)
