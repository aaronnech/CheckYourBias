var React = require('react');

/**
 * This component displays the app's icon
 *
 */
var CYBIconComponent = React.createClass({

	/**
	 * Renders the view
	 */
    render : function() {
        return (
        	<img
	        	style = {{
	        		maxHeight : '40px',
	        	}}
	        	src = "img/icon.logo.png"
        	/>
        )
	}
});

module.exports = CYBIconComponent;