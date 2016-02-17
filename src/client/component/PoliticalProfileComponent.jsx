var React = require('react');
var Constants = require('../Constants');
var Cache = require('../Cache');

var DropDownMenu = require('material-ui/lib/drop-down-menu');
var MenuItem = require('material-ui/lib/menus/menu-item');

var PoliticalIssueComponent = require('./PoliticalIssueComponent.jsx');

var User = require('../../common/User');

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
	    	currentIssue: 0,

	    	/**
	    	 * list of categories that the user can see voting record for
	    	 */
	    	categories: [],

	    	/**
	    	 * List of all Issues that the user has voted on
	    	 */
	    	issues: [],

	    	/**
	    	 *
	    	 */
	    	currentSelectedIssues: [],
	    };
	},

	updateAllIssues : function(issueToRating) {
		console.log(issueToRating);
	},

	componentDidMount : function() {
		User.getRatedIssues(Cache.getCacheV(Constants.AUTH.UID), this.updateAllIssues);


		category_names = [];
		for (var i = 0; i < Constants.CATEGORIES.length; i++) {
		  category_names.push(<MenuItem value={i} key={i} primaryText={Constants.CATEGORIES[i]}/>);
		}

		issue_items = [];
		for (var i = 0; i < 3; i++) {
			issue_items.push(<PoliticalIssueComponent key={i} className="issue-card"/>);
		}

		this.setState({
			categories: category_names,
			issues: issue_items,
			currentSelectedIssues: issue_items,
		});
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
	 * Callback that fires when the user has chosen a different issues category to examine
	 */
	changeIssue : function(event, index, value) {
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
				<div className="issue-category-selector">
					<DropDownMenu className="display-inline" value={this.state.currentIssue} onChange={this.changeIssue}>
						{this.state.categories}
					</DropDownMenu>
					<p className="display-inline">{this.state.currentSelectedIssues.length} {this.state.currentSelectedIssues.length == 1 ? "Issue" : "Issues"} Voted on!</p>
				</div>
				<div className="rate-scale">
					{this.state.currentSelectedIssues}
				</div>
			</div>
		);
	}
});

module.exports = PoliticalProfileComponent;