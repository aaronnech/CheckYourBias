var React = require('react');
var User = require('../../common/User');
var Category = require('../../common/Category');
var Cache = require('../Cache');
var Constants = require('../Constants');

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
	/**
	 * Callback that fires when user selects this component
	 * @param page
	 */
	onSelectPage : function(page) {
		this.setState({
			currentScreen: page
		})
	},

	componentDidMount : function() {
		var userId = Cache.getCacheV(Constants.AUTH.UID);

		Category.getAllCategories(function(categories) {
			console.log(categories);
		});

		User.getRankings(userId, "1", function(rankings) {
			console.log(rankings);
		});
	},

	/**
	 * Renders the view
	 */
	render : function() {
		return (
			<Card className="submit-content">
				<CardTitle title="Economy" />

				<List subtitle="Economy">
					<ListItem primaryText="Bernie Sanders" leftIcon={<ContentLabel />} />
					<ListItem primaryText="Ted Cruz" leftIcon={<ContentLabel />} />
					<ListItem primaryText="Donald Trump" leftIcon={<ContentLabel />} />
					<ListItem primaryText="Benjamin Carson" leftIcon={<ContentLabel />} />
				</List>
			</Card>
		);
	}
});

module.exports = CandidateRankingComponent;