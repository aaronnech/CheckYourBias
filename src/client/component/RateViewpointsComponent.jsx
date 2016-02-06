var React = require('react');
var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var CardText = require('material-ui/lib/card/card-text');
var CardActions = require('material-ui/lib/card/card-actions');
var Slider = require('material-ui/lib/slider');
var RaisedButton = require('material-ui/lib/raised-button');

var RateViewpointsComponent = React.createClass({
	onSelectPage : function(page) {
		this.setState({
			currentScreen: page
		})
	},

	changeAgreement : function(event) {
		// TODO: store the new agreement level in the component state
		// console.log("User changed agreement level");
	},

	confirmReaction : function() {
		// TODO: show user the candidate who said the issue.
		// console.log("User confirmed reaction");
	},

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
							<input type="range" min="0" max="5" step="0.01"
								onChange={this.changeAgreement} />
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