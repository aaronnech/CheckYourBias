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
	    	issue: null,

	    	/**
	    	 * The issue's quoted text
	    	 */
	    	cardContent: "",

	    	/**
	    	 * The author of the quote
	    	 */
	    	author: "",

	    	/**
	    	 * Short version of the content text with author identity for the card's title
	    	 */
	    	cardTitle: "",

	    	/**
	    	 * How the user voted on agreement with this quote
	    	 */
	    	userVote: Constants.STANCES[4],

	    	/**
	    	 * The color corresponding to the user's vote
	    	 */
	    	userVoteColor: Constants.STANCE_COLORS[4],
	    };
	},

	componentDidMount : function() {
		var cur_issue = this.props.issue;
		var main_text = cur_issue.mainText;

		var short_text = main_text.split(" ").slice(0,3).join(" ") + "...";

		this.setState({
			issue: cur_issue,
			cardContent: main_text,
			cardTitle: short_text,
		});
	},

	/**
	 * Renders the view
	 */
	render : function() {
		return (
			<Card>
			  <CardHeader
			  	avatar="http://lorempixel.com/100/100/"
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