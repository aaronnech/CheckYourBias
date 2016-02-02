var React = require('react');

var UserProfileComponent = React.createClass({
	onSelectPage : function(page) {
		this.setState({
			currentScreen: page
		})
	},

	render : function() {
		return (
			<div className="user-profile">
				<div class="rate-scale">
					<h2>arent you proud of me ma?</h2>
				</div>
			</div>
		);
	}
});

module.exports = UserProfileComponent;