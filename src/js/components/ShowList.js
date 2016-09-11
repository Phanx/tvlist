const React = require("react")

const ShowListGroup = require("./ShowListGroup")

const ShowList = React.createClass({
	propTypes: {
		expandedDay   : React.PropTypes.string,
		id            : React.PropTypes.string,
		setExpandedDay: React.PropTypes.func.isRequired,
		setShowToEdit : React.PropTypes.func.isRequired,
		showData      : React.PropTypes.array.isRequired
	},
	onClickAddButton: function() {
		this.props.setShowToEdit("ADD")
	},
	render: function() {
		let showGroups = this.props.showData.map(day => {
			return (
				<ShowListGroup
					key={day.name}
					name={day.name}
					shows={day.shows}
					selected={day.name === this.props.expandedDay}
					setExpandedDay={this.props.setExpandedDay}
					setShowToEdit={this.props.setShowToEdit} />
			)
		})
		return (
			<section className="show-list" id={this.props.id} role="tablist">
				{showGroups}
				<button className="fab" id="fab-addshow" onClick={this.onClickAddButton}>Add Show</button>
			</section>
		)
	}
})

module.exports = ShowList
