var React = require('react');
var Constants = require('../../Constants');

var Card = require('material-ui/lib/card/card');
var CardText = require('material-ui/lib/card/card-text');
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
        };
    },

    getContent : function() {
        result = []
        for (var label in this.state.contentMap) {
            result.push(
                <div>
                    <p className="candidateLabel">{label}</p>
                    <p>{this.state.contentMap[label]}</p>
                </div>
            );
        }
        return result;
    },

    render : function() {
        return (
            <Card className="approvalContent">
                <CardText>
                    {this.getContent()}
                    <RaisedButton label="Reject" backgroundColor="#ff8080" />
                    <RaisedButton label="Accept" backgroundColor="#97ce5e" />
                </CardText>
            </Card>
        );
    }
});

module.exports = CrowdsourcingApprovalComponent;