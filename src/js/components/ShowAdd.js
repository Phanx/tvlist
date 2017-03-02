import React from "react"

import FormInput from "./FormInput"

const ShowAdd = React.createClass({
	propTypes: {
		callback: React.PropTypes.func
	},

	getInitialState: function() {
		return {
			error: "",
			name : "",
			submitting: false
		}
	},

	render: function() {
		return (
			<section id="editor">
				<h1>Add Show</h1>

				<form onSubmit={this.handleSubmit}>
					<FormInput
						label="Show Name"
						name="name"
						onChange={this.handleChange}
						value={this.state.name}
					/>

					<footer className="row reverse">
						<div className="col-xs">
							<button
								className="btn btn-block btn-primary"
								disabled={this.state.submitting || this.state.name.length === 0}
								onClick={this.handleSubmit}
								type="submit"
							>
								{this.state.submitting ? "Saving..." : "Save"}
							</button>
						</div>
						<div className="col-xs">
							<button
								className="btn btn-block"
								disabled={this.state.submitting}
								onClick={this.handleCancel}
								type="cancel"
							>
								Cancel
							</button>
						</div>
					</footer>

					<small>
						{this.state.error}
					</small>
				</form>
			</section>
		)
	},

	handleChange: function(event) {
		// console.log("handleChange", event.target.name, event.target.value)
		const value = event.target.value

		const newstate = {}
		if (value.length > 0 && value.trim().length > 0) {
			newstate.name = value
			newstate.error = ""
		} else {
			newstate.name = ""
		}

		this.setState({ newstate })
	},

	handleSubmit: function(event) {
		event.preventDefault()

		const name = this.state.name.trim()
		// console.log("handleSubmit", name)

		if (name.length === 0) {
			return
		}

		const req = new XMLHttpRequest()

		req.onload = () => {
			if (req.status === 200 || req.status === 409) {
				// const res = JSON.parse(req.responseText)
				// console.log("submission succeeded:", req.status, res)
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
				submitting: false,
				error: "Connection error!"
			})
		}

		req.open("POST", "/api/addshow", true)
		req.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
		req.send(JSON.stringify({ name: name }))

		this.setState({ submitting: true })
	},

	handleCancel: function(event) {
		event.preventDefault()
		// Pass back up the chain
		this.props.callback && this.props.callback()
	},
})

export default ShowAdd
