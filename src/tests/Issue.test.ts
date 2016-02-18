import Issue = require('../common/Issue');
import Constants = require('../client/Constants');
import Firebase = require("firebase");

Constants.firebaseUrl = Constants.FIREBASE_URL_TEST;

class IssueTest {

	public static testInitializeUnapprovedTest(test) {
		Issue.initializeUnapprovedIssue(Constants.CONTENT_TYPES[0], "main text example",
			["www.coolkids.com", "wwww.kanyewest.com"], { "Bernie Sanders": 4, "Donald Trump": 3 }, "0",
			["0", "1"], function(error) {
				test.notEqual(
					error,
					true,
					"Error: " + error + ". There shouldn't be an error when initializing an issue"
				);
				var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
				rootRef.orderByChild("mainText").equalTo("main text example").once("value", function(snapshot) {
					snapshot.forEach(function(childSnapshot) {
						var key = childSnapshot.key();
						var childRootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE + key);
						childRootRef.remove();
					});
				});
				test.done();
		});
	}
	
	public static testConvertCandidateNamesToIds(test) {
		Issue.convertCandidateNamesToIds({ "Bernie Sanders": 4, "Donald Trump": 3 }, function(map) {
			test.strictEqual(
				map[0],
				4,
				'Rating for candidate 0 should be 4'
			);
			test.done();
		});
	}

	public static testIssueValues(test) {
		Issue.getIssue("0", function(issue: Issue) {
			test.strictEqual(
				issue.submitter,
				"0",
				'Should have been submitted by user with id == 0'
			);
			test.done();
		});
	}
	
	public static getApprovedIssues(test) {
		Issue.getApprovedIssues(function(issues) {
			test.strictEqual(
				issues.length,
				3,
				'There should be 3 approved issues'
			);
			test.done();
		});
	}
	
	public static testApprove(test) {
		Issue.approveIssue("3", function(error) {
			test.notEqual(
				error,
				true,
				"Error: " + error + ". There shouldn't be an error when approving an issue"
			);
			test.done();
		});
	}
	
	public static testUnapprove(test) {
		Issue.unapproveIssue("3", function(error) {
			test.notEqual(
				error,
				true,
				"Error: " + error + ". There shouldn't be an error when unapproving an issue"
			);
			test.done();
		});
	}
	
}

export = IssueTest;