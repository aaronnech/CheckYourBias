var React = require('react');
var Constants = require('../../Constants');
var Issue = require('../../../common/Issue');

var Card = require('material-ui/lib/card/card');
var CardText = require('material-ui/lib/card/card-text');
var CrowdsourcingCandidateStanceComponent = require('./CrowdsourcingCandidateStanceComponent.jsx');
var RaisedButton = require('material-ui/lib/raised-button');
var Snackbar = require('material-ui/lib/snackbar');

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
            hasContentToShow: false,
            issueId: null,
            showSnackbar: false,
            snackbarMessage: "",
        };
    },

    componentWillMount : function() {
        this.generateContent();
    },

    generateContent : function() {
        var self = this;
        Issue.getUnapprovedIssue(function(issues) {
            if (issues === null) {
                self.setState({
                    hasContentToShow: false,
                });
            } else {
                self.setState({
                    hasContentToShow: true,
                    issueId: issues.key(),
                    contentType: issues.val().contentType,
                    contentMap: {
                        'Content': issues.val().mainText,
                        'Category': Constants.CATEGORIES[issues.val().category],
                        'Candidate Ratings': issues.val().candidateRatings,
                        'Sources': issues.val().sources,
                    },
                });
            }
        });
    },

    getContent : function() {
        result = []
        for (var label in this.state.contentMap) {
            if (label == "Candidate Ratings") {
                for (candidate in this.state.contentMap[label]) {
                    result.push(
                        <CrowdsourcingCandidateStanceComponent
                            key={candidate}
                            candidate={Constants.CANDIDATES[candidate]}
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
        var self = this;
        Issue.approveIssue(this.state.issueId, function(error) {
            if (error === null) {  // success
                self.setState({
                    showSnackbar: true,
                    snackbarMessage: "Content has been accepted",
                });
                self.generateContent();
            } else {
                self.setState({
                    showSnackbar: true,
                    snackbarMessage: "There was an error. Please try again",
                });
            }
        });
    },

    handleReject : function() {
        var self = this;
        Issue.unapproveIssue(this.state.issueId, function(error) {
            if (error === null) {  // success
                self.setState({
                    showSnackbar: true,
                    snackbarMessage: "Content has been rejected",
                });
                self.generateContent();
            } else {
                self.setState({
                    showSnackbar: true,
                    snackbarMessage: "There was an error. Please try again",
                });
            }
        });
    },

    hideSnackbar : function() {
        this.setState({
            showSnackbar: false,
        });
    },

    render : function() {
        if (this.state.hasContentToShow) {
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
                        <Snackbar
                              open={this.state.showSnackbar}
                              message={this.state.snackbarMessage}
                              autoHideDuration={4000}
                              onRequestClose={this.hideSnackbar}
                            />
                    </CardText>
                </Card>
            );
        } else {
            return (
                <Card>
                    <CardText>
                        There is no content to approve at this time
                    </CardText>
                </Card>
            );
        }
    }
});

module.exports = CrowdsourcingApprovalComponent;