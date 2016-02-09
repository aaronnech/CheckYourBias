var React = require('react');

/**
  * Verifies min/max range.
  * @param   {Object} props         Properties of the React component.
  * @param   {String} propName      Name of the property to validate.
  * @param   {String} componentName Name of the component whose property is being validated.
  * @returns {Object} Returns an Error if min >= max otherwise null.
  */
minMaxPropType = function(props, propName, componentName) {
  var error = React.PropTypes.number(props, propName, componentName);
  if (error !== null) return error;

  if (props.min >= props.max) {
    var errorMsg = (propName === 'min') ? 'min should be less than max' : 'max should be greater than min';
    return new Error(errorMsg);
  }
};

/**
  * Verifies value is within the min/max range.
  * @param   {Object} props         Properties of the React component.
  * @param   {String} propName      Name of the property to validate.
  * @param   {String} componentName Name of the component whose property is being validated.
  * @returns {Object} Returns an Error if the value is not within the range otherwise null.
  */
valueInRangePropType = function(props, propName, componentName) {
  var error = React.PropTypes.number(props, propName, componentName);
  if (error !== null) return error;

  var value = props[propName];
  if (value < props.min || props.max < value) {
    return new Error(`${propName} should be within the range specified by min and max`);
  }
};


/**
 * This component is a general slider that is used across the entire application.
 * This component replaces React's <Slider> component.
 *
 * @author g-liu
 */
var SliderComponent = React.createClass({
	propTypes: {
		/**
		 * Maximum value of the slider
		 */
	    max: minMaxPropType,

	    /**
	     * Minimum value of the slider
	     */
	    min: minMaxPropType,

	    /**
	     * The granularity at which the slider can step through values.
	     */
	    step: React.PropTypes.number,

	    /**
	     * The value of the slider.
	     */
	    value: valueInRangePropType,

	    /**
	     * If true, the slider will not be interactable.
	     */
	    disabled: React.PropTypes.bool,

	    /**
	     * Name of the slider. Behaves like the name attribute
	     * of an input element
	     */
	    name: React.PropTypes.string,

	    /**
	     * Callback function that is fired when the focus has left the slider.
	     */
	    onBlur: React.PropTypes.func,

	    /**
	     * Callback function that is fired when the user changes the slider's value.
	     */
	    onChange: React.PropTypes.func,

	    /**
	     * Callback fired when the user has focused on the slider.
	     */
	    onFocus: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			disabled: false,
			min: 0,
			max: 1,
			step: 0.01,
			required: false,
			style: {},
		};
	},

	/**
	 * Renders the view
	 */
	render : function() {
		return (
			<input type="range"
				name={this.props.name}
				min={this.props.min}
				max={this.props.max}
				step={this.props.step}
				value={this.props.value}
				disabled={this.props.disabled} />
		);
	}
});

module.exports = SliderComponent;