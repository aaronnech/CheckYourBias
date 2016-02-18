import User = require('../common/User');
import Constants = require('../client/Constants');
import Firebase = require("firebase");

Constants.firebaseUrl = Constants.FIREBASE_URL_TEST;

class UserTest {

	public static testSubmitIssue(test) {
		User.submitRating("0", "2", "3", function(errorObject) {
			User.getUser("0", function(user) {
				test.strictEqual(
					user.ratedIssues["2"],
					"3",
					"Should have a new rating for issue 2 of 3"
				);
				var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_USER + "/0/ratedIssues/2");
				rootRef.remove(function(error) {
					test.done();
				});
			});
		});
	}

	public static testInitializeUser(test) {
		User.initializeUser("testid", "testfirst", "testlast", function(error) {
			test.notEqual(
				error,
				true,
				"Error: " + error + ". There shouldn't be an error when initializing a user" 
			);
			test.done();
		});
	}
	public static testUserValues(test) {
		User.getUser("0", function(user: User) {
			test.strictEqual(
				user.lastName,
				"Maegerle",
				'Last name should be Maegerle'
			);
			test.done();
		});
	}
	
	public static testGetRatedIssues(test) {
		User.getRatedIssues("0", function(issues) {
			test.strictEqual(
				issues["0"],
				4,
				'Rating of first issue should be 4'
			);
			test.done();
		});
	}
	
	public static testGetNextIssue1(test) {
		User.getNextIssue("0", "0", function(issue) {
			test.notEqual(
				issue,
				null,
				'Returned issue should not be null'
			);
			test.done();
		});
	}
	
	public static testGetNextIssue2(test) {
		User.getNextIssue("0", "0", function(issue) {
			test.strictEqual(
				issue.id,
				"2",
				'Returned issue should be issue 2'
			);
			test.strictEqual(
				issue.candidateRatings[0],
				4,
				'Issue 2 has rating of 4 from candidate 0'
			);
			test.done();
		});
	}

	public static testGetNextIssueWhenNoIssues(test) {
		User.getNextIssue("1", "0", function(issue) {
			test.strictEqual(
				issue,
				null,
				"Should return null when no issues can be given");
			test.done();
		});
	}

	public static testGetNextIssueNewUser(test) {
		User.getNextIssue("testid", "0", function(issue) {
			test.notEqual(
				issue,
				null,
				'Returned issue should not be null'
			);
			test.done();
		});
	}

	public static testGetRankings(test) {
		User.getRankings("0", "0", function(rankings) {
			test.done();
		});
	}

	public static testGetRankingsNewUser(test) {
		User.getRankings("testid", "0", function(rankings) {
			test.done();
		})
	}
}

export = UserTest;