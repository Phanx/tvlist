const React = require("react")

const FormInput = React.createClass({
	propTypes: {
		label   : React.PropTypes.string.isRequired,
		name    : React.PropTypes.string.isRequired,
		value   : React.PropTypes.oneOfType([
						React.PropTypes.number,
						React.PropTypes.string
					]),
		onChange: React.PropTypes.func.isRequired
	},
	render: function() {
		return (
			<div className="form-group form-primary">
				<label htmlFor={"input-" + this.props.name}>{this.props.label}</label>
				<input type={this.props.type || "text"}
					id={"input-" + this.props.name}
					name={this.props.name}
					ref={this.props.name}
					value={this.props.value}
					onChange={this.props.onChange}
					className="form-control" />
			</div>
		)
	}
})

module.exports = FormInput
