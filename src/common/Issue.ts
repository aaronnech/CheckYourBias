/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('../client/Constants');
import Candidate = require('./Candidate');
import User = require('./User');

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
		});
	}
	
	/*
		Returns all issues that have been approved.
	*/
	public static getApprovedIssues(callback) {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
		rootRef.orderByChild("approved").equalTo(1).once("value", function(snapshot) {
			callback(snapshot.val());
		});
	}

	/*
		Returns an issue that has not yet been approved. In the callback,
		unapprovedIssue should be accessed by .val(), and the key is .key()
	*/
	public static getUnapprovedIssue(userId: string, callback) {
		var found = false;
		User.getUser(userId, function(user) {
			var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
			rootRef.orderByChild("approved").equalTo(0).once("value", function(snapshot) {
				if (snapshot.val() === null) {
					callback(null);
				} else {
					snapshot.forEach(function(unapprovedIssue) {
						if ((user.skippedApproveIssueIds == null || 
						user.skippedApproveIssueIds.indexOf(unapprovedIssue.key()) == -1) &&
						(user.submittedIssueIds == null ||
						user.submittedIssueIds.indexOf(unapprovedIssue.key()) == -1)) {
							callback(unapprovedIssue);
							found = true;
						}
					});
					if (!found) {
						callback(null);
					}
				}
			});
		})
	}
	
	/*
		Takes a user id and an unapproved issue id and adds the fact that 
		the issue was skipped for approval by the given user to the database
	*/
	public static skipUnapprovedIssue(userId: string, issueId: string, callback: (errorObject) => any): void {
		User.getUser(userId, function(user) {
			var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_USER);
			var temp = [];
			if (user.skippedApproveIssueIds == null) {
				temp[0] = issueId;
			} else {
				temp = user.skippedApproveIssueIds;
				temp.push(issueId);
			}
			rootRef.child(userId).child("skippedApproveIssueIds").set(temp, function(errorObject) {
				callback(errorObject);
			});

		});
	}

	/*
		Approves the issue with the given id.
	*/
	public static approveIssue(issueId: string, callback) {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
		rootRef.child(issueId).update({"approved" : 1}, function(error) {	
			callback(error);
		});
	}
	
	/*
		Unapproves the issue with the given id.
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
		Returns the id of the author of the issue if the issue is a
		direct quote or -1 if an author cannot be found.
	*/
	public static getIssueAuthorID(issue: Issue): string {
		for (var key in issue.candidateRatings) {
			if (issue.candidateRatings[key] == "4") {
				return key;
			}
		}
		return "-1";
	}

	/*
		Returns the Avatar image for this issue.
		Candidate image if the issue is a Direct Quote.
		General Politics image if the issue is General Content.
	*/
	public static getIssueAvatarImage(issue: Issue): string {
		if (this.isIssueDirectQuote(issue)) {
			var authorId = this.getIssueAuthorID(issue);
			return Candidate.getCandidateAvatarSrc(authorId);
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