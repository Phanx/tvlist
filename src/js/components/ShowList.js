const React = require("react")

const ShowEdit = require("./ShowEdit")
const ShowListGroup = require("./ShowListGroup")

const ShowList = React.createClass({
	propTypes: {
		data      : React.PropTypes.array.isRequired,
		id        : React.PropTypes.string,
		initialDay: React.PropTypes.string
	},
	getInitialState: function() {
		return {
			editingShow: false,
			expandedDay: this.props.initialDay
		}
	},
	setExpandedDay: function(day) {
		this.setState({ expandedDay: day })
	},
	setShowToEdit: function(show) {
		if (show === "REFRESH") {
			// TODO: refresh in-place so the expanded day is preserved
			document.location.reload(true)
		} else {
			this.setState({ editingShow: show || false })
		}
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
			let showGroups = []
			this.props.data.forEach((day) => {
				showGroups.push(
					<ShowListGroup
						key={day.name}
						name={day.name}
						shows={day.shows}
						selected={day.name === this.state.expandedDay}
						setExpandedDay={this.setExpandedDay}
						setShowToEdit={this.setShowToEdit} />
				)
			})
			return (
				<section className="show-list" id={this.props.id} role="tablist">
					{showGroups}
				</section>
			)
		}
	}
})

module.exports = ShowList
