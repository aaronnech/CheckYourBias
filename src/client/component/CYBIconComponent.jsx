var React = require('react');

var CYBIconComponent = React.createClass({
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