var $ = require("jquery")
var React = require("react")
var ReactDOM = require("react-dom")

var LoadingDots = React.createClass({
	render: function() {
		return (
			<div className="loading-dots">
				<span></span>
				<span></span>
				<span></span>
			</div>
		)
	}
})

var MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
var Show = React.createClass({
	render: function() {
		var show = this.props.show
		var nextEpisode = show._links && show._links.nextepisode && parseInt(show._links.nextepisode.href.match(/\d+$/)[0], 10)
		var statusText = null
		if (nextEpisode) {
			show._embedded.episodes.forEach(function(episode) {
				if (!statusText && episode.id === nextEpisode) {
					var today      = new Date()
					var airdate    = new Date(episode.airdate)
					var daysToNext = Math.floor((airdate - today) / (1000 * 60 * 60 * 24))

					if (daysToNext < 7) {
						statusText = " "
					}
					else {
						statusText = "Returns " + MONTH_NAMES[airdate.getMonth()] + " " + airdate.getDate()
					}
				}
			})
		}
		statusText = statusText || (show.status === "Running" ? "On Break" : show.status.replace("To Be Determined", "On Break"))

		// Don't show ended shows; TODO: prune them on fetch
		if (statusText === "Ended") {
			return false
		}

		statusText = (statusText.length > 1) ? (<p>{statusText}</p>) : ""

		var classList      = statusText ? "show row afk" : "show row"
		var showNameForURL = encodeURIComponent(show.name.replace(/[^\w\s]/g, ""))
		return (
			<article className={classList}>
				<div className="col-xs-12 col-sm-8">
					<h2>{show.name}</h2>
					{statusText}
				</div>
				<div className="col-xs-12 col-sm-4">
					<ul className="dl-list">
						<li><a className="dl-tvm" href={show.url}>TVMaze</a></li>
						<li><a className="dl-kat" href={"https://kat.cr/usearch/?q=" + showNameForURL + "&field=time_add&sorder=desc"}>KAT</a></li>
						<li><a className="dl-rar" href={"https://rarbg.to/torrents.php?search=" + showNameForURL}>RARBG</a></li>
						<li><a className="dl-tz"  href={"https://torrentz.eu/searchA?f=" + showNameForURL}>Torrentz</a></li>
					</ul>
				</div>
			</article>
		)
	}
})

var ShowGroup = React.createClass({
	handleHeaderClick: function(event) {
		var header = event.target.parentNode
		var thisDay = header.parentNode.id
		console.log('handleHeaderClick ' + thisDay)
		$(header.nextElementSibling).slideDown(200)
		$('#tv section').each(function() {
			if (this.id != thisDay) {
				$('.content', this).slideUp(200)
			}
		})
	},
	render: function() {
		var showItems = []
		this.props.shows.forEach(function(show) {
			showItems.push(<Show show={show} key={show.id} />)
		})

		var style = (!this.props.selected) ? { display: "none" } : null

		return (
			<section id={this.props.name.toLowerCase()}>
				<header>
					<h1 onClick={this.handleHeaderClick}>{this.props.name}</h1>
				</header>
				<div className="content" style={style}>
					{showItems}
				</div>
			</section>
		)
	}
})

var ShowList = React.createClass({
	render: function() {
		console.log('initial selection: ' + this.props.today)
		var selectedDay = this.props.today
		var showGroups = $.map(this.props.data, function(day) {
			return (
				<ShowGroup name={day.name} shows={day.shows} selected={day.name == selectedDay} key={day.name} />
			)
		})
		return (
			<section id="tv">
				{showGroups}
			</section>
		)
	}
})

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

	SHOWS.forEach(function(showName) {
		var URL = "http://api.tvmaze.com/singlesearch/shows?q=" + encodeURIComponent(showName.toLowerCase()) + "&embed=episodes"
		console.log("Fetching data for show: " + showName + " @ " + URL)

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

module.exports = {
	ShowList,
	ShowGroup,
	Show,
	LoadingDots
}

