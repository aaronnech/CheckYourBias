import User = require('./User');

class UserTest {
	public static testUserValues(test) {
		User.getUser("0", function(user: User) {
			test.strictEqual(
				user.lastName,
				"Maegerle",
				'Last name should be Maegerle'
			);
		});
		test.done();
	}
	
	public static testGetRatedIssues(test) {
		User.getRatedIssues("0", function(issues) {
			test.strictEqual(
				issues["0"],
				4,
				'Rating of first issue should be 4'
				);
			});
		test.done();
	}
}

export = UserTest;