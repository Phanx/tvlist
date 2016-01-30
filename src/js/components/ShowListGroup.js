const React = require("react")
const $ = require("jquery")

const ShowListItem = require("./ShowListItem")

const ShowListGroup = React.createClass({
	propTypes: {
		name         : React.PropTypes.string.isRequired,
		shows        : React.PropTypes.array.isRequired,
		selected     : React.PropTypes.bool,
		setShowToEdit: React.PropTypes.func
	},
	onClickHeader: function(event) {
		var group = event.target.parentNode.parentNode
		console.log("onClickHeader " + group.id)
		$(".content", group).slideDown(200)
		$(group).siblings().each(function() {
			$(".content", this).slideUp(200)
		})
	},
	render: function() {
		var contentStyle = (!this.props.selected) ? { display: "none" } : null
		var showListItems = $.map(this.props.shows, (show, index) => {
			return (
				<ShowListItem item={show} key={show.name} setShowToEdit={this.props.setShowToEdit} />
			)
		})
		return (
			<section className="show-group" id={this.props.name.toLowerCase()}>
				<header>
					<h1 onClick={this.onClickHeader}>{this.props.name}</h1>
				</header>
				<div className="content" style={contentStyle}>
					{showListItems}
				</div>
			</section>
		)
	}
})

module.exports = ShowListGroup
