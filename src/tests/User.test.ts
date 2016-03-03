import User = require('../common/User');
import Constants = require('../client/Constants');
import Firebase = require("firebase");

Constants.firebaseUrl = Constants.FIREBASE_URL_TEST;

class UserTest {

	/*
		Submits an issue and tests if the rating is correct, then deletes the issue from the database
	*/
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

	/*
		Initializes a user and makes sure that firebase doesn't return an error
	*/
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

	/*
		Tests a user in the test database and makes sure the last name is correct
	*/
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
	
	/*
		Tests a user in the test database and makes sure the ratedIssues field
		is correct
	*/
	public static testGetRatedIssues(test) {
		User.getRatedIssues("0", function(issues) {
			test.strictEqual(
				issues["0"],
				3,
				'Rating of first issue should be 3'
			);
			test.done();
		});
	}
	
	/*
		Tests that getRatedIssues returns null for a user without any rated issues
	*/
	
	public static testGetRatedIssuesNewUser(test) {
		User.getRatedIssues("testid", function(issues) {
			test.strictEqual(
				issues,
				null,
				'getRatedIssues should return null if a user has no rated issues'
			);
			test.done();
		});
	}
	
	/*
		Tests the get next issue function and makes sure
		that the returned value is not null when there is
		an available issue to be returned.
	*/
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
	
	/*
		Tests the get next issue function and makes sure
		that the returned issue is one that hasn't been picked
		before and has the right candidate ratings
	*/
	public static testGetNextIssue2(test) {
		User.getNextIssue("0", "0", function(issue) {
			test.strictEqual(
				issue.id,
				"2",
				'Returned issue should be issue 2'
			);
			test.strictEqual(
				issue.candidateRatings[0],
				3,
				'Issue 2 has rating of 3 from candidate 0'
			);
			test.done();
		});
	}
	
	/*
		Tests the get next issue function when null is passed
		as the category id (meaning an issue from any category
		can be returned)
	*/
	public static testGetNextIssueAnyCategory(test) {
		User.getNextIssue("0", null, function(issue) {
			test.strictEqual(
				issue.id,
				"2",
				'Returned issue should be issue 2'
			);
			test.done();
		});
	}

	/*
		Tests the get next issue when there are no issues for a user and
		makes sure it returns null
	*/
	public static testGetNextIssueWhenNoIssues(test) {
		User.getNextIssue("1", "0", function(issue) {
			test.strictEqual(
				issue,
				null,
				"Should return null when no issues can be given");
			test.done();
		});
	}


	/*
		Tests whether get next issue for a new user returns null or not
	*/
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

	/*
		Tests whether getRankings returns correctly
	*/
	public static testGetRankings(test) {
		User.getRankings("0", "0", function(rankings) {
			test.strictEqual(
				rankings[0].rating,
				75,
				"Ranking for top candidate should be 75"
			);
			test.strictEqual(
				rankings[0]["candidate"]["id"],
				'0',
				"Id field should exist"
			);
			test.strictEqual(
				rankings[2].rating,
				50,
				"Ranking for bottom candidate should be 50"
			);
			test.done();
		});
	}
	
	/*
		Tests whether getRankings properly does not provide rankings
		for candidates that share no rated issues with the user in
		the category
	*/
	public static testGetRankingsSomeCandidates(test) {
		User.getRankings("0", "4", function(rankings) {
			test.strictEqual(
				rankings.length,
				2,
				"Only two candidates should have ratings"
				);
			test.done();
		});
	}

	/*
		Tests that get rankings for a new user returns
	*/
	public static testGetRankingsNewUser(test) {
		User.getRankings("testid", "0", function(rankings) {
			test.strictEqual(
				rankings,
				null,
				"Should return null when user has rated no issues"
			);
			test.done();
		});
	}

	/*
		Tests if skipIssue correctly adds an issue
	*/
	public static testSkipIssue(test) {
		User.skipIssue("0", "0", function(errorObject) {
			User.getUser("0", function(user) {
				test.strictEqual(
					user.skippedIssueIds[0],
					"0",
					"Should have a new skipped issue of id 0"
				);
				User.skipIssue("0", "1", function(errorObject) {
					User.getUser("0", function(user) {
						test.strictEqual(
							user.skippedIssueIds[1],
							"1",
							"Should have a new skipped issue of id 0"
						);
						var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_USER + "/0/skippedIssueIds");
						rootRef.remove(function(error) {
							test.done();
						});
					});
				});
			});
		});
	}

	/*
		Tests if getNextIssue grabs skipped items or not
	*/
	public static testGetNextIssueSkip(test) {
		User.getNextIssue("skipuser", "0", function(issue) {
			test.strictEqual(
				issue,
				null,
				"should return null if all issues have been skipped"
			);
			test.done();
		});
	}
}

export = UserTest;
