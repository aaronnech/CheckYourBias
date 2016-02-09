var React = require('react');

var PoliticalProfileComponent = React.createClass({
	onSelectPage : function(page) {
		this.setState({
			currentScreen: page
		})
	},

	render : function() {
		return (
			<div className="political-profile">
				<div class="rate-scale">
					<p class="indentSides">403 Issues Voted on!</p>
					<h3>Your Candidates:</h3>
					<ol>
						<li>Bernie Sanders</li>
						<li>Carly Fiorina</li>
						<li>Jim Webb</li>
					</ol>
				</div>
			</div>
		);
	}
});

module.exports = PoliticalProfileComponent;