import Candidate = require('../common/Candidate');

class CandidateTest {
	public static testCandidateValues(test) {
		Candidate.getCandidate("0", function(candidate: Candidate) {
			test.strictEqual(
				candidate.name,
				"Bernie Sanders",
				'Candidate with id 0 should have name \'Bernie Sanders\''
			);
			test.done();
		});
	}
}

export = CandidateTest;