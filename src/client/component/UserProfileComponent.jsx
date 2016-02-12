var React = require('react');

var CrowdsourcingApprovalComponent = require('./crowdsourcing/CrowdsourcingApprovalComponent.jsx');

/**
 * Display's the user's profile
 *
 * @author sonjakhan
 */
var UserProfileComponent = React.createClass({
	
	getInitialState : function() {
		var profile = (
			<div className="user-profile-btn-group">
				<div className="user-profile-btn">
					Voting History
				</div>
				<div className="user-profile-btn" onClick={this.handleApproveContent}>
					Approve Content
				</div>
				<div className="user-profile-btn">
					Submitted Content
				</div>
			</div>
		)
		return {
			page: profile,
		}
	},

	handleApproveContent : function() {
		var contentMap = { 
			"Quote": "Make America great again",
            "Candidate": "Donald Trump",
            "Source": "https://www.donaldjtrump.com/",
        };
        this.setState({
        	page: <CrowdsourcingApprovalComponent contentMap={contentMap} />
        });
	},

	render : function() {
		return (
			<div className="political-profile">
				{this.state.page}
			</div>
		);
	}
});

module.exports = UserProfileComponent;