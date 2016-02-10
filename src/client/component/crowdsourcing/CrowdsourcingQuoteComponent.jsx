var React = require('react');
var Constants = require('../../Constants');

var AutoComplete = require('material-ui/lib/auto-complete');
var TextField = require('material-ui/lib/text-field');

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
            candidateErrorText: Constants.ERRORS.REQUIRED,
            quote: null,
            quoteErrorText: Constants.ERRORS.REQUIRED,
        };
    },


    /**
     * Sets the candidate to what the user inputted and updates the
     * error text if necessary
     */
    // TODO (sonjakhan): Change to dropdown
    handleUpdateCandidate : function(value) {
        var errorText = null;
        if (value.length == 0) {
            errorText = Constants.ERRORS.REQUIRED;
        }
        this.setState({
            candidate: value,
            candidateErrorText: errorText,
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
    },

    render : function() {
        return (
            <div>
                <p>Which candidate said it?</p>
                <AutoComplete
                    hintText="Candidate"
                    errorText={this.state.candidateErrorText}
                    dataSource={Constants.CANDIDATES}
                    filter={AutoComplete.caseInsensitiveFilter}
                    onUpdateInput={this.handleUpdateCandidate}
                />
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