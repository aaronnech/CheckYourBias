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
			 * A boolean representing whether additional issue information
			 * is displayed
			 */
			additionalIssueInfoShown: false
	    };

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
			console.info("HERE ARE YOUR CANDIDATES");
			console.info(result);
			self.setState({
				candidateList: result
			});
		});

		this.getQuote();
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
			this.setState({
				errorsShown: {
					STANCE_REQUIRED: true
				}
			});
			return;
		}

		var userId = Cache.getCacheV(Constants.AUTH.UID);
		var self = this;

		console.log(userId, this.state.issue.id, this.state.userStance);
		User.submitRating(userId, this.state.issue.id, this.state.userStance, function() {
			// TODO: Display a visual confirmation
			console.log("User rated issue.");

			self.resetStance();

			self.showIssueInfo();
		});
	},

	/**
	 * Callback that fires when user has voted on an issue
	 */
	showIssueInfo : function() {
		this.setState({
			additionalIssueInfoShown: true
		});
	},

	retrieveNextIssue : function() {
		this.setState({
			additionalIssueInfoShown: false
		});

		this.getQuote();
	},

	/**
	 * Retrieves a random quote from a category, and displays it to the user
	 */
	getQuote : function() {
		// TODO: replace text shown with new data from backend source
		var userId = Cache.getCacheV(Constants.AUTH.UID);
		var self = this;

		User.getNextIssue(userId, "0", function(result) {
			console.log(result);
			self.setState({
				issue: result,
			});
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
		var candidateList = [];
		var ratings = this.state.issue.candidateRatings;
		for (var key in ratings) {
			if (ratings.hasOwnProperty(key)) {
				var candidate = this.state.candidateList[key];
				candidateList.push(<li>
					{candidate.name}, {candidate.affiliatedParty} (Rating: {ratings[key]})
				</li>)
			}
		}
		candidateList.push(<li>Sources: {this.state.issue.sources}</li>)
		return <ul>{candidateList}</ul>
	},

	/**
	 * Renders the view
	 */
	render : function() {
		var cardText = null;
		var cardActions = null;
		if (this.state.issue === null) {
			cardText = <p>{Constants.ERRORS.NO_ISSUE}</p>;
		} else {
			if (this.state.additionalIssueInfoShown) {
				// show additional issue information
				cardText = <div>{this.getAdditionalIssueInfo()}</div>;

				cardActions =
					<div className="confirm-choice-wrapper">
						<RaisedButton label="Next Issue"
							onClick={this.retrieveNextIssue}
							style={{marginTop: '1em'}} />
					</div>;
			} else {
				cardText = <p>{this.state.issue.mainText}</p>;
				cardActions =
					<div>
						<div className="rate-scale"
							style={{textAlign: 'center'}}>
							<StanceSelector
								value={this.state.userStance}
								handleUpdateStance={this.handleUpdateStance} />
						</div>
						<div className="confirm-choice-wrapper">
							<RaisedButton label="Vote!"
								onClick={this.confirmReaction}
								style={{marginTop: '1em'}} />
						</div>
					</div>
			}
		}

		return (
			<Card className="rate-viewpoints">
				<CardTitle title="Rate a New Issue!" />
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