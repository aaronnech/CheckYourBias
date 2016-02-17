var React = require('react');
var Constants = require('../../Constants');

var CrowdsourcingCandidateStanceComponent = require('./CrowdsourcingCandidateStanceComponent.jsx');
var AutoComplete = require('material-ui/lib/auto-complete');
var TextField = require('material-ui/lib/text-field');
var SelectField = require('material-ui/lib/select-field');
var MenuItem = require('material-ui/lib/menus/menu-item');
var RaisedButton = require('material-ui/lib/raised-button');

const CONTENT_MAX = 400;

/**
 * Form fragment for general content submission.
 *
 * @author sonjakhan
 */
var CrowdsourcingGeneralComponent = React.createClass({

    /**
     * content: The main content the user is submitting
     * contentErrorText: The error text to show when there is invalid content
     * candidates: A list of remaining candidates that haven't been added yet
     * candidateMap: A map from candidate to stance that the user has inputted
     */
    getInitialState : function() {
        return {
            content: null,
            contentErrorText: Constants.ERRORS.REQUIRED,
            candidates: Constants.CANDIDATES.slice(),
            candidateMap: {},
        };
    },

    /**
     * Adds a candidate to map with a neutral stance
     */
    handleUpdateCandidate : function(event, index, value) {
        this.state.candidateMap[this.state.candidates[value - 1]] =
            Math.floor(Constants.STANCES.length / 2);
        this.state.candidates.splice((value - 1), 1);
        this.setState({
            candidates: this.state.candidates,
            candidateMap: this.state.candidateMap,
        })
    },

    /**
     * Sets the content to what the user typed and updates the
     * error text if necessary
     */
    handleUpdateContent : function(event) {
        var content = event.target.value;
        var errorText = null;

        if (content.length == 0) {
            errorText = Constants.ERRORS.REQUIRED;
        } else if (content.length > CONTENT_MAX) {
            errorText = "Content must be " + CONTENT_MAX + " characters or less";
        }
        this.setState({
            content: content,
            contentErrorText: errorText,
        });
    },

    /**
     * Updates the candidate's stance to the value set by the user
     */
    handleUpdateStance : function(candidate, value) {
        this.state.candidateMap[candidate] = value;
        this.setState({
            candidateMap: this.state.candidateMap,
        });
    },

    /**
     * Returns an array of CrowsourcingCandidateStanceComponents with data
     * that the user has already submitted
     */
    getCandidateStances : function() {
        var result = [];
        for (candidate in this.state.candidateMap) {
            result.push(
                <CrowdsourcingCandidateStanceComponent
                    key={candidate}
                    candidate={candidate}
                    value={this.state.candidateMap[candidate]}
                    handleUpdateStance={this.handleUpdateStance}
                />
            );
        }
        return result;
    },

    /**
     * Returns the SelectField containing all candidates that have not yet
     * been selected
     */
    getSelectCandidate : function () {
        return ((this.state.candidates.length > 0) ? (
            <SelectField
                value={this.state.candidate}
                hintText={"Add Candidate"}
                onChange={this.handleUpdateCandidate}>
                {this.state.candidates.map((function(c, i) {
                    return (
                        <MenuItem key={i} value={i + 1} primaryText={c} />
                    );
                }).bind(this))}
            </SelectField>
        ) : null);
    },

    render : function() {
        return (
            <div>
                <p>Content:</p>
                <TextField
                    hintText="Public universities should be free"
                    errorText={this.state.contentErrorText}
                    multiLine={true}
                    onChange={this.handleUpdateContent}
                />

                <p>Candidate Stances:</p>
                {this.getCandidateStances()}
                <div>
                    {this.getSelectCandidate()}
                </div>
            </div>
        );
    }
});

module.exports = CrowdsourcingGeneralComponent;