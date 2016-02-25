var React = require('react');
var Cache = require('../../Cache');
var Constants = require('../../Constants');

var User = require('../../../common/User');
var CrowdsourcingSubmitContentComponent = require('./CrowdsourcingSubmitContentComponent.jsx');
var CrowdsourcingApprovalComponent = require('./CrowdsourcingApprovalComponent.jsx');
var Tabs = require('material-ui/lib/tabs/tabs');
var Tab = require('material-ui/lib/tabs/tab');

/** 
 * Wrapper around the two main crowdsourcing features, submission and approval
 * of content. Toggling between tabs preserves state.
 * 
 * @author sonjakhan
 */
var CrowdsourcingComponent = React.createClass({

	getInitialState : function() {
		return {
			isAdmin: null,
			refresh: false,
		}
	},

	componentWillMount : function() {
		var self = this;
		User.getUser(Cache.getCacheV(Constants.AUTH.UID), function(user) {
			self.setState({
				isAdmin: user.admin,
			});
		});
	},

	handleSubmit : function() {
		this.setState({
			refresh: !this.state.refresh,
		});
	},

	render : function() {
		if (this.state.isAdmin === null) {
			return <div>LOADING</div>;
		} else if (this.state.isAdmin) {
			return (
				<Tabs>
					<Tab label="Submit Content" >
						<div>
							<CrowdsourcingSubmitContentComponent refresh={this.handleSubmit} />
						</div>
					</Tab>
					<Tab label="Approve Content" >
						<CrowdsourcingApprovalComponent refresh={this.state.refresh} />
					</Tab>
				</Tabs>
			);
		} else {
			return (
				<CrowdsourcingSubmitContentComponent />
			)
		}
	},
});

module.exports = CrowdsourcingComponent;
