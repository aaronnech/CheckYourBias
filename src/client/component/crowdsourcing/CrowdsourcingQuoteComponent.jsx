var React = require('react');
var Cache = require('../../Cache');
var Constants = require('../../Constants');

var SelectField = require('material-ui/lib/select-field');
var MenuItem = require('material-ui/lib/menus/menu-item');
var TextField = require('material-ui/lib/text-field');
var Candidate = require('../../../common/Candidate');

const QUOTE_MAX = 400;

/**
 * Form fragment for a direct quote content submission.
 *
 * @author sonjakhan
 */
var CrowdsourcingQuoteComponent = React.createClass({

    /**
     * candidate: The candidate who said the quote
     * candidateErrorText: The error text to show when there is invalid candidate
     * quote: The content the user is submitting
     * quoteErrorText: The error text to show when the quote is invalid
     */
    getInitialState : function() {
        return {
            candidate: null,
            quote: null,
            quoteErrorText: Constants.ERRORS.REQUIRED,
            candidateErrorText: Constants.ERRORS.REQUIRED,
            candidates: JSON.parse(Cache.getCacheV(Constants.CACHE.CANDIDATES)),
        };
    },

    /**
     * Sets the candidate to what the user selected
     */
    handleUpdateCandidate : function(event, index, value) {
        var candidateMap = {};
        candidateMap[this.state.candidates[value - 1]] = Constants.STANCES.length - 1;
        this.props.handleCandidateMap(candidateMap);

        this.setState({
            candidate: value,
            candidateErrorText: null
        });
    },

    /**
     * Sets the quote to what the user inputted and updates the
     * error text if necessary
     */
    handleUpdateQuote : function(event) {
        var quote = event.target.value;
        var errorText = null;

        if (quote.length == 0) {
            errorText = Constants.ERRORS.REQUIRED;
        } else if (quote.length > QUOTE_MAX) {
            errorText = "Quote must be " + QUOTE_MAX + " characters or less";
        }
        this.setState({
            quote: quote,
            quoteErrorText: errorText,
        });

        this.props.handleContent(quote);
    },

    /**
     * Resets the component to its initial state.
     */
    resetToInitialState : function() {
        this.replaceState(this.getInitialState());
    },

    render : function() {
        return (
            <div>
                <p>Which candidate said it?</p>
                <SelectField
                    value={this.state.candidate}
                    hintText={"Select Candidate"}
                    onChange={this.handleUpdateCandidate}
                    errorText={this.state.candidateErrorText}
                >
                    {this.state.candidates.map((function(c, i) {
                        return (
                            <MenuItem key={i} value={i + 1} primaryText={c} />
                        );
                    }).bind(this))}
                </SelectField>
                <p>Quote:</p>
                <TextField
                    hintText="I will make America great again"
                    errorText={this.state.quoteErrorText}
                    multiLine={true}
                    onChange={this.handleUpdateQuote}
                />
            </div>
        );
    }
});

module.exports = CrowdsourcingQuoteComponent;