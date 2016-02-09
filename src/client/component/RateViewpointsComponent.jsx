var React = require('react');
var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var CardText = require('material-ui/lib/card/card-text');
var CardActions = require('material-ui/lib/card/card-actions');
var Slider = require('./SliderComponent.jsx');
var RaisedButton = require('material-ui/lib/raised-button');

/**
 * This component allows the user to indicate their level of
 * agreement or disagreement on a political issue
 *
 * @author g-liu
 */
var RateViewpointsComponent = React.createClass({
	/**
	 * Callback that fires when user selects this component
	 * @param page
	 */
	onSelectPage : function(page) {
		this.setState({
			currentScreen: page
		})
	},

	/**
	 * Callback that fires when the user has confirmed their level of agreement
	 */
	confirmReaction : function() {
		// TODO: show user the candidate who said the issue.
		// console.log("User confirmed reaction");
	},

	/**
	 * Renders the view
	 */
	render : function() {
		return (
			<Card className="rate-viewpoints">
				<CardTitle title="Major issue!" />
				<CardText className="issue-wrapper">
					<p>The text of the issue will appear here. Duis lectus ligula, fermentum sit amet sapien ut, aliquet varius ante. Sed sit amet gravida orci, eu mollis eros. Fusce vestibulum dolor quis massa tempor consectetur. Sed id placerat neque. Maecenas in justo eget sem faucibus maximus. Morbi sodales varius sem, quis ultricies velit tincidunt sed.
					</p>
				</CardText>
				<CardActions>
					<div className="rate-scale">
						<div className="slider-wrapper">
							<Slider min="1" max="5" step="0.5" />
						</div>
					</div>
					<div className="confirm-choice-wrapper">
						<RaisedButton label="Next" secondary={true} onClick={this.confirmReaction} style={{marginTop: '1em'}} />
					</div>
				</CardActions>
			</Card>
		);
	}
});

module.exports = RateViewpointsComponent;