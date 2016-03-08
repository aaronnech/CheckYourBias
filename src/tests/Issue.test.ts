import Issue = require('../common/Issue');
import Constants = require('../client/Constants');
import Firebase = require("firebase");
import User = require('../common/User');

Constants.firebaseUrl = Constants.FIREBASE_URL_TEST;

class IssueTest {

	/*
		Tests that an issue can be initialized without errors
		by adding an issue and immediately deleting it
	*/
	public static testInitializeUnapprovedTest(test) {
		Issue.initializeUnapprovedIssue(Constants.CONTENT_TYPES[0], "main text example",
			["www.coolkids.com", "wwww.kanyewest.com"], { "Bernie Sanders": 4, "Donald Trump": 3 }, "0",
			["Education", "Crime and Safety"], "", function(error) {
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
	
	/*
		Tests that candidate names are properly converted to ids
	*/
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
	
	/*
		Tests that category names are properly converted to ids
	*/
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

	/*
		Tests that getIssue returns the proper values
	*/
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
	
	/*
		Tests that getApprovedIssues returns the proper values
	*/
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
	
	/*
		Tests that an issue can be approved without error
	*/
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
	
	/*
		Tests that an issue can be unapproved without error
	*/
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
	
	/*
		Tests that a direct quote issue is properly recognized
	*/
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
	
	/*
		Tests that a general content issue is properly recognized
	*/
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
	
	/*
		Tests that getIssueAuthor returns the proper name
	*/
	public static testGetIssueAuthor(test) {
		Issue.getIssue("1", function(issue) {
			test.strictEqual(
				Issue.getIssueAuthor(issue),
				"Donald Trump",
				"Issue 1 should have Donald Trump as author"
			);
			test.done();
		});
	}
	
	/*
		Tests that getIssueAvatarImage returns the proper avatar
		for a direct quote issue
	*/
	public static testGetCandidateAvatar(test) {
		Issue.getIssue("1", function(issue) {
			test.strictEqual(
				Issue.getIssueAvatarImage(issue),
				"img/candidate_2.jpg",
				"Issue 1 should show Donald Trump's avatar"
			);
			test.done();
		});
	}
	
	/*
		Tests that getIssueAvatarImage returns the general avatar
		for a general content issue
	*/
	public static testGetGeneralAvatar(test) {
		Issue.getIssue("2", function(issue) {
			test.strictEqual(
				Issue.getIssueAvatarImage(issue),
				"img/general_avatar.svg",
				"Issue 2 should show the general avatar"
			);
			test.done();
		});
	}
	
	/*
		Tests that getUnapprovedIssue properly returns an issue
		that has not been approved when one exists
	*/
	public static testGetUnapprovedIssue(test) {
		Issue.getUnapprovedIssue("0", function(snapshot) {
			test.strictEqual(
				snapshot.val().mainText,
				"This issue has not yet been approved.",
				"Should return the specific not approved issue"
			);
			test.done();
		});
	}
	
	/*
		Tests that getUnapprovedIssue properly returns null
		when all issues are either approved or unapproved
	*/
	public static testGetUnapprovedIssueNullCase(test) {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
		rootRef.child("4").update({"approved" : 1}, function(error) {	
			Issue.getUnapprovedIssue("0", function(snapshot) {
				test.strictEqual(
					snapshot,
					null,
					"There should be no issues to approve"
				);
				rootRef.child("4").update({"approved" : 0}, function(error) {
					test.done();
				});
			});
		});
	}

	/*
		Tests that getUnapprovedIssue properly returns an issue
		that has not been approved when one exists
	*/
	public static testgetUnapprovedIssueSkipAll(test) {
		Issue.getUnapprovedIssue("skipuser", function(snapshot) {
			test.strictEqual(
				snapshot,
				null,
				"There should be no issues to approve"
			);
			test.done();
		});
	}

	/*
		Tests if skipUnapproveIssue correctly adds an issue
	*/
	public static testSkipUnapproveIssue(test) {
		Issue.skipUnapprovedIssue("0", "0", function(errorObject) {
			User.getUser("0", function(user) {
				test.strictEqual(
					user.skippedApproveIssueIds[0],
					"0",
					"Should have a new skipped issue of id 0"
				);
				Issue.skipUnapprovedIssue("0", "1", function(errorObject) {
					User.getUser("0", function(user) {
						test.strictEqual(
							user.skippedApproveIssueIds[1],
							"1",
							"Should have a new skipped issue of id 0"
						);
						var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_USER + "/0/skippedApproveIssueIds");
						rootRef.remove(function(error) {
							test.done();
						});
					});
				});
			});
		});
	}

	/*
		Tests if getUnapprovedIssue correctly skips an issue if
		they are the one who submitted it
	*/	
	public static testGetUnapprovedIssueSubmitter(test) {
		Issue.getUnapprovedIssue("submitter", function(snapshot) {
			test.strictEqual(
				snapshot,
				null,
				"There should be no issues to approve"
			);
			test.done();
		});
	}
}

export = IssueTest;