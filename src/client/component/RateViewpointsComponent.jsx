var React = require('react');
var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var CardText = require('material-ui/lib/card/card-text');
var CardActions = require('material-ui/lib/card/card-actions');
var Slider = require('material-ui/lib/slider');

var RateViewpointsComponent = React.createClass({
	onSelectPage : function(page) {
		this.setState({
			currentScreen: page
		})
	},

	render : function() {
		return (
			// <div className="rate-viewpoints">
			// 	<div className="issue-wrapper main-content">
			// 		<h2>Major issue!</h2>

			// 		<p>The text of the issue will appear here.</p>

			// 		<p>Right now this is just a placeholder.</p>
			// 	</div>

			// 	<div className="rate-scale">
			// 		<div className="slider-wrapper">
			// 			<input type="range" min="0" max="5" step="0.1" />
			// 		</div>
			// 		<div className="agreement-labels">
			// 			<span id="disagree-label">Strongly disagree</span>
			// 			<spCardan id="agree-label">Strongly agree</span>
			// 		</div>
			// 	</div>
			// </div>
			// <div className="rate-viewpoints">
				<Card className="rate-viewpoints">
					<CardTitle title="Major issue!" />
					<CardText>
						<div className="issue-wrapper main-content">
							<p>The text of the issue will appear here.</p>

							<p>Right now this is just a placeholder.</p>
						</div>
					</CardText>
					<CardActions>
						<div className="rate-scale">
							<Slider min={0} max={5} defaultValue={2.5} />
							<div className="agreement-labels">
								<span id="disagree-label">Strongly disagree</span>
								<span id="agree-label">Strongly agree</span>
							</div>
						</div>
					</CardActions>
				</Card>
			// </div>
		);
	}
});

module.exports = RateViewpointsComponent;