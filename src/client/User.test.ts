import User = require('./User');

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
		test.done();
	}
}

export = UserTest;