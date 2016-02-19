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
	    	 * The issue's unique ID
	    	 */
	    	issue_id: null,

	    	/**
	    	 * The issue object
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
	    	userVote: 0,

	    	/**
	    	 * The color corresponding to the user's vote
	    	 */
	    	userVoteColor: Constants.STANCE_COLORS[4],
	    };
	},

	componentDidMount : function() {
		var issue_id = this.props.issue_id;
		var user_rating = this.props.rating;

		var cur_issue = this.props.issue;
		var main_text = cur_issue.mainText;

		var short_text = main_text.split(" ").slice(0,3).join(" ") + "...";

		this.setState({
			issue_id: issue_id,
			userVote: user_rating,
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
			    title={this.state.cardTitle}
			    subtitle={Constants.STANCES[this.state.userVote]}
			    subtitleColor={Constants.STANCE_COLORS[this.state.userVote]}
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