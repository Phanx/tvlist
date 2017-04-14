import React, { PropTypes } from "react"
import $ from "jquery"

import ShowListItem from "./ShowListItem"

const ShowListGroup = React.createClass({
	propTypes: {
		name          : PropTypes.string.isRequired,
		shows         : PropTypes.array.isRequired,
		selected      : PropTypes.bool,
		setExpandedSection: PropTypes.func,
		setShowToEdit : PropTypes.func
	},
	onClickHeader: function(event) {
		const group = event.target.parentNode
		// TODO: replace with react css transition group
		if (this.props.selected) {
			// This one is already expanded, just collapse it.
			$(".content", group).slideUp(200, () => {
				this.props.setExpandedSection && this.props.setExpandedSection()
			})
		} else {
			// This one isn't expanded yet, collapse all others and expand it.
			$(group).siblings().each(function() {
				$(".content", this).slideUp(200)
			})
			$(".content", group).slideDown(200, () => {
				this.props.setExpandedSection && this.props.setExpandedSection(this.props.name)
			})
		}
	},
	render: function() {
		const id = this.props.name.toLowerCase()
		const empty = this.props.shows.length === 0
		const contentStyle = (empty || !this.props.selected) ? { display: "none" } : null
		const showListItems = this.props.shows.map((show) => {
			return (
				<ShowListItem item={show} key={show.name} setShowToEdit={this.props.setShowToEdit} />
			)
		})
		return (
			<section
				id={id}
				className={"show-group" + (empty ? " empty" : "")}>

				<h1
					id={id + "-header"}
					onClick={!empty ? this.onClickHeader : null}
					aria-controls={id + "-content"}
					aria-expanded={this.props.selected}
					aria-selected={this.props.selected}
					role="tab">

					{this.props.name}

				</h1>

				<div
					id={id + "-content"}
					className="content row"
					style={contentStyle}
					aria-hidden={empty || !this.props.selected}
					aria-labelledby={id + "-header"}>

					{showListItems}

				</div>

			</section>
		)
	}
})

export default ShowListGroup
