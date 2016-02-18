var React = require('react');
var Constants = require('../Constants');
var Cache = require('../Cache');

var DropDownMenu = require('material-ui/lib/drop-down-menu');
var MenuItem = require('material-ui/lib/menus/menu-item');

var PoliticalIssueComponent = require('./PoliticalIssueComponent.jsx');

var User = require('../../common/User');
var Issue = require('../../common/Issue');
var Category = require('../../common/Category');

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

	updateAllCategories : function(categories) {

		category_names = [];
		category_names.push(<MenuItem value={-1} key={-1} primaryText={"All"}/>);
		for (var category_index in categories) {
			var cat = categories[category_index];
			console.log(cat);
			var name = cat.categoryName;
			category_names.push(<MenuItem value={category_index} key={category_index} primaryText={name}/>);
		}

		this.setState({
			currentIssue: -1,
			categories: category_names,
		});

		User.getRatedIssues(Cache.getCacheV(Constants.AUTH.UID), this.updateUserRatings);
	},

	componentDidMount : function() {
		Category.getAllCategories(this.updateAllCategories);
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
		console.log(value);
		this.setState({
			currentIssue: value,
		});

		//this.filterIssuesByCategory();
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