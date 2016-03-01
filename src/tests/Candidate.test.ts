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
		Gets all candidates and makes sure the first candidate has the right name
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
		Candidate.getAllCandidatesSorted(function(candList) {
			for (var i = 0, len = candList.length; i < len - 1; i++) {
                test.ok(candList[i].candidate.name < candList[i + 1].candidate.name,
					"Items " + i + " and " + (i + 1) + " are not in sorted order!");
			}
			test.done();
		});
	}

	/*
		Tests retrieval of correct avatar image for a valid candidate with an image
	*/
	public static testGetCandidateAvatarSrcForValidCandidate(test) {
		var src = Candidate.getCandidateAvatarSrc("0");
		test.equal(src, Constants.CANDIDATE_AVATARS[0],
			"Did not fetch correct avatar for candidate 0");

		var src2 = Candidate.getCandidateAvatarSrc("2");
		test.equal(src2, Constants.CANDIDATE_AVATARS[2],
			"Did not fetch correct avatar for candidate 2");

		test.done();
	}

	/*
		Tests retrieval of the general avatar image for candidates without an image
	*/
	public static testGetCandidateAvatarSrcForCandidateWithoutImage(test) {
		var src2 = Candidate.getCandidateAvatarSrc("3214");
		test.equal(src2, Constants.GENERAL_AVATAR,
			"Did not fetch the general avatar for candidate without avatar");

		test.done();
	}

	/*
		Test retrieval of general avatar image for invalid candidates
	*/
	public static testGetCandidateAvatarSrcForInvalidCandidate(test) {
		var src = Candidate.getCandidateAvatarSrc("-1");
		test.equal(src, Constants.GENERAL_AVATAR,
			"Did not fetch the general avatar for nonexistent candidate");
		var srcBogus = Candidate.getCandidateAvatarSrc("hello my name is pedro");
		test.equal(srcBogus, Constants.GENERAL_AVATAR,
			"Did not fetch the general avatar for nonexistent candidate");

		test.done();
	}
}

export = CandidateTest;