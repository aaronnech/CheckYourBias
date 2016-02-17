var React = require('react');
var Constants = require('../Constants');

var Card = require('material-ui/lib/card/card');
var CardHeader = require('material-ui/lib/card/card-header');
var CardText = require('material-ui/lib/card/card-text');

/**
 * This component displays to the user a political issue on which they voted on.
 *
 * @author ravnon
 */
var PoliticalIssueComponent = React.createClass({
	/**
	 * Initial state of the component
	 */
	getInitialState : function() {
	    return {
	    	/**
	    	 * The unique ID of the issue
	    	 */
	    	issueID: 420,

	    	/**
	    	 * The issue's quoted text
	    	 */
	    	content: "I want to sleep with my daughter",

	    	/**
	    	 * The author of the quote
	    	 */
	    	author: "Donald Trump",

	    	/**
	    	 * Short version of the content text with author identity for the card's title
	    	 */
	    	cardTitle: "I want to sleep... - Donald Trump",

	    	/**
	    	 * Short version of the content text with author identity for the card's title
	    	 */
	    	cardContent: "I want to sleep with my daughter. - Donald Trump",

	    	/**
	    	 * How the user voted on agreement with this quote
	    	 */
	    	userVote: Constants.STANCES[0],

	    	/**
	    	 * The color corresponding to the user's vote
	    	 */
	    	userVoteColor: Constants.STANCE_COLORS[0],
	    };
	},

	/**
	 * Callback that fires when the user has chosen a different issues category to examine
	 */
	changeIssue : function(event, index, value) {
		// TODO: show user the candidate who said the issue.
		// console.log("User confirmed reaction");
		this.setState({
			currentIssue: value
		});
	},

	/**
	 * Renders the view
	 */
	render : function() {
		return (
			<Card>
			  <CardHeader
			    title={this.state.cardTitle}
			    subtitle={this.state.userVote}
			    subtitleColor={this.state.userVoteColor}
			    actAsExpander={true}
			    showExpandableButton={true}
			  />
			  <CardText expandable={true}>
			    {this.state.cardContent}
			  </CardText>
			</Card>
		);
	}
});

module.exports = PoliticalIssueComponent;