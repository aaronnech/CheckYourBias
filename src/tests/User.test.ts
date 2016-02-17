import User = require('../common/User');
import Constants = require('../client/Constants')

Constants.firebaseUrl = Constants.FIREBASE_URL_TEST;

class UserTest {
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
	
	public static testGetNextIssue(test) {
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
	public static testGetRankings(test) {
		User.getRankings("0", "0", function(rankings) {
			test.done();
		})
	}
}

export = UserTest;