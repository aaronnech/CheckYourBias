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
		console.info("Here are your categories");
		console.info(categories);

		category_items = [];
		for (var category_index in categories) {
			var cat = categories[category_index];
			var name = cat.categoryName;
			category_items.push(<MenuItem value={parseInt(category_index)} key={category_index} primaryText={name}/>);
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
		// retrieve categories
		Category.getAllCategories(this.createAllCategories);

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
	},

	/**
	 * Callback that is fired whenever the user selects a new item in the menu
	 */
	handleMenuUpdate : function(event, index, value) {
		console.log(value);
		this.setState({
			selectedCategoryId: value,
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
	 * Renders the view
	 */
	render : function() {
		return (
			<Card className="submit-content">
				<DropDownMenu value={this.state.selectedCategoryId} onChange={this.handleMenuUpdate}>
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