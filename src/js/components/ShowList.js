import React from "react"
import createReactClass from "create-react-class"
import PropTypes from "prop-types"

import ShowListGroup from "./ShowListGroup"

const ShowList = createReactClass({
	propTypes: {
		expandedSection   : PropTypes.string,
		id                : PropTypes.string,
		setExpandedSection: PropTypes.func.isRequired,
		setShowToEdit     : PropTypes.func.isRequired,
		showData          : PropTypes.array.isRequired
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
