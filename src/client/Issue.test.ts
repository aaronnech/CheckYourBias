import Issue = require('./Issue');

class IssueTest {
	public static testIssueValues(test) {
		Issue.getIssue("0", function(issue: Issue) {
			test.strictEqual(
				issue.submitter,
				0,
				'Should have been submitted by user with id == 0'
			);
		});
		test.done();
	}
}

export = IssueTest;