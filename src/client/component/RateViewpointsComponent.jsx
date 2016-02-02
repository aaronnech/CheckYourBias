var React = require('react');

var RateViewpointsComponent = React.createClass({
	onSelectPage : function(page) {
		this.setState({
			currentScreen: page
		})
	},

	render : function() {
		return (
			<div className="rate-viewpoints">
				<div className="issue-wrapper main-content">
					<h2>Major issue!</h2>

					<p>The text of the issue will appear here.</p>

					<p>Right now this is just a placeholder.</p>
				</div>

				<div className="rate-scale">
					<div className="slider-wrapper">
						<input type="range" min="0" max="5" step="0.1" />
					</div>
					<div className="agreement-labels">
						<span id="disagree-label">Strongly disagree</span>
						<span id="agree-label">Strongly agree</span>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = RateViewpointsComponent;