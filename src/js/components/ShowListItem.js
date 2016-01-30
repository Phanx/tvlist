const React  = require("react")
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const ONEDAY = 1000 * 60 * 60 * 24


function getDateString(date) {
	var m = date.getMonth() + 1
	var d = date.getDate()
	return date.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
}
const TODAY = new Date(getDateString(new Date()))


const ShowListItem = React.createClass({
	propTypes: {
		item: React.PropTypes.shape({
			name     : React.PropTypes.string.isRequired,
			nextDate : React.PropTypes.string,
			premiered: React.PropTypes.string,
			status   : React.PropTypes.string,
			pref     : React.PropTypes.string,
			imdb     : React.PropTypes.string,
			kat      : React.PropTypes.oneOfType([
							React.PropTypes.number,
							React.PropTypes.string
						]),
			tvmaze   : React.PropTypes.number
		}).isRequired,
		setShowToEdit: React.PropTypes.func
	},
	handleRightClick: function(event) {
		event.preventDefault()
		this.props.setShowToEdit && this.props.setShowToEdit(this.props.item)
	},
	render: function() {
		var show = this.props.item
		var classList = "show row"
		var statusText

		if (show.nextDate) {
			var nextDate = new Date(show.nextDate)
			var daysToNext = Math.floor((nextDate - TODAY) / ONEDAY)
			if (daysToNext === 0) {
				statusText = "Today"
			} else {
				var nextDateText = MONTHS[nextDate.getMonth()] + " " + nextDate.getDate()
				if (daysToNext < 7) {
					statusText = "Next: " + nextDateText + " (" + daysToNext + " days)"
				} else {
					classList += " afk"
					statusText  = ((show.nextDate == show.premiered) ? "Starts" : "Returns")
						+ " " + nextDateText
				}
			}
		} else {
			classList += " afk"
			statusText = (show.status === "Running" || show.status === "To Be Determined")
				? "On Break" : show.status
		}

		// Don't show ended shows; TODO: prune them on fetch
		// Leave them in for now -- TODO: add UI for removing manually
		/*if (statusText === "Ended") {
			return false
		}*/

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
				<div className="col-xs-6 col-sm-8" onContextMenu={this.handleRightClick}>
					<h2>{show.name}</h2>
					<p className="status">{statusText}</p>
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

module.exports = ShowListItem
