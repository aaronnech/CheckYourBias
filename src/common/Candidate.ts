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
		});
	}

	/*
		Fetches all the candidates
		Returns a relative filepath (from /src/client/static) to the avatar of the candidate.
		If no avatar is present for that candidate, returns filepath to the default avatar.
	*/
	public static getCandidateAvatarSrc(candidateId: string): any {
		var cid = +candidateId;
		if (isNaN(cid) || cid < 0 || cid >= Constants.CANDIDATE_AVATARS.length) {
			// assume no avatar for that candidate.
			return Constants.GENERAL_AVATAR;
		}
		return Constants.CANDIDATE_AVATARS[candidateId];
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

	/*
		Fetches all the candidates, in lexicographically sorted order.
	*/
	public static getAllCandidatesSorted(callback: (candidates) => any): void {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_CANDIDATE);
		rootRef.orderByKey().once("value", function(snapshot) {
			var candidates = snapshot.val();
			candidates.sort(function(a, b) {
				return a.name.localeCompare(b.name);
			});
			callback(candidates);
		});
	}
}

export = Candidate;