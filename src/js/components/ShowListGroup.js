const React = require("react")
const $ = require("jquery")

const ShowListItem = require("./ShowListItem")

const ShowListGroup = React.createClass({
	propTypes: {
		name          : React.PropTypes.string.isRequired,
		shows         : React.PropTypes.array.isRequired,
		selected      : React.PropTypes.bool,
		setExpandedDay: React.PropTypes.func,
		setShowToEdit : React.PropTypes.func
	},
	onClickHeader: function(event) {
		var group = event.target.parentNode
		// TODO: replace with react css transition group
		if (this.props.selected) {
			// This one is already expanded, just collapse it.
			$(".content", group).slideUp(200, () => {
				this.props.setExpandedDay && this.props.setExpandedDay()
			})
		} else {
			// This one isn't expanded yet, collapse all others and expand it.
			$(group).siblings().each(function() {
				$(".content", this).slideUp(200)
			})
			$(".content", group).slideDown(200, () => {
				this.props.setExpandedDay && this.props.setExpandedDay(this.props.name)
			})
		}
	},
	render: function() {
		let id = this.props.name.toLowerCase()
		let empty = this.props.shows.length === 0
		let contentStyle = (!this.props.selected) ? { display: "none" } : null
		let showListItems = $.map(this.props.shows, (show, index) => {
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
					className="content"
					style={contentStyle}
					aria-hidden={!this.props.selected}
					aria-labelledby={id + "-header"}>

					{showListItems}

				</div>

			</section>
		)
	}
})

module.exports = ShowListGroup
