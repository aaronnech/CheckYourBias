/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('../client/Constants');

Constants.firebaseUrl = Constants.FIREBASE_URL;

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
	affiliatedParty: string;
	issueRatings: {[key: string]: string};
	website: string;
	active: string;

	/*
		Fetches the Candidate with the given candidateId.
	*/
	public static getCandidate(candidateId: string, callback: (candidate: Candidate) => any): void {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_CANDIDATE);
		rootRef.child(candidateId).once("value", function(snapshot) {
			var candidate = snapshot.val();
			candidate.id = candidateId;
			callback(candidate);
		}, function(errorObject) {
			// The id given was not valid or something went wrong.
			console.log("The read failed" + errorObject.code);
		});
	}

	/*
		Fetches all the candidates
	*/
	public static getAllCandidates(callback: (candidates) => any): void {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_CANDIDATE);
		rootRef.orderByKey().once("value", function(snapshot) {
			var candidates = snapshot.val();
			callback(candidates);
		});
	}
}

export = Candidate;