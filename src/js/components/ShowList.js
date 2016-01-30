const React = require("react")
const $ = require("jquery")

const ShowEdit = require("./ShowEdit")
const ShowListGroup = require("./ShowListGroup")

function sortByName(a, b) {
	return a.name.toLowerCase().replace(/^the /, '') > b.name.toLowerCase().replace(/^the /, '')
}

const ShowList = React.createClass({
	propTypes: {
		data      : React.PropTypes.array.isRequired,
		id        : React.PropTypes.string,
		initialDay: React.PropTypes.string
	},
	getInitialState: function() {
		return {
			editingShow: false
		}
	},
	setShowToEdit: function(show) {
		console.log("setShowToEdit", show)
	//	if (show === "REFRESH") {
	//		document.location.reload(true)
	//	} else {
			this.setState({ editingShow: show || false })
	//	}
	},
	render: function() {
		const editingShow = this.state.editingShow
		if (editingShow && editingShow !== "REFRESH") {
			return (
				<ShowEdit
					item={editingShow}
					whenDoneEditing={this.setShowToEdit} />
			)
		} else {
			var showGroups = $.map(this.props.data, (day) => {
				return (
					<ShowListGroup
						key={day.name}
						name={day.name}
						shows={day.shows.sort(sortByName)}
						selected={day.name === this.props.initialDay}
						setShowToEdit={this.setShowToEdit} />
				)
			})
			return (
				<section className="show-list" id={this.props.id}>
					{showGroups}
				</section>
			)
		}
	}
})

module.exports = ShowList
