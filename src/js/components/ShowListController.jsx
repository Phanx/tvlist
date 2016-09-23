const React    = require("react")

const LoadingDots = require("./LoadingDots")
const ShowAdd     = require("./ShowAdd")
const ShowEdit    = require("./ShowEdit")
const ShowList    = require("./ShowList")

const getDateString = function(date) {
	let y = date.getFullYear()
	let m = date.getUTCMonth() + 1
	let d = date.getUTCDate()
	return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
}

const TODAYSTRING = getDateString(new Date())
const TODAY = new Date(TODAYSTRING)
const ONEDAY = 1000 * 60 * 60 * 24
const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

const ShowListController = React.createClass({
	getInitialState: function() {
		let currentDate = new Date()
		let initialDay = currentDate.getDay()
		if (currentDate.getHours() < 19) {
			// Before 9 PM, show yesterday instead of today
			initialDay = (initialDay > 0) ? (initialDay - 1) : (WEEKDAYS.length - 1)
		}
		return {
			expandedDay: WEEKDAYS[initialDay],
			showData: []
		}
	},
	fetchShowData: function() {
		console.log("Fetching show list...")
		const req = new XMLHttpRequest()
		req.open("GET", "/api/shows", true)
		req.onload = () => {
			if (req.status === 200) {
				const SHOWS = JSON.parse(req.responseText)
				console.log("Show list received with", SHOWS.length, "shows.")

				const showData = []
				const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Ended","Future"]
				DAYS.forEach(function(day, i) {
					showData.push({
						name: day,
						shows: []
					})
				})

				SHOWS.sort(function(a, b) {
					return a.name.toLowerCase().replace(/^the /, '').localeCompare(b.name.toLowerCase().replace(/^the /, ''))
				})
				SHOWS.forEach(function(show) {
					let i = DAYS.indexOf(show.weekday || "Future")
					if (show.status === "Ended") {
						i = DAYS.indexOf("Ended")
					} else if (i === -1 || !show.nextDate || show.status === "To Be Determined") {
						i = DAYS.indexOf("Future")
					}

					if (show.nextDate) {
						let nextDate = new Date(show.nextDate)
						show.daysToNext = Math.floor((nextDate - TODAY) / ONEDAY)
						if (show.daysToNext > 30) {
							i = DAYS.indexOf("Future")
						}
					}

					showData[i].shows.push(show)
				})

				// Iterate over non-day groups, starting at the end and working backward.
				for (var i = DAYS.length - 1; i > (WEEKDAYS.length - 1); i--) {
					// Remove empty non-day data groups.
					if (showData[i].shows.length === 0) {
						showData.splice(i, 1)
					}
				}

				this.setState({ showData: showData })
			} else {
				// server returned an error :(
			}
		}
		req.onerror = () => {
			// connection error :(
		}
		req.send()
	},
	setExpandedDay: function(day) {
		this.setState({ expandedDay: day })
	},
	setShowToEdit: function(show) {
		console.log("setShowToEdit", show)
		if (show === "REFRESH") {
			this.setState({
				editingShow: undefined,
				showData: []
			})
			this.fetchShowData()
		} else if (show === "ADD") {
			this.setState({
				editingShow: true
			})
		} else {
			this.setState({
				editingShow: show || undefined
			})
		}
	},
	componentDidMount: function() {
		this.fetchShowData()
	},
	render: function() {
		if (!this.state.showData.length) {
			return <LoadingDots />
		} else if (this.state.editingShow === true) {
			return (
				<ShowAdd
					callback={this.setShowToEdit} />
			)
		} else if (this.state.editingShow) {
			return (
				<ShowEdit
					item={this.state.editingShow}
					callback={this.setShowToEdit} />
			)
		} else {
			return (
				<ShowList
					showData={this.state.showData}
					expandedDay={this.state.expandedDay}
					setExpandedDay={this.setExpandedDay}
					setShowToEdit={this.setShowToEdit} />
			)
		}
	}
})

module.exports = ShowListController
