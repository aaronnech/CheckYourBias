var React = require('react');
var User = require('../../common/User');
var Category = require('../../common/Category');
var Cache = require('../Cache');
var Constants = require('../Constants');

var DropDownMenu = require('material-ui/lib/DropDownMenu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var CardText = require('material-ui/lib/card/card-text');
var List = require('material-ui/lib/lists/list');
var ListItem = require('material-ui/lib/lists/list-item');
var ContentLabel = require('material-ui/lib/svg-icons/social/person');

/**
 * This component displays to the user the candidates whom they
 * most align with, given a specific topic.
 *
 * @author g-liu
 */
var CandidateRankingComponent = React.createClass({
	getInitialState : function() {
	    return {
	    	categoryList: null,
	    	candidateList: null,
	    	selectedCategoryId: -1
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
	 * Overrides React's componentWillMount
	 */
	componentWillMount : function() {
		var userId = Cache.getCacheV(Constants.AUTH.UID);
		var self = this;

		// retrieve candidates for the user
		User.getRankings(userId, "1", function(rankings) {
			console.info("Here are your candidates rankings");
			console.info(rankings);
			self.setState({
				candidateList: rankings
			});
		});

		// retrieve categories
		Category.getAllCategories(function(categories) {
			console.info("Here are your categories");
			console.info(categories);
			self.setState({
				categoryList: categories,
				selectedCategoryId: categories !== null ? 0 : this.getInitialState().selectedCategoryId
			});
		});
	},

	/**
	 * Callback that is fired whenever the user selects a new item in the menu
	 */
	handleMenuUpdate : function(evt) {
		// TODO: handle menu update
		console.log("TODO: Handling menu update...");
	},

	/**
	 * Returns a list of candidates to be displayed to the user.
	 */
	getCandidates : function() {
		var candidates = this.state.candidateList;

		if (candidates === null) {
			return (<p>Fetching candidates...</p>);
		}

		if (candidates.length === 0) {
			return (<p>No candidates to display.</p>);
		}

		var listChildren = [];
		for (var i = 0, len = candidates.length; i < len; i++) {
			listChildren.push(<ListItem
				key={i}
				primaryText={candidates[i].candidate.name}
				leftIcon={<ContentLabel />} />
			);
		}

		var resultList = React.createElement(List, {}, listChildren);
		return resultList;
	},

	/** 
	 * Returns a menu of categories to be displayed to the user.
	 */
	getCategories : function() {
		var categories = this.state.categoryList;

		if (categories === null) {
			return (<DropDownMenu value={-1} disabled={true}>
				<MenuItem value={-1} primaryText="(no categories)" />
			</DropDownMenu>);
		}

		var categoryItems = [];
		for (var i = 0, len = categories.length; i < len; i++) {
			categoryItems.push(
				<MenuItem value={i} key={i} primaryText={categories[i].categoryName} />
			);
		}

		var menu = React.createElement(DropDownMenu,
			{value: this.state.selectedCategoryId,
			 onChange: this.handleMenuUpdate},
			categoryItems
		);
		return menu;
	},

	/**
	 * Renders the view
	 */
	render : function() {
		return (
			<Card className="submit-content">
				{this.getCategories()}

				<List>
					{this.getCandidates()}
				</List>
			</Card>
		);
	}
});

module.exports = CandidateRankingComponent;