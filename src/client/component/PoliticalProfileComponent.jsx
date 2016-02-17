var React = require('react');
var Constants = require('../Constants');

var DropDownMenu = require('material-ui/lib/drop-down-menu');
var MenuItem = require('material-ui/lib/menus/menu-item');

var PoliticalIssueComponent = require('./PoliticalIssueComponent.jsx');

/**
 * This component displays to the user their previously answered questions
 * and the candidates' ranking based on their answers.
 *
 * @author ravnon
 */
var PoliticalProfileComponent = React.createClass({
	/**
	 * Initial state of the component
	 */
	getInitialState : function() {
	    return {
	    	/**
	    	 * Whether or not to display the candidate who said the quote
	    	 */
	    	currentIssue: 1,
	    };
	},

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
			<div className="political-profile">
				<div className="issue-selector">
					<DropDownMenu value={this.state.currentIssue} onChange={this.changeIssue}>
						<MenuItem value={1} primaryText="Economy"/>
						<MenuItem value={2} primaryText="Foreign Policy"/>
						<MenuItem value={3} primaryText="Social Justice"/>
						<MenuItem value={4} primaryText="Marijuana Legalization"/>
						<MenuItem value={5} primaryText="Election Reform"/>
					</DropDownMenu>
				</div>
				<div className="rate-scale">
					<p className="indentSides">403 Issues Voted on!</p>
					<PoliticalIssueComponent className="issue-card"/>
				</div>
			</div>
		);
	}
});

module.exports = PoliticalProfileComponent;