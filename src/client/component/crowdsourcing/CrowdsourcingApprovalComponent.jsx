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
            contentType: null,
            issueId: null,
        };
    },

    componentWillMount : function() {
        this.generateContent();
    },

    generateContent : function() {
        var self = this;
        Issue.getUnapprovedIssues(function(issues) {
            self.setState({
                issueId: issues.key(),
                contentType: issues.val().contentType,
                contentMap: {
                    'Content': issues.val().mainText,
                    'Category': issues.val().category,
                    'Candidate Ratings': issues.val().candidateRatings,
                    'Sources': issues.val().sources,
                },
            });
        });
    },

    getContent : function() {
        result = []
        for (var label in this.state.contentMap) {
            if (label == "Candidate Ratings") {
                console.log(this.state.contentMap[label]);
                for (candidate in this.state.contentMap[label]) {
                    result.push(
                        <CrowdsourcingCandidateStanceComponent
                            key={candidate}
                            candidate={candidate}
                            value={this.state.contentMap[label][candidate]}
                            handleUpdateStance={function(){}}
                            isStatic={true}
                        />
                    );
                }
            } else {
                result.push(
                    <div key={label}>
                        <p className="candidateLabel">{label}</p>
                        <p>{this.state.contentMap[label]}</p>
                    </div>
                );
            }
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