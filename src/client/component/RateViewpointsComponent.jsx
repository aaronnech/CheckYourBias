var React = require('react');
var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var CardText = require('material-ui/lib/card/card-text');
var CardActions = require('material-ui/lib/card/card-actions');
var Slider = require('material-ui/lib/slider');
var FlatButton = require('material-ui/lib/flat-button');

var RateViewpointsComponent = React.createClass({
	onSelectPage : function(page) {
		this.setState({
			currentScreen: page
		})
	},

	changeAgreement : function(event) {
		console.log("User changed agreement level");
	},

	confirmReaction : function() {
		// show user who said the issue.
		console.log("User confirmed reaction");
	},

	render : function() {
		return (
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
						<Slider min={0} max={5} defaultValue={2.5} onChange={this.changeAgreement} />
						<div className="agreement-labels">
							<span id="disagree-label">Strongly disagree</span>
							<span id="agree-label">Strongly agree</span>
						</div>
					</div>
					<FlatButton label="Confirm" primary={true} onClick={this.confirmReaction} />
				</CardActions>
			</Card>
		);
	}
});

module.exports = RateViewpointsComponent;