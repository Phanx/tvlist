import React from "react"
import PropTypes from "prop-types"

const propTypes = {
	label   : PropTypes.string.isRequired,
	name    : PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	type    : PropTypes.string,
	value   : PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

const defaultProps = {
	type: "text"
}

const FormInput = (props) => {
	const { name, label, type, onChange, value, ...otherProps } = props
	return (
		<div className="form-group form-primary">
			<label htmlFor={"input-" + name}>
				{label}
			</label>
			<input {...otherProps}
				className="form-control"
				id={"input-" + name}
				type={type}
				name={name}
				onChange={onChange}
				value={value}
			/>
		</div>
	)
}

FormInput.defaultProps = defaultProps
FormInput.propTypes = propTypes

export default FormInput
