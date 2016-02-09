var React = require('react');

/**
 * This component is a general slider that is used across the entire application.
 * This component replaces React's <Slider> component.
 *
 * @author g-liu
 */
var SliderComponent = React.createClass({
	/**
	 * Renders the view
	 */
	render : function() {
		return (
			<input type="range" min="0" max="5" step="0.01" />
		);
	}
});

module.exports = SliderComponent;