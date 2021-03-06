var React = require('react');
var Constants = require('../Constants');
var Cache = require('../Cache');
var User = require('../../common/User');
var Issue = require('../../common/Issue');
var Category = require('../../common/Category');
var Candidate = require('../../common/Candidate');


var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var CardMedia = require('material-ui/lib/card/card-media');
var CardText = require('material-ui/lib/card/card-text');
var CardActions = require('material-ui/lib/card/card-actions');
var List = require('material-ui/lib/lists/list');
var ListItem = require('material-ui/lib/lists/list-item');
var Divider = require('material-ui/lib/divider');
var Avatar = require('material-ui/lib/avatar');
var StanceSelector = require('./StanceSelector.jsx');
var RaisedButton = require('material-ui/lib/raised-button');
var Snackbar = require('material-ui/lib/snackbar');

/**
 * This component allows the user to indicate their level of
 * agreement or disagreement on a political issue
 *
 * @author g-liu
 */
var RateViewpointsComponent = React.createClass({
	/**
	 * Initial state of the component
	 */
	getInitialState : function() {
	    var initialState = {
	    	/**
	    	 * Issue object containing the issue
	    	 */
	    	issue: null,

	    	/**
	    	 * An array of candidates, where the index corresponds to
	    	 * the candidate ID, and the element corresponds to the
	    	 * candidate info
	    	 */
	    	candidateList: null,

			/**
			 * The user's stance on the issue
			 */
			userStance: null,

			/**
			 * An object populated with keys representing
			 * standardized error constants, and values representing
			 * whether those errors are displayed or not
			 */
			errorsShown: {},

			/**
			 * An integer, one of the following:
			 * 0: No issue is available
			 * 1: Issue is available, pending user vote
			 * 2: Issue is available, displaying additional issue information
			 */
			screenState: 0
	    };

	    // add error message mappings
	    for (var key in Constants.ERRORS) {
	    	if (Constants.ERRORS.hasOwnProperty(key)) {
	    		initialState.errorsShown[key] = false;
	    	}
	    }

	    return initialState;
	},

	/**
     * Updates the user's stance
     */
    handleUpdateStance : function(value) {
        this.setState({
            userStance: value,
        });
    },

    /**
     * Sets the user stance back to the default (no stance)
     */
    resetStance : function() {
    	this.setState({
    		userStance: null
    	});
    },

	/**
	 * Overrides React's componentWillMount
	 */
	componentWillMount : function() {
		var self = this;
		// retrieve all candidates for future lookup
		Candidate.getAllCandidates(function(result) {
			self.setState({
				candidateList: result
			});
		});

		this.getIssue(function(success) {
			self.setState({
				screenState: success | 0 // 1 or 0 depending on (boolean) value of success
			});
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
	 * Callback that fires when the user has confirmed their level of agreement
	 */
	confirmReaction : function() {
		if (this.state.userStance === null) {
			// display an error to the user if the user has not selected yet a stance
			this.setState({
				errorsShown: {
					STANCE_REQUIRED: true
				}
			});
			return;
		}

		var userId = Cache.getCacheV(Constants.AUTH.UID);
		var self = this;

		User.submitRating(userId, this.state.issue.id, this.state.userStance, function() {
			// show additional information about the issue
			self.showIssueInfo();
			// clear the stance selector
			self.resetStance();
		});
	},

	/**
	 * Retrieve a new issue without voting on the current issue.
	 */
	skipIssue : function() {
		var userId = Cache.getCacheV(Constants.AUTH.UID);
		var self = this;

		// mark this issue as skipped
		User.skipIssue(userId, this.state.issue.id, function(err) {
			// retrieve a new issue.
			self.getIssue(function(success) {
				self.setState({
					screenState: success | 0
				});
				self.resetStance();
			});
		});
	},

	/**
	 * Callback that fires after user has voted on an issue
	 */
	showIssueInfo : function() {
		this.setState({
			screenState: 2
		});
	},

	/**
	 * Callback that fires after a user has looked at the additional
	 * issue info, and presses "Next Issue"
	 */
	hideIssueInfo : function() {
		var self = this;
		this.getIssue(function(success) {
			self.setState({
				screenState: success | 0
			});
		});
	},

	/**
	 * Retrieves a random issue from a category, and displays it to the user
	 * @param cb a callback accepting a single parameter. This parameter is set to
	 *  true if an issue was retrieved, false otherwise
	 */
	getIssue : function(cb) {
		var userId = Cache.getCacheV(Constants.AUTH.UID);
		var self = this;

		User.getNextIssue(userId, null, function(result) {
			self.setState({
				issue: result
			});

			if (typeof cb === 'function') {
				cb(result !== null);
			}
		});
	},

	/**
	 * Callback that fires when the "stance required" snackbar
	 * should be hidden from the user
	 */
	handleStanceRequiredErrorClose : function() {
		this.setState({
			errorsShown: {
				STANCE_REQUIRED: false
			}
		});
	},

	/**
	 * Returns as a DOM element information regarding the current issue
	 */
	getAdditionalIssueInfo : function() {
		if (this.state.issue === null) {
			return;
		}

		var candidateList = [];
		var ratings = this.state.issue.candidateRatings;
		for (var key in ratings) {
			if (ratings.hasOwnProperty(key)) {
				var candidate = this.state.candidateList[key];

				candidateList.push(
					<ListItem
						key={key}
						leftAvatar={
							<Avatar
								src={Candidate.getCandidateAvatarSrc(key)}
								backgroundColor={Constants.STANCE_COLORS[ratings[key]]} />
						}
						primaryText={candidate.name + ', ' + candidate.affiliatedParty}
						secondaryText={Constants.STANCES[ratings[key]]} />
				);
			}
		}
		candidateList.push(<Divider key="divider" />);
		for (var source_index in this.state.issue.sources) {
			var source = this.state.issue.sources[source_index];
			candidateList.push(
				<ListItem
					style={{wordWrap: 'break-word', color: 'blue'}}
					href={source}
					key={source}
					primaryText={source}
					target="_blank"
				/>
			);
		}
		var resultList = React.createElement(List, {}, candidateList);
		return resultList;
	},

	/**
	 * Renders the view
	 */
	render : function() {
		var cardTitle = "Rate a new issue!";
		var cardText = null;
		var cardActions = null;

		if (this.state.issue === null || this.state.screenState === 0) {
			// no issue to be shown
			cardText = <p>{Constants.ERRORS.NO_ISSUE}</p>;
		}
		else if (this.state.screenState === 1) {
			// issue to be voted on
			cardText = <p>{this.state.issue.mainText}</p>;
			var actionButtonStyle = {
				margin: 6,
				marginTop: '1em'
			};

			cardActions =
				<div>
					<div className="rate-scale"
						style={{textAlign: 'center'}}>
						<StanceSelector
							value={this.state.userStance}
							handleUpdateStance={this.handleUpdateStance} />
					</div>
					<div className="confirm-choice-wrapper">
						<RaisedButton label="Skip"
							id="skip"
							secondary={true}
							onClick={this.skipIssue}
							style={actionButtonStyle} />
						<RaisedButton label="Vote"
							id="vote"
							primary={true}
							onClick={this.confirmReaction}
							style={actionButtonStyle} />
					</div>
				</div>
		}
		else if (this.state.screenState === 2) {
			// show additional issue information
			cardTitle = "What they think";
			cardText = this.getAdditionalIssueInfo();

			cardActions =
				<div className="confirm-choice-wrapper">
					<RaisedButton label="Next Issue"
						id="nextissue"
						primary={true}
						onClick={this.hideIssueInfo}
						style={{marginTop: '1em'}} />
				</div>;
		}

		return (
			<Card className="rate-viewpoints">
				<CardTitle title={cardTitle} />
				<CardText className="issue-wrapper">
					{cardText}
				</CardText>
				<CardActions>
					{cardActions}
				</CardActions>

				<Snackbar
					open={this.state.errorsShown.STANCE_REQUIRED}
					message={Constants.ERRORS.STANCE_REQUIRED}
					autoHideDuration={3000}
					onRequestClose={this.handleStanceRequiredErrorClose} />
			</Card>
		);
	}
});

module.exports = RateViewpointsComponent;