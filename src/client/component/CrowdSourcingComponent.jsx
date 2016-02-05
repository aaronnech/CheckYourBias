var React = require('react');
var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var CardText = require('material-ui/lib/card/card-text');

var CrowdsourcingComponent = React.createClass({
	onSelectPage : function(page) {
		this.setState({
			currentScreen: page
		})
	},

	render : function() {
		return (
			<Card className="submit-content">
				<CardText>
					<div className="main-content">
						<p>Form will go here</p>
					</div>
				</CardText>
			</Card>
		);
	}
});

module.exports = CrowdsourcingComponent;