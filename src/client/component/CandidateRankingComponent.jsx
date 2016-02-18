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
	getInitialState : function() {
	    return {
	    	candidateList: null
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

		User.getRankings(userId, "1", function(rankings) {
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
	 * Renders the view
	 */
	render : function() {
		return (
			<Card className="submit-content">
				<CardTitle title="Economy" />

				<List>
					{this.getCandidates()}
				</List>
			</Card>
		);
	}
});

module.exports = CandidateRankingComponent;