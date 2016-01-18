var React = require("react")

var MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

module.exports = React.createClass({
	propTypes: {
		show: React.PropTypes.object
	},
	render: function() {
		var show = this.props.show
		var nextEpisode = show._links
			&& show._links.nextepisode
			&& parseInt(show._links.nextepisode.href.match(/\d+$/)[0], 10)
		var statusText = null
		if (nextEpisode) {
			show._embedded.episodes.forEach(function(episode) {
				if (!statusText && episode.id === nextEpisode) {
					var today      = new Date()
					var airdate    = new Date(episode.airdate)
					var daysToNext = Math.floor((airdate - today) / (1000 * 60 * 60 * 24))

					if (daysToNext < 6) {
						statusText = " "
					}
					else {
						statusText = (episode.airdate == show.premiered) ? "Starts" : "Returns"
						statusText += " " + MONTH_NAMES[airdate.getMonth()] + " " + airdate.getDate()
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
		var showNameForURL = encodeURIComponent(show.name.replace(/[^\w\s]/g, " ").replace(/\s\s+/g, " "))
		return (
			<article className={classList}>
				<div className="col-xs-12 col-sm-8">
					<h2>{show.name}</h2>
					{statusText}
				</div>
				<div className="col-xs-12 col-sm-4">
					<ul className="dl-list">
						<li><a className="dl-tvm" href={show.url}>TVMaze</a></li>
						<li><a className="dl-kat" href={"https://kat.cr/usearch/?q=" + showNameForURL + "%20category:tv&field=time_add&sorder=desc"}>KAT</a></li>
						<li><a className="dl-rar" href={"https://rarbg.to/torrents.php?search=" + showNameForURL}>RARBG</a></li>
						<li><a className="dl-tz"  href={"https://torrentz.eu/searchA?f=" + showNameForURL}>Torrentz</a></li>
					</ul>
				</div>
			</article>
		)
	}
})
