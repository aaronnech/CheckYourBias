/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('../client/Constants');

Constants.firebaseUrl = Constants.FIREBASE_URL;

/*
	A class that represents a user and all the information that corresponds to it.
	Main text represents the bulk of the issue and what will be displayed to the user.
	Sources represents the websites or other that were used as sources for this issue.
	The candidates dictionary will comprise of the candidate ids with their ratings on this
	issue. Categories represents the categories this issues belong to. The submitter
	represents the user who submitted this issue in the first place.

	invariant: id is a string comprised of only numbers that must represent the id of
	a user in Firebase
	invariant: category contains all the categories and this issue's id appears in
	that isse array

*/
class Issue {
	id: string;
	mainText: string;
	sources: string[];
	candidateRatings: {[key: string]: string};
	category: string[];
	submitter: string;
	seenByCount: number;
	skipCount: number;
	flagCount: number;
	approved: boolean;


	constructor(id: string, mainText: string, sources: string[],
		candidateRatings: { [key: string]: string },
		category: string[], submitter: string, seenByCount: number,
		skipCount: number, flagCount: number, approved: boolean) {
		this.mainText = mainText;
		this.sources = sources;
		this.candidateRatings = candidateRatings;
		this.category = category;
		this.submitter = submitter;
		this.seenByCount = seenByCount;
		this.skipCount = skipCount;
		this.flagCount = flagCount;
		this.approved = approved;
	}

	/*
		Fetches the Issue with the given issueId.
	*/
	public static getIssue(issueId: string, callback: (issue: Issue) => any): void {
		console.log(Constants.firebaseUrl + Constants.FIRE_ISSUE);
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
		rootRef.child(issueId).once("value", function(snapshot) {
			var issue = snapshot.val();
			issue.id = issueId;
			callback(issue);
		}, function(errorObject) {
			// The id given was not valid or something went wrong.
			console.log("The read failed" + errorObject.code);
		});
	}
}

export = Issue;