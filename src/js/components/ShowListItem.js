const React  = require("react")

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

const ShowListItem = React.createClass({
	propTypes: {
		item: React.PropTypes.shape({
			name	 : React.PropTypes.string.isRequired,
			nextDate : React.PropTypes.string,
			premiered: React.PropTypes.string,
			status   : React.PropTypes.string,
			pref	 : React.PropTypes.string,
			imdb	 : React.PropTypes.string,
			tvmaze   : React.PropTypes.number
		}).isRequired,
		setShowToEdit: React.PropTypes.func
	},
	handleMouseDown: function(event) {
		if (event.target.tagName === "a") {
			return
		}
		clearTimeout(this.longPressTimer)
		this.isLongPress = false
		if (event.button === 0) { // left button
			this.longPressTimer = setTimeout(() => {
				this.isLongPress = true
				this.gotoEdit()
			}, 1000)
		}
	},
	handleMouseUp: function(event) {
		if (event.target.tagName.toLowerCase() === "a") {
			return
		}
		clearTimeout(this.longPressTimer)
		if (event.button === 1) { // middle button
			this.gotoEdit()
		}
	},
	gotoEdit: function() {
		this.props.setShowToEdit && this.props.setShowToEdit(this.props.item)
	},
	render: function() {
		let show = this.props.item
		let classList = "show"

		let title = show.name
		if (show.image) {
			title = <img alt={show.name} title={show.name} src={show.image} />
		}


		let statusText
		if (show.daysToNext === 0) {
			//statusText = <p className="status">Today</p>
		} else if (show.nextDate) {
			let nextDate = new Date(show.nextDate)
			let nextDateText = MONTHS[nextDate.getUTCMonth()] + " " + nextDate.getUTCDate()
			if (show.daysToNext <= 7) {
				statusText = (
					<p className="status">
						<span className="visuallyhidden">Next</span>
						<date dateTime={nextDate.toISOString()}>{nextDateText}</date>
					</p>
				)
			} else {
				classList += " afk"
				statusText = (
					<p className="status">
						<span className="visuallyhidden">{show.nextDate == show.premiered ? "Starts" : "Returns"}</span>
						<date dateTime={nextDate.toISOString()}>{nextDateText}</date>
					</p>
				)
			}
		} else {
			classList += " afk"
			//statusText = (show.status === "Running" || show.status === "To Be Determined") ? "On Break" : show.status
		}


		let showNameForURL = encodeURIComponent(show.name.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s\s+/g, " "))
		let prefQuery = show.pref ? " " + show.pref : ""

		let links = []

		if (show.imdb) {
			links.push(<li key="imdb"><a className="dl-imdb" href={"http://www.imdb.com/title/" + show.imdb}>IMDb</a></li>)
		} else {
			links.push(<li key="imdb"><a className="dl-imdb" href={"http://www.imdb.com/find?q=" + showNameForURL + "&s=tt"}>IMDb</a></li>)
		}

		if (show.tvmaze) {
			links.push(<li key="tvmaze"><a className="dl-tvmaze" href={"http://www.tvmaze.com/shows/" + show.tvmaze}>TVMaze</a></li>)
		} else {
			links.push(<li key="tvmaze"><a className="dl-tvmaze" href={"http://www.tvmaze.com/search?q=" + showNameForURL}>TVMaze</a></li>)
		}

		links.push(<li key="rarbg"><a className="dl-rarbg" href={"https://rarbg.to/torrents.php?search=" + showNameForURL + prefQuery}>RARBG</a></li>)

		return (
			<article className={"col-xs-4 col-sm-3 col-md-2 col-lg-1 " + classList}
				 onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
				<h2 className="title">
					{title}
				</h2>
				{statusText}
				<ul className="dl-list">
					{links}
				</ul>
			</article>
		)
	}
})

module.exports = ShowListItem
