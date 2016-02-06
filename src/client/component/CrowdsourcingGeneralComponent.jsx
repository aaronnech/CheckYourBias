var React = require('react');
var Constants = require('../Constants');

var CrowdsourcingCandidateStanceComponent = require('./CrowdsourcingCandidateStanceComponent.jsx');
var AutoComplete = require('material-ui/lib/auto-complete');
var TextField = require('material-ui/lib/text-field');
var SelectField = require('material-ui/lib/select-field');
var MenuItem = require('material-ui/lib/menus/menu-item');
var Slider = require('material-ui/lib/slider');
var RaisedButton = require('material-ui/lib/raised-button');

const CONTENT_MAX = 400;

var CrowdsourcingGeneralComponent = React.createClass({

    getInitialState : function() {
        return {
            content: null,
            contentErrorText: Constants.ERRORS.REQUIRED,
            candidate: 0,
            candidateErrorText: Constants.ERRORS.REQUIRED,
            candidates: Constants.CANDIDATES.slice(),
            candidateMap: {},
        };
    },

    handleUpdateCandidate : function(event, index, value) {
        this.state.candidateMap[this.state.candidates[value - 1]] = 0.5;
        this.state.candidates.splice((value - 1), 1);
        this.setState({
            candidates: this.state.candidates,
            candidateMap: this.state.candidateMap,
        })
    },

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

    handleUpdateSlider : function(candidate, value) {
        this.state.candidateMap[candidate] = value;
        this.setState({
            candidateMap: this.state.candidateMap,
        });
    },

    getCandidateStances : function() {
        var result = [];
        for (candidate in this.state.candidateMap) {
            result.push(
                <CrowdsourcingCandidateStanceComponent 
                    candidate={candidate} 
                    value={this.state.candidateMap[candidate]}
                    handleUpdateSlider={this.handleUpdateSlider}
                />
            );
        }
        return result;
    },

    getSelectCandidate : function () {
        return ((this.state.candidates.length > 0) ? (
            <SelectField value={this.state.candidate} onChange={this.handleUpdateCandidate}>
                <MenuItem 
                    className="menu-item-disabled" 
                    key={0} 
                    value={0} 
                    primaryText="Select Candidate" 
                    disabled={true}
                />
                {this.state.candidates.map((function(c, i) {
                    return (
                        <MenuItem key={i + 1} value={i + 1} primaryText={c} />
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