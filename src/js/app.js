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
		var URL = "http://api.tvmaze.com/singlesearch/shows?q=" + encodeURIComponent(show.name.toLowerCase()) // + "&embed=episodes"
		console.log("Fetching data for show: " + show.name + " @ " + URL)

		$.getJSON(URL, function(showdata) {
			// console.log("----------")
			console.log("Received data for show: " + show.name + " (" + numFetched + "/" + numShows + ")")
			// console.log(showdata)

			if (showdata._links.nextepisode) {
				// console.log("Fetching next episode @ " + showdata._links.nextepisode.href)
				$.getJSON(showdata._links.nextepisode.href, function(episode) {
					// console.log("Received next episode for show: " + show.name)
					numFetched++
					showdata._embedded = {
						episodes: [ episode ]
					}
					addDataForShow(showdata)
				})
			} else {
				// console.log("No next episode")
				numFetched++
				showdata._embedded = {
					episodes: []
				}
				addDataForShow(showdata)
			}
		})
	})

	function addDataForShow(showdata) {
		var i = DAYS.indexOf(showdata.schedule.days[0] || "Unknown")
		if (i === -1) {
			i = DAYS.indexOf("Unknown")
		}
		data[i].shows.push(showdata)
		data[i].shows.sort(function(a, b) {
			return a.name.toLowerCase().replace(/^the /, "") > b.name.toLowerCase().replace(/^the /, "")
		})

		if (numFetched === numShows) {
			console.log("----------")
			console.log("All data received!")
			//console.log(data)
			processShowData()
		}
	}

	function processShowData() {
		DAYS.pop() // remove "Unknown"
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
	}
})

ReactDOM.render(
	<LoadingDots />,
	document.getElementById("content")
)

