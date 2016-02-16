var React = require('react');
var Constants = require('../Constants');

var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var CardMedia = require('material-ui/lib/card/card-media');
var CardText = require('material-ui/lib/card/card-text');
var CardActions = require('material-ui/lib/card/card-actions');
var StanceSelector = require('./StanceSelector.jsx');
var RaisedButton = require('material-ui/lib/raised-button');

/**
 * This component allows the user to indicate their level of
 * agreement or disagreement on a political issue
 *
 * @author g-liu
 */
var RateViewpointsComponent = React.createClass({
	/**
	 * Initial state of the component
	 */
	getInitialState : function() {
		// TODO: hook up to backend to retrieve quote and attribution
	    return {
	    	/**
	    	 * Whether or not to display the candidate who said the quote
	    	 */
	    	candidateShown: false,

	    	/**
	    	 * A text representation of what the candidate said
	    	 */
			issueText: "I am issue text. Duis lectus ligula, fermentum sit amet sapien ut, aliquet varius ante. Sed sit amet gravida orci, eu mollis eros. Fusce vestibulum dolor quis massa tempor consectetur. Sed id placerat neque. Maecenas in justo eget sem faucibus maximus. Morbi sodales varius sem, quis ultricies velit tincidunt sed.",

			/**
			 * The name of the candidate who said the text
			 */
			issueAttributionName: "Bernard Sanders",
			
			/**
			 * A relative path to an image of the candidate
			 */
			issueAttributionImage: "bernie_sanders2.jpg",

			/** 
			 *	The user's stance on the issue
			 */
			userStance: null,
	    };
	},

	/**
	 * Callback that fires when user selects this component
	 * @param page
	 */
	onSelectPage : function(page) {
		this.setState({
			currentScreen: page
		});
	},

	/**
	 * Callback that fires when the user has confirmed their level of agreement
	 */
	confirmReaction : function() {
		// TODO: show user the candidate who said the issue.
		// console.log("User confirmed reaction");
		this.setState({
			candidateShown: true
		});
	},

	/**
	 * Retrieves a random quote from a candidate, and displays it to the user
	 */
	getQuote : function() {
		// TODO: replace text shown with new data from backend source
		this.setState({
			candidateShown: false
		});
	},

	/**
     * Updates the user's stance
     */
    handleUpdateStance : function(value) {
        this.setState({
            value: value,
        });
    },

	/**
	 * Renders the view
	 */
	render : function() {
		return (
			<Card className="rate-viewpoints">
				<CardTitle title="Major issue!" />
				
				<CardMedia overlay={<CardTitle title={this.state.issueAttributionName} />}
					style={{display: this.state.candidateShown ? 'block' : 'none'}}>
					<img src={'img/' + this.state.issueAttributionImage} />
				</CardMedia>
				
				<CardText className="issue-wrapper">
					<p>{this.state.issueText}</p>
				</CardText>
				<CardActions>
					<div className="rate-scale"
					  style={{display: this.state.candidateShown ? 'none' : 'block', textAlign: 'center'}}>
						<StanceSelector value={this.state.userStance} handleUpdateStance={this.handleUpdateStance} />
					</div>
					<div className="confirm-choice-wrapper" style={{display: this.state.candidateShown ? 'none' : 'block'}}>
						<RaisedButton label="Who said it?"
							onClick={this.confirmReaction}
							style={{marginTop: '1em'}} />
					</div>
					<div className="next-candidate-wrapper" style={{display: this.state.candidateShown ? 'block' : 'none'}}>
						<RaisedButton label="Next"
							onClick={this.getQuote}
							style={{marginTop: '1em'}} />
					</div>
				</CardActions>
			</Card>
		);
	}
});

module.exports = RateViewpointsComponent;