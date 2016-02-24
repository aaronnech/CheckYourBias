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
	    	 * Currently selected category by the user (defaults to ALL)
	    	 */
	    	currentCategory: 0,

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

	belongsToCategory : function(issue) {
		if (parseInt(this.state.currentCategory) == -1) {
			return true;
		}
		return (issue.category.indexOf(parseInt(this.state.currentCategory)) > -1);
	},

	userHasRated : function(issue_id) {
		return issue_id in this.state.issueRatings;
	},

	filterIssues : function() {
		var cur_issues = []
		for (var issue_id in this.state.issues) {
			var issue_obj = this.state.issues[issue_id];
			var issue_avatar = Issue.getIssueAvatarImage(issue_obj);
			var issue_author = Issue.getIssueAuthor(issue_obj);

			if (this.belongsToCategory(issue_obj) && this.userHasRated(issue_id)) {
				cur_issues.push(<PoliticalIssueComponent key={issue_id} 
						issue_id={issue_id}
						issue={issue_obj}
						issue_avatar_image={issue_avatar}
						issue_author={issue_author}
						rating={this.state.issueRatings[issue_id]} />);
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

		this.filterIssues();
	},


	updateUserRatings : function(issueToRating) {
		this.setState({
			issueRatings: issueToRating,
		});

		Issue.getApprovedIssues(this.updateAllIssues);
	},

	createAllCategories : function(categories) {

		category_names = [];
		category_names.push(<MenuItem value={-1} key={-1} primaryText={"All"}/>);
		for (var category_index in categories) {
			var cat = categories[category_index];
			var name = cat.categoryName;
			category_names.push(<MenuItem value={category_index} key={category_index} primaryText={name}/>);
		}

		this.setState({
			currentCategory: -1,
			categories: category_names,
		});

		User.getRatedIssues(Cache.getCacheV(Constants.AUTH.UID), this.updateUserRatings);
	},

	componentDidMount : function() {
		Category.getAllCategories(this.createAllCategories);
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
	changeCategory : function(event, index, value) {
		this.setState({
			currentCategory: value,
		}, this.filterIssues);
	},

	/**
	 * Renders the view
	 */
	render : function() {
		return (
			<div className="political-profile">
				<div className="issue-category-selector">
					<DropDownMenu className="display-inline" value={this.state.currentCategory} onChange={this.changeCategory}>
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