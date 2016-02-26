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
	    	categoryList: [],
	    	candidateList: null,
	    	selectedCategoryId: 0,
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

	createAllCategories : function(categories) {
		category_items = [];
		for (var category_index in categories) {
			var cat = categories[category_index];
			var name = cat.categoryName;
			category_items.push(
				<MenuItem
					value={parseInt(category_index)}
					key={category_index}
					primaryText={name}
				/>
			);
		}

		this.setState({
			selectedCategoryId: 0,
			categoryList: category_items,
		});
	},

	/**
	 * Overrides React's componentDidMount
	 */
	componentDidMount : function() {
		var userId = Cache.getCacheV(Constants.AUTH.UID);
		var self = this;

		Category.getAllCategories(function(categories) {
			self.createAllCategories(categories);
			// retrieve candidates for the user
			// TODO: when categories are sorted, pass in the category id
			// of the first category that appears in the menu.
			User.getRankings(userId, "0", function(rankings) {
				console.info("Candidate rankings:");
				console.info(rankings);
				self.setState({
					candidateList: rankings
				});
			});
		});
	},

	/**
	 * Callback that is fired whenever the user selects a new item in the menu
	 */
	handleMenuUpdate : function(event, index, newCategoryId) {
		this.setState({
			selectedCategoryId: newCategoryId,
		});

		var userId = Cache.getCacheV(Constants.AUTH.UID);
		var self = this;

		// retrieve new candidate rankings for the user
		User.getRankings(userId, newCategoryId, function(rankings) {
			console.info("Candidate rankings (new):");
			console.info(rankings);
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
					leftIcon={<ContentLabel />} />
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
			<Card className="submit-content">
				<DropDownMenu
				  value={this.state.selectedCategoryId}
				  onChange={this.handleMenuUpdate}>
					{this.state.categoryList}
				</DropDownMenu>
				<List>
					{this.getCandidates()}
				</List>
			</Card>
		);
	}
});

module.exports = CandidateRankingComponent;