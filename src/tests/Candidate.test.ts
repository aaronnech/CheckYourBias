import Candidate = require('../common/Candidate');
import Constants = require('../client/Constants')

Constants.firebaseUrl = Constants.FIREBASE_URL_TEST;

class CandidateTest {
	/*
		Gets a candidate and makes sure it has the right name
	*/
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
	
	/*
		Gets all candidates and makes sure the first has the right name
	*/	
	public static testGetAllCandidates(test) {
		Candidate.getAllCandidates(function(candList) {
			test.strictEqual(
				candList[0].name,
				"Bernie Sanders",
				'Candidate with id 0 should have name \'Bernie Sanders\''
			);
			test.done();
		});
	}

	/*
		Gets all candidates and tests that they are sorted in lexicographic order by name
	*/
	public static testGetAllCandidatesSorted(test) {
		Candidate.getAllCandidates(function(candList) {
			for (var i = 0, len = candList.length; i < len - 1; i++) {
				test.ok(candList[i].name < candList[i + 1].name,
					"Items " + i + " and " + (i + 1) + " are not in sorted order!");
			}
			test.done();
		});
	}
}

export = CandidateTest;