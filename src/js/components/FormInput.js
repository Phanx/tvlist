import React, { PropTypes } from "react"

const propTypes = {
	label   : PropTypes.string.isRequired,
	name    : PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	type    : PropTypes.string,
	value   : PropTypes.oneOfType([
					PropTypes.number,
					PropTypes.string
				])
}

const FormInput = (props) => {
	const { label, name, onChange, type, value } = props

	return (
		<div className="form-group form-primary">
			<label htmlFor={"input-" + name}>
				{label}
			</label>
			<input className="form-control"
				id={"input-" + name}
				type={type || "text"}
				name={name}
				onChange={onChange}
				value={value}
			/>
		</div>
	)
}

FormInput.propTypes = propTypes

export default FormInput
