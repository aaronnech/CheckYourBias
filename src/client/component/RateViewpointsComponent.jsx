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
				<div class="issue-wrapper">
					<h2>Someone said this!</h2>

					<p>Whatever your budget and whatever the size of car you are looking for, we are sure we can help you find what’s right for you. We sell new and used cars from Pollos to Porchas. To fully appreciate the range of cars we have on offer please visit one of our showrooms.</p>

					<p>We are County Council Trading Standards Approved as part of the Buy With Confidence scheme and all of our vehicles are HPI checked. So you know that your car is genuinely available for sale, doesn’t have any outstanding finance on it and that we are a reputable dealer. We also verify the mileage on all of the cars that we are selling and ensure that they are all sold with long MOTs and road tax.</p>
				</div>

				<div class="rate-scale">
					- <input type="range" min="0" max="5" step="0.1" value="2.5" /> +
				</div>
			</div>
		);
	}
});

module.exports = RateViewpointsComponent;