/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('./Constants');

/*
	A class that represents a candidate and all the information that corresponds to it.

	invariant: issueRatings comprises all issues that the candidate has an
	associated rating on.

	Each issueId (key in issueRatings) corresponds to an Issue with this candidate and
	the same rating.
*/
class Candidate {
	candidateId: string;
	name: string;
	affilidatedParty: string;
	issueRatings: {[key: string]: string};
	website: string;
	firebaseRef: Firebase;

	/*
		Fetches the Candidate with the given candidateId.
	*/
	public static getCandidate(candidateId: string, callback: (candidate: Candidate) => any): void {
		// TODO: Implement
	}
}

export = Candidate;