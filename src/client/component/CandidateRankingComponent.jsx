var React = require('react');
var User = require('../../common/User');
var Category = require('../../common/Category');
var Candidate = require('../../common/Candidate');
var Cache = require('../Cache');
var Constants = require('../Constants');

var DropDownMenu = require('material-ui/lib/DropDownMenu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var CardText = require('material-ui/lib/card/card-text');
var List = require('material-ui/lib/lists/list');
var ListItem = require('material-ui/lib/lists/list-item');
var Avatar = require('material-ui/lib/avatar');

/**
 * This component displays to the user the candidates whom they
 * most align with, given a specific category.
 *
 * @author g-liu
 */
var CandidateRankingComponent = React.createClass({
	getInitialState : function() {
	    return {
	    	/**
	    	 * List of category metadata, to be filled from database
	    	 */
	    	categories: [],

	    	/**
	    	 * List of candidates filled from database
	    	 */
	    	candidateList: null,

	    	/**
	    	 * The index of the selected category, as appears when fetching categories sorted.
	    	 * Not to be confused with ID of selected category
	    	 */
	    	selectedCategoryIndex: 0,
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
	 * Returns the menu of categories to be rendered
	 */
	getCategoriesMenu : function() {
		menuItems = [];
		for (var categoryIndex in this.state.categories) {
			var cat = this.state.categories[categoryIndex];
			var name = cat.category.categoryName;
			menuItems.push(
				<MenuItem
					value={parseInt(categoryIndex)}
					key={categoryIndex}
					primaryText={name}
				/>
			);
		}

		var resultMenu = React.createElement(
			DropDownMenu,
			{
				value: this.state.selectedCategoryIndex,
				onChange: this.handleMenuUpdate	
			},
			menuItems
		);

		return resultMenu;
	},

	/**
	 * Overrides React's componentWillMount
	 */
	componentWillMount : function() {
		var userId = Cache.getCacheV(Constants.AUTH.UID);
		var self = this;

		Category.getAllCategoriesSorted(function(categories) {
			self.setState({
				categories: categories
			});

			// retrieve candidates for the user
			// TODO: when categories are sorted, pass in the category id
			// of the first category that appears in the menu.
			var firstCategoryId = categories[0].id;
			User.getRankings(userId, firstCategoryId, function(rankings) {
				self.setState({
					candidateList: rankings
				});
			});
		});
	},

	/**
	 * Callback that is fired whenever the user selects a new item in the menu
	 * @param event JavaScript event
	 * @param index old index
	 * @param newCategoryIndex index in the category state array of the new category
	 *  that was selected
	 */
	handleMenuUpdate : function(event, index, newCategoryIndex) {
		this.setState({
			selectedCategoryIndex: newCategoryIndex,
		});

		var userId = Cache.getCacheV(Constants.AUTH.UID);
		var self = this;

		// retrieve new candidate rankings for the user
		var newCategoryId = this.state.categories[newCategoryIndex].id;
		User.getRankings(userId, newCategoryId, function(rankings) {
			self.setState({
				candidateList: rankings
			});
		});
	},

	/**
	 * Returns a list of candidates to be displayed to the user.
	 */
	getCandidates : function() {
		var candidates = this.state.candidateList;

		if (candidates === null || candidates.length === 0) {
			return (<ListItem primaryText={Constants.ERRORS.NO_RANKED_CANDIDATES} />);
		}

		var listChildren = [];
		for (var key in candidates) {
			if (candidates.hasOwnProperty(key)) {
				listChildren.push(<ListItem
					key={key}
					primaryText={candidates[key].candidate.name}
					secondaryText={candidates[key].rating + "% similar views as you"}
					leftAvatar={<Avatar src={Candidate.getCandidateAvatarSrc(candidates[key].candidate.id)} />} />
				);
			}
		}

		var resultList = React.createElement(List, {}, listChildren);
		return resultList;
	},

	/**
	 * Renders the view
	 */
	render : function() {
		return (
			<Card className="candidate-rankings">
				{this.getCategoriesMenu()}
				{this.getCandidates()}
			</Card>
		);
	}
});

module.exports = CandidateRankingComponent;