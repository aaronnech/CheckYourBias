var React = require('react');
var Constants = require('../Constants');
var Cache = require('../Cache');

var DropDownMenu = require('material-ui/lib/drop-down-menu');
var MenuItem = require('material-ui/lib/menus/menu-item');

var PoliticalIssueComponent = require('./PoliticalIssueComponent.jsx');

var User = require('../../common/User');
var Issue = require('../../common/Issue');

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

	    	currentIssueIndex: 0,
	    	/**
	    	 * Whether or not to display the candidate who said the quote
	    	 */
	    	currentIssue: '',

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

	    	issueRatings: {},
	    };
	},

	filterIssuesByCategory : function() {
		console.log(this.state.issues);
		console.log(this.state.issueRatings);

		// TODO: actually filter the issues here

		var cur_issues = []
		for (var issue_index in this.state.issues) {
			var issue = this.state.issues[issue_index];

			if (issue.category.constructor === Array && issue.category.indexOf(this.state.currentIssueIndex) > -1) {
				cur_issues.push(<PoliticalIssueComponent key={issue_index} issue={issue} />);
			}
		}

		this.setState({
			currentSelectedIssues: cur_issues,
		});
	},

	updateAllIssues : function(allIssues) {
		this.setState({
			issues: allIssues,
		});

		this.filterIssuesByCategory();
	},

	updateUserRatings : function(issueToRating) {
		this.setState({
			issueRatings: issueToRating,
		});

		Issue.getApprovedIssues(this.updateAllIssues);
	},

	componentDidMount : function() {
		category_names = [];
		for (var i = 0; i < Constants.CATEGORIES.length; i++) {
		  category_names.push(<MenuItem value={i} key={i} primaryText={Constants.CATEGORIES[i]}/>);
		}

		this.setState({
			currentIssueIndex: 0,
			currentIssue: Constants.CATEGORIES[this.state.currentIssueIndex],
			categories: category_names,
		});

		User.getRatedIssues(Cache.getCacheV(Constants.AUTH.UID), this.updateUserRatings);
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
			currentIssueIndex: index,
			currentIssue: value
		});

		this.filterIssuesByCategory();
	},

	/**
	 * Renders the view
	 */
	render : function() {
		return (
			<div className="political-profile">
				<div className="issue-category-selector">
					<DropDownMenu className="display-inline" value={this.state.currentIssueIndex} onChange={this.changeIssue}>
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