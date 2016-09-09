const React = require("react")
const $ = require("jquery")

const FormInput = require("./FormInput")

const ShowAdd = React.createClass({
	propTypes: {
		callback: React.PropTypes.func
	},
	getInitialState: function() {
		return {
			name: "",
			submitting: false
		}
	},
	handleChange: function(event) {
		// console.log("handleChange", event.target.name, event.target.value)
		const value = event.target.value
		const newstate = {}
		if (value.length > 0 && value.trim().length > 0) {
			newstate.name = value
			newstate.error = undefined
		} else {
			newstate.name = ""
		}
		this.setState(newstate)
	},
	handleSubmit: function(event) {
		event.preventDefault()
		const name = this.state.name.trim()
		if (name.length > 0) {
			console.log("handleSubmit", name)
			const req = new XMLHttpRequest()
			req.open("POST", "/api/addshow", true)
			req.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
			req.onload = () => {
				if (req.status === 200 || req.status === 409) {
					const res = JSON.parse(req.responseText)
					console.log("submission succeeded:", req.status, res)
					this.props.callback && this.props.callback("REFRESH")
				} else {
					const res = JSON.parse(req.responseText)
					console.log("submission failed:", req.status, res)
					this.setState({
						submitting: false,
						error: res.error
					})
				}
			}
			req.onerror = () => {
				console.log("connection error:", req.status)
				this.setState({
					submitting: true,
					error: "Connection error!"
				})
			}
			req.send(JSON.stringify({ name: name }))
			this.setState({ submitting: true })
		}
	},
	handleCancel: function(event) {
		event.preventDefault()
		// Pass back up the chain
		this.props.callback && this.props.callback()
	},
	render: function() {
		return (
			<section id="editor">
				<h1>Add Show</h1>

				<form onSubmit={this.handleSubmit} onCancel={this.handleCancel}>
					<FormInput label="Show Name" name="name"
						value={this.state.name}
						onChange={this.handleChange} />

					<footer className="row reverse">
						<div className="col-xs">
							<button type="submit" className="btn btn-block btn-primary"
								disabled={this.state.submitting || this.state.name === ""}
								onClick={this.handleSubmit}>Save</button>
						</div>
						<div className="col-xs">
							<button type="cancel" className="btn btn-block"
								disabled={this.state.submitting}
								onClick={this.handleCancel}>Cancel</button>
						</div>
					</footer>

					<small>{this.state.error}</small>
				</form>
			</section>
		)
	}
})

module.exports = ShowAdd
