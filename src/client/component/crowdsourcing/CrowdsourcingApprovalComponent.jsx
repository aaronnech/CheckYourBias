var React = require('react');
var Cache = require('../../Cache');
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
            candidates: JSON.parse(Cache.getCacheV(Constants.CACHE.CANDIDATES)),
            categories: JSON.parse(Cache.getCacheV(Constants.CACHE.CATEGORIES)),
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

    componentWillReceiveProps : function(nextProps) {
        // give it some time so it appears in the database
        setTimeout(this.generateContent, 1000);
    },

    generateContent : function() {
        var self = this;
        Issue.getUnapprovedIssue(Cache.getCacheV(Constants.AUTH.UID), function(issues) {
            if (issues === null) {
                self.setState({
                    hasContentToShow: false,
                });
                setTimeout(this.generateContent, 1000);
            } else {
                var categories = []
                for (var category in issues.val().category) {
                    categories.push(self.state.categories[category])
                }
                self.setState({
                    hasContentToShow: true,
                    issueId: issues.key(),
                    contentType: issues.val().contentType,
                    contentMap: {
                        'Content': issues.val().mainText,
                        'Categories': categories,
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
                var candidates = []
                for (candidate in this.state.contentMap[label]) {
                    candidates.push(
                        <CrowdsourcingCandidateStanceComponent
                            key={candidate}
                            candidate={this.state.candidates[candidate]}
                            value={this.state.contentMap[label][candidate]}
                            handleUpdateStance={function(){}}
                            isStatic={true}
                        />
                    );
                }
                result.push(
                    <div key={label}>
                        <div className="contentLabel">{label}</div>
                        {candidates}
                    </div>
                );
            } else if (label == "Categories" || label == "Sources") {
                var items = []
                for (item in this.state.contentMap[label]) {
                    itemContent = this.state.contentMap[label][item];
                    items.push(
                        <div key={itemContent}>
                            {itemContent}
                        </div>
                    );
                }
                result.push(
                    <div key={label}>
                        <div className="contentLabel">{label}</div>
                        {items}
                    </div>
                );
            } else {
                result.push(
                    <div key={label}>
                        <div className="contentLabel">{label}</div>
                        <div>{this.state.contentMap[label]}</div>
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