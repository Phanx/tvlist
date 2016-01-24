const React  = require("react")
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const ONEDAY = 1000 * 60 * 60 * 24


function getDateString(date) {
	var m = date.getMonth() + 1
	var d = date.getDate()
	return date.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
}
const TODAY = new Date(getDateString(new Date()))


module.exports = React.createClass({
	propTypes: {
		show: React.PropTypes.object
	},
	render: function() {
		var show = this.props.show
		var classList = "show row"
		var statusText

		if (show.nextDate) {
			var nextDate = new Date(show.nextDate)
			var daysToNext = Math.floor((nextDate - TODAY) / ONEDAY)
			if (daysToNext > 6) {
				classList += " afk"
				statusText  = ((show.nextDate == show.premiered) ? "Starts" : "Returns")
					+ " " + MONTHS[nextDate.getMonth()]
					+ " " + nextDate.getDate()
			} else {
				console.log("Next episode of " + show.name + " is on " + show.nextDate + " (" + daysToNext + " days from now)")
				// statusText = "Next: " + show.nextDate + " (" + daysToNext + " days)"
			}
		} else {
			classList += " afk"
			statusText = (show.status === "Running" || show.status === "To Be Determined") ? "On Break" : show.status
		}

		// Don't show ended shows; TODO: prune them on fetch
		// Leave them in for now -- TODO: add UI for removing manually
		/*if (statusText === "Ended") {
			return false
		}*/

		statusText = statusText ? (<p>{statusText}</p>) : false

		var showNameForURL = encodeURIComponent(show.name.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s\s+/g, " "))
		var prefQuery = show.pref ? " " + show.pref : ""

		var imdbURL = show.imdb
			? "http://www.imdb.com/title/" + show.imdb
			: "http://www.imdb.com/find?q=" + showNameForURL + "&s=tt"
		var tvmazeURL = show.tvmaze
			? "http://www.tvmaze.com/shows/" + show.tvmaze
			: "http://www.tvmaze.com/search?q=" + showNameForURL
		var katURL = show.kat
			? "https://kat.cr/" + showNameForURL.replace(/\s/, "-") + "-tv" + show.kat + "/"
			: "https://kat.cr/usearch/?q=" + showNameForURL + prefQuery + "%20category:tv&field=time_add&sorder=desc"

		return (
			<article className={classList}>
				<div className="col-xs-6 col-sm-8">
					<h2>{show.name}</h2>
					{statusText}
				</div>
				<div className="col-xs-6 col-sm-4">
					<ul className="dl-list">
						<li><a className="dl-imdb"   href={imdbURL}>IMDb</a></li>
						<li><a className="dl-tvmaze" href={tvmazeURL}>TVMaze</a></li>
						<li><a className="dl-kat"    href={katURL}>KAT</a></li>
						<li><a className="dl-rarbg"  href={"https://rarbg.to/torrents.php?search=" + showNameForURL + prefQuery}>RARBG</a></li>
						<li><a className="dl-tz"     href={"https://torrentz.eu/searchA?f=" + showNameForURL + prefQuery}>Torrentz</a></li>
					</ul>
				</div>
			</article>
		)
	}
})
