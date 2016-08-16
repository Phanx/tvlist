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
		console.log("onClickHeader", group.id, this.props.name)
		// TODO: replace with react css transition group
		$(group).siblings().each(function() {
			$(".content", this).slideUp(200)
		})
		$(".content", group).slideDown(200, () => {
			this.props.setExpandedDay && this.props.setExpandedDay(this.props.name)
		})
	},
	render: function() {
		let empty = this.props.shows.length === 0
		let contentStyle = (!this.props.selected) ? { display: "none" } : null
		let showListItems = $.map(this.props.shows, (show, index) => {
			return (
				<ShowListItem item={show} key={show.name} setShowToEdit={this.props.setShowToEdit} />
			)
		})
		return (
			<section className={"show-group" + (empty ? " empty" : "")} id={this.props.name.toLowerCase()}>
				<h1 onClick={!empty ? this.onClickHeader : null}>{this.props.name}</h1>
				<div className="content" style={contentStyle}>
					{showListItems}
				</div>
			</section>
		)
	}
})

module.exports = ShowListGroup
