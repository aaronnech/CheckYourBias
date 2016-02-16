var React = require('react');
var Constants = require('../../Constants');

var CrowdsourcingSubmitContentComponent = require('./CrowdsourcingSubmitContentComponent.jsx');
var CrowdsourcingApprovalComponent = require('./CrowdsourcingApprovalComponent.jsx');
var Tabs = require('material-ui/lib/tabs/tabs');
var Tab = require('material-ui/lib/tabs/tab');

/* TODO: Mocked data to be replaced */
const contentMap = { 
	"Quote": "Make America great again",
    "Candidate": "Donald Trump",
    "Source": "https://www.donaldjtrump.com/",
};

/** 
 * Wrapper around the two main crowdsourcing features, submission and approval
 * of content. Toggling between tabs preserves state.
 * 
 * @author sonjakhan
 */
var CrowdsourcingComponent = React.createClass({
	render : function() {
		return (
			<Tabs>
				<Tab label="Submit Content" >
					<div>
						<CrowdsourcingSubmitContentComponent />
					</div>
				</Tab>
				<Tab label="Approve Content" >
					<CrowdsourcingApprovalComponent contentMap={contentMap} />
				</Tab>
			</Tabs>
		)
	},
});

module.exports = CrowdsourcingComponent;
