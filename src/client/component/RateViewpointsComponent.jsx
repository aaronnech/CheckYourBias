var React = require('react');
var Constants = require('../Constants');
var Cache = require('../Cache');
var User = require('../../common/User');
var Issue = require('../../common/Issue');
var Category = require('../../common/Category');

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
			 *	The user's stance on the issue
			 */
			userStance: null,

			/**
			 * An object populated with keys representing 
			 * standardized error constants, and values representing
			 * whether those errors are displayed or not
			 */
			errorsShown: {},
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

			// retrieve the next quote
			self.getQuote();
		});
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
	 * Renders the view
	 */
	render : function() {
		return (
			<Card className="rate-viewpoints">
				<CardTitle title="Rate a New Issue!" />
				<CardText className="issue-wrapper">
					<p>{this.state.issue !== null ? this.state.issue.mainText : Constants.ERRORS.NO_ISSUE}</p>
				</CardText>
				<CardActions>
					<div className="rate-scale"
						style={{display: (this.state.issue === null ? 'none' : 'block'), textAlign: 'center'}}>
						<StanceSelector
							value={this.state.userStance}
							handleUpdateStance={this.handleUpdateStance} />
					</div>
					<div className="confirm-choice-wrapper">
						<RaisedButton label="Next Issue"
							onClick={this.confirmReaction}
							style={{marginTop: '1em'}}
							disabled={this.state.issue === null} />
					</div>
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