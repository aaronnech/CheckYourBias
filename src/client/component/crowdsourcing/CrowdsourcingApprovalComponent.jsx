var React = require('react');
var Constants = require('../../Constants');

var Card = require('material-ui/lib/card/card');
var CardText = require('material-ui/lib/card/card-text');
var CrowdsourcingCandidateStanceComponent = require('./CrowdsourcingCandidateStanceComponent.jsx');
var Approve = require('material-ui/lib/svg-icons/action/done');
var Reject = require('material-ui/lib/svg-icons/content/clear');
var RaisedButton = require('material-ui/lib/raised-button');

const approveStyle = {
    fill: '#00ff00',
    marginRight: 20
};

const rejectStyle = {
    fill: '#ff0000',
    marginRight: 20
};

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

    handleUpdateApproval : function() {

    },

    getContent : function() {
        result = []
        for (var label in this.state.contentMap) {
            result.push(
                <div>
                    <p className="candidateLabel">{label}</p>
                    <p>{this.state.contentMap[label]}</p>
                    <div className="approve">
                        <Approve style={approveStyle} />
                    </div>
                    <div className="reject">
                        <Reject style={rejectStyle} />
                    </div>
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
                </CardText>
            </Card>
        );
    }
});

module.exports = CrowdsourcingApprovalComponent;