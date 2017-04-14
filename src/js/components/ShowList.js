import React from "react"

import ShowListGroup from "./ShowListGroup"

const ShowList = React.createClass({
	propTypes: {
		expandedSection   : React.PropTypes.string,
		id                : React.PropTypes.string,
		setExpandedSection: React.PropTypes.func.isRequired,
		setShowToEdit     : React.PropTypes.func.isRequired,
		showData          : React.PropTypes.array.isRequired
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
					selected={day.name === this.props.expandedSection}
					setExpandedSection={this.props.setExpandedSection}
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

export default ShowList
