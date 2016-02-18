var React = require('react');
var Constants = require('../../Constants');
var Issue = require('../../../common/Issue');

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
            contentMap: null,
        };
    },

    componentWillMount : function() {
        this.generateContent();
    },

    generateContent : function() {
        var self = this;
        Issue.getUnapprovedIssues(function(issues) {
            console.log(issues.key());
            console.log(issues.val());
            self.setState({
                contentMap: issues[0],
            });
        });
    },

    getContent : function() {
        result = []
        for (var label in this.state.contentMap) {
            result.push(
                <div key={label}>
                    <p className="candidateLabel">{label}</p>
                    <p>{this.state.contentMap[label]}</p>
                </div>
            );
        }
        return result;
    },

    handleApprove : function() {
        Issue.approveIssue();
    },

    handleReject : function() {
        Issue.unapproveIssue();
    },

    render : function() {
        return (
            <Card className="approvalContent">
                <CardText>
                    {this.getContent()}
                    <div className="reject">
                        <RaisedButton 
                            label="Reject" 
                            backgroundColor="#ff8080"
                            onClick={this.handleReject} 
                        />
                    </div>
                    <div className="approve">
                        <RaisedButton 
                            label="Accept" 
                            backgroundColor="#97ce5e" 
                            onClick={this.handleApprove} 
                        />
                    </div>
                </CardText>
            </Card>
        );
    }
});

module.exports = CrowdsourcingApprovalComponent;