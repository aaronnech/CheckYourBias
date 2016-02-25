import Issue = require('../common/Issue');
import Constants = require('../client/Constants');
import Firebase = require("firebase");

Constants.firebaseUrl = Constants.FIREBASE_URL_TEST;

class IssueTest {

	public static testInitializeUnapprovedTest(test) {
		Issue.initializeUnapprovedIssue(Constants.CONTENT_TYPES[0], "main text example",
			["www.coolkids.com", "wwww.kanyewest.com"], { "Bernie Sanders": 4, "Donald Trump": 3 }, "0",
			["Education", "Crime and Safety"], function(error) {
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
	
	public static testConvertCategoryNamesToIds(test) {
		Issue.convertCategoryNamesToIds(["Education", "Immigration"], function(list) {
			test.notEqual(
				list.indexOf(4),
				-1,
				'Category 4 (Immigration) should be included in the list'
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
	
	public static testIsIssueDirectQuoteTrueCase(test) {
		Issue.getIssue("0", function(issue) {
			test.strictEqual(
				Issue.isIssueDirectQuote(issue),
				true,
				'Issue 0 should be a direct quote'
			);
			test.done();
		});
	}
	
	public static testIsIssueDirectQuoteFalseCase(test) {
		Issue.getIssue("2", function(issue) {
			test.strictEqual(
				Issue.isIssueDirectQuote(issue),
				false,
				'Issue 2 should not be a direct quote'
			);
			test.done();
		});
	}
	
	public static testGetIssueAuthorID(test) {
		Issue.getIssue("1", function(issue) {
			test.strictEqual(
				Issue.getIssueAuthorID(issue),
				"2",
				"Issue 1 should have Donald Trump as author"
			);
			test.done();
		});
	}
	
}

export = IssueTest;