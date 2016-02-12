var React = require('react');
var Constants = require('../../Constants');

var CrowdsourcingCandidateStanceComponent = require('./CrowdsourcingCandidateStanceComponent.jsx');
var RaisedButton = require('material-ui/lib/raised-button');

/**
 * View to approve components
 *
 * @author sonjakhan
 */
var CrowdsourcingApprovalComponent = React.createClass({

    /**
     * contentMap: A mapping from form category to content
     *   ex: { "Main Text": "Make America great again",
     *         "Candidate": "Donald Trump",
     *         "Source": "https://www.donaldjtrump.com/"  }
     */
    getInitialState : function() {
        return {
            contentMap: this.props.contentMap,
            approvalMap: {},
        };
    },

    getContent : function() {
        result = []
        for (var label in this.state.contentMap) {
            result.push(
                <div>
                    <p>{label}</p>
                    <p>{this.state.contentMap[label]}</p>
                </div>
            );
        }
        return result;
    },

    render : function() {
        return (
            <div>
                {this.getContent()}
            </div>
        );
    }
});

module.exports = CrowdsourcingApprovalComponent;