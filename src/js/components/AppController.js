import React from "react"
import createReactClass from "create-react-class"

import LoadingDots from "./LoadingDots"
import ShowAdd  from "./ShowAdd"
import ShowEdit from "./ShowEdit"
import ShowList from "./ShowList"

const SECTIONS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Ended","Future"]

const getDateString = (date) => {
	const y = date.getFullYear()
	const m = date.getUTCMonth() + 1
	const d = date.getUTCDate()
	return y + "-" + (m < 10 ? `0${m}` : m) + "-" + (d < 10 ? `0${d}` : d)
}

const TODAYSTRING = getDateString(new Date())
const TODAY = new Date(TODAYSTRING)
const ONEDAY = 1000 * 60 * 60 * 24
const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

const ShowListController = createReactClass({
	getInitialState: function() {
		const currentDate = new Date()
		let initialDay = currentDate.getDay()
		if (currentDate.getHours() < 19) {
			// Before 9 PM, show yesterday instead of today
			initialDay = (initialDay > 0) ? (initialDay - 1) : (WEEKDAYS.length - 1)
		}
		return {
			expandedSection: WEEKDAYS[initialDay],
			shows: []
		}
	},
	componentDidMount: function() {
		this.fetchShowData()
	},
	render: function() {
		if (this.state.shows.length === 0) {
			return (
				<LoadingDots />
			)
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
					expandedSection={this.state.expandedSection}
					setExpandedSection={this.setExpandedSection}
					setShowToEdit={this.setShowToEdit}
					showData={this.state.shows} />
			)
		}
	},
	sortShows: function(a, b) {
		return a.name.toLowerCase().replace(/^the /, "")
			.localeCompare(b.name.toLowerCase().replace(/^the /, ""))
	},
	fetchShowData: function() {
		console.log("Fetching show list...")
		fetch("/api/shows" + window.location.search)
		.then(res => {
			if (res.status === 200) return res.json()
		})
		.then(data => {
			if (!data || !data.shows) return console.log("Error fetching show list!")

			const responseData = data.shows
			console.log("Show list received with", responseData.length, "shows.")

			const shows = []
			SECTIONS.map(title => {
				shows.push({
					name: title,
					shows: []
				})
			})

			responseData.sort(this.sortShows).forEach(function(show) {
				let i = SECTIONS.indexOf(show.weekday || "Future")
				if (show.status === "Ended") {
					i = SECTIONS.indexOf("Ended")
				} else if (i === -1 || !show.nextDate || show.status === "To Be Determined") {
					i = SECTIONS.indexOf("Future")
				}

				if (show.nextDate) {
					const nextDate = new Date(show.nextDate)
					show.daysToNext = Math.floor((nextDate - TODAY) / ONEDAY)
					if (show.daysToNext > 30) {
						i = SECTIONS.indexOf("Future")
					}
				}

				shows[i].shows.push(show)
			})

			// Iterate over non-day groups, starting at the end and working backward.
			for (let i = SECTIONS.length - 1; i > (WEEKDAYS.length - 1); i--) {
				// Remove empty non-day data groups.
				if (shows[i].shows.length === 0) {
					shows.splice(i, 1)
				}
			}

			this.setState({ shows: shows })
		})
		.catch(err => console.log(err))
	},
	setExpandedSection: function(day) {
		this.setState({ expandedSection: day })
	},
	setShowToEdit: function(show) {
		console.log("setShowToEdit", show)
		if (show === "REFRESH") {
			this.setState({
				editingShow: undefined,
				shows: []
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
	}
})

export default ShowListController
