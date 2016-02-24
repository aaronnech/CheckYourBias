/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('../client/Constants');
import Candidate = require('./Candidate');

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
	approved: number;
	contentType: string;

	constructor(id: string, mainText: string, sources: string[],
			candidateRatings: { [key: string]: string },
			category: string[], submitter: string, seenByCount: number,
			skipCount: number, flagCount: number, approved: number,
			contentType: string) {
		this.mainText = mainText;
		this.sources = sources;
		this.candidateRatings = candidateRatings;
		this.category = category;
		this.submitter = submitter;
		this.seenByCount = seenByCount;
		this.skipCount = skipCount;
		this.flagCount = flagCount;
		this.approved = approved;
		this.contentType = contentType;
	}

	/*
		Creates an unapproved issue with the given parameters. Sets approved to false and
		skip count, flag count and seen by count all to 0.

		contentType: One of Constants.CONTENT_TYPES
		mainText: main text that will be displayed for this issue
		sources: The websites that are the sources for this issue
		candidateRatings: A map from the id of the candidate to their rating for this issue
		submitter: The id of the user who submitted this
		category: The categories that this issue falls under
	*/
	public static initializeUnapprovedIssue(contentType: string, mainText: string, sources: string[],
								candidateMap: { [key: string]: number }, submitter: string,
								categories: string[], callback: (error) => any) {
		var issues: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
		this.convertCandidateNamesToIds(candidateMap, function(candidateRatings) {
			Issue.convertCategoryNamesToIds(categories, function(category) {
				issues.push({
					contentType: contentType,
					mainText: mainText,
					sources: sources,
					candidateRatings: candidateRatings,
					submitter: submitter,
					category: category,
					seenByCount: 0,
					skipCount: 0,
					flagCount: 0,
					approved: 0
				}, function(error) {
					callback(error);
				});
			});
		});
	}
	
	/*
		Takes a map of candidate names to ratings and returns an equivalent
		map of candidate ids to ratings via the callback.
		
		candidateMap: map from candidate names to ratings
	*/
	public static convertCandidateNamesToIds(candidateMap: { [key: string]: number }, callback): void {
		var candidates: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_CANDIDATE);
		var candidateRatings: { [key: number]: number } = [];
		candidates.once("value", function(snapshot) {
			var candList = snapshot.val();
			for(var i = 0; i < candList.length; i++) {
				if(candList[i].name in candidateMap)
				{
					candidateRatings[i] = candidateMap[candList[i].name];
				}
			}
			callback(candidateRatings);
		});
	}
	
	/*
		Takes a list of category names and returns an equivalent
		list of category ids via the callback.
		
		categoryList: list of category names
	*/
	public static convertCategoryNamesToIds(categoryList, callback): void {
		var categories: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_CATEGORY);
		var categoryIdList = [];
		categories.once("value", function(snapshot) {
			var catList = snapshot.val();
			for(var i = 0; i < catList.length; i++) {
				if(categoryList.indexOf(catList[i].categoryName) != -1)
				{
					categoryIdList.push(i);
				}
			}
			callback(categoryIdList);
		});
	}

	/*
		Fetches the Issue with the given issueId.
	*/
	public static getIssue(issueId: string, callback: (issue: Issue) => any): void {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
		rootRef.child(issueId).once("value", function(snapshot) {
			var issue = snapshot.val();
			issue.id = issueId;
			callback(issue);
		}, function(errorObject) {
			// The id given was not valid or something went wrong.
			console.log("getIssue failed: " + errorObject.code);
		});
	}
	
	/*
		Returns all issues that have been approved.
	*/
	public static getApprovedIssues(callback) {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
		rootRef.orderByChild("approved").equalTo(1).once("value", function(snapshot) {
			callback(snapshot.val());
		}, function(errorObject) {
			// The id given was not valid or something went wrong.
			console.log("getApprovedIssue failed: " + errorObject.code);
		});
	}

	/*
		Returns an issue that has not yet been approved. In the callback,
		unapprovedIssue should be accessed by .val(), and the key is .key()
	*/
	public static getUnapprovedIssue(callback) {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
		rootRef.orderByChild("approved").equalTo(0).once("value", function(snapshot) {
			if (snapshot.val() === null) {
				callback(null);
			} else {
				snapshot.forEach(function(unapprovedIssue) {
					callback(unapprovedIssue);
					return true;
				});
			}
		}, function(errorObject) {
			// The id given was not valid or something went wrong.
			console.log("getApprovedIssue failed: " + errorObject.code);
		});
	}
	
	/*
		Approves the issue with the given id.
		
		Calls the callback function with the updated issue.
	*/
	public static approveIssue(issueId: string, callback) {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
		rootRef.child(issueId).update({"approved" : 1}, function(error) {	
			callback(error);
		});
	}
	
	/*
		Unapproves the issue with the given id.
		
		Calls the callback function with the updated issue.
	*/
	public static unapproveIssue(issueId: string, callback) {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
		rootRef.child(issueId).update({"approved" : -1}, function(error) {
			callback(error);
		});	
	}

	/*
		Returns true if issue is a direct quote. False otherwise.
	*/
	public static isIssueDirectQuote(issue: Issue): boolean {
		return issue.contentType.toLowerCase().indexOf('direct') > -1;
	}

	/*
		Returns true if issue is a direct quote. False otherwise.
	*/
	public static getIssueAuthorID(issue: Issue): string {
		for (var key in issue.candidateRatings) {
			return key;
		}
	}

	/*
		Returns the Avatar image for this issue.
		Candidate image if the issue is a Direct Quote.
		General Politics image if the issue is General Content.
	*/
	public static getIssueAvatarImage(issue: Issue): string {
		if (this.isIssueDirectQuote(issue)) {	
			return Constants.CANDIDATE_AVATARS[this.getIssueAuthorID(issue)];
		} 
		
		return Constants.GENERAL_AVATAR;
	}

	/*
		Returns the author of the issue if the given issue is a direct quote.
		Returns NULL otherwise.
	*/
	public static getIssueAuthor(issue: Issue): String {
		return Constants.CANDIDATES[this.getIssueAuthorID(issue)];
	}
}

export = Issue;