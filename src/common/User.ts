/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('../client/Constants');
import Candidate = require('./Candidate');
import Issue = require('./Issue');
import Category = require('./Category');

Constants.firebaseUrl = Constants.FIREBASE_URL;

/*
	A class that represents a user and all the information that corresponds to them.
	
	invariant: id is a string comprised of only numbers that must represent the id of
	a user in Firebase

*/
class User {
	id: string;
	firstName: string;
	lastName: string;
	admin: string;
	age: string;
	email: string;
	gender: string;
	hasSeenHelpText: string;
	submittedIssueIds: string[];
	ratedIssues: {[key: string]: string};
	categoryWeights: {[key: string]: string};
	skippedIssueIds: string[];

	public static initializeUser(id: string, firstName: string, lastName: string, callback: (error) => any): void {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_USER);
		rootRef.child(id).set({
			firstName: firstName,
			lastName: lastName,
			admin: false,
			hasSeenHelpText: false
		}, function(error) {
			callback(error);
		});
	}

	/*
		Takes an ID for a user and calls the callback function with a constructed
		user object as a parameter. If something goes wrong or the ID does not
		correspond to a user, nothing happens.

		invariant: id must represent one of the users already in the database
	*/
	public static getUser(id: string, callback: (user: User) => any): void {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_USER);
		rootRef.child(id).once("value", function(snapshot) {
			var user = snapshot.val();
			user.id = id;
			callback(user);
		});
	}

	/*
		Takes a user id and gets all the issues the user has rated along with the user's
		rating on it. Calls the callback function with the dictionary as a parameter.

		invariant: userId must correspond to a user in the database
	*/
	public static getRatedIssues(userId: string, 
					callback: (ratedIssues: {[key: string]: string}) => any): void {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_USER);
		rootRef.child(userId).once("value", function(snapshot) {
			var user : User = snapshot.val();
			if("ratedIssues" in user) {
				callback(user.ratedIssues);
			}
			else {
				callback(null);
			}
		});

	}

	/*
		Takes a user id and a category id and gets an list of objects that
		correspond to candidates and their rankings, in order of agreement. Each object
		in the array has the following fields:

		candidate: The Candidate object that this entry corresponds to.
		rating: The similarity ranking this user has with this candidate (higher ranking
				corresponds to higher agreement)
				
		The ranking algorithm is as follows:
			- For each candidate, determine the average of squares of difference of opinion
				between the user and the candidate over each issue for which both have a rating
			- Take the square root of this value, invert it and normalize it such that
				complete agreement: rating of 100
				rating off by 1 on each issue: rating of 75
				rating off by 2 on each issue: rating of 50
				rating off by 3 on each issue: rating of 25
				rating off by 4 on each issue: rating of 0
				
		If a user has rated no issues which a given candidate has a rating for in the category,
		no ranking for that candidate will be returned.


		invariant: userId must correspond to a user in the database
		invariant: categoryId must correspond to a category in the database
	*/
	public static getRankings(userId: string, categoryId: string,
		callback: (rankings) => any): void {
		var rootref: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_USER);
		var userObject = this;
		this.getUser(userId, function(user) {
			var candidates: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_CANDIDATE);
			candidates.orderByKey().once("value", function(snapshot) {
				
				var candidateRatings: { [key: string]: number } = {};
				var ratingsDenom: { [key: string]: number } = {};
				var candidates = snapshot.val();
				for (var candidateId in candidates) {
					candidateRatings[candidateId] = 0;
					ratingsDenom[candidateId] = 0;
				}

				userObject.getRatedIssues(userId, function(ratedIssues) {
					var issues: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
 
					issues.orderByKey().once("value", function(snapshot) {

						// Filter issues by categoryId
						var allIssues = snapshot.val();
						if (ratedIssues == null || Object.keys(ratedIssues).length == 0) {
							callback(null);
							return;
						}
						for (var issueId in ratedIssues) {
							if (allIssues[issueId].category.indexOf(+categoryId) != -1) {
								var rating: number = +ratedIssues[issueId];
								var candidateRatingsVal = snapshot.val()[issueId].candidateRatings;
								for (var candidateId in candidateRatingsVal) {
									var diff = +candidateRatingsVal[candidateId] - rating;
									candidateRatings[candidateId] += diff*diff;
									ratingsDenom[candidateId]++;
								}
							}
						}

						var resultObjects = [];
						for (var candidateId in candidateRatings) {
							if (candidates[candidateId].active && ratingsDenom[candidateId] > 0) {
								var resultObject = {};
								resultObject["candidate"] = candidates[candidateId];
								resultObject["rating"] = 100 - 
									Math.round(25*Math.sqrt(candidateRatings[candidateId]/ratingsDenom[candidateId]));
								resultObjects.push(resultObject);
							}
						}

						// Sort from most to least agreeing
						resultObjects.sort(function(a, b) {
							return b.rating - a.rating;
						});
						// return resultObjects
						callback(resultObjects);

					});
				});
			});
		});
	}

	/*
		Takes a user id, issue id and a rating and puts it into the database.

		invariant: userId must correspond to a user in the database
		invariant: issueId must correspond to an issue in the database
	*/
	public static submitRating(userId: string, issueId: string, rating: string, 
		callback: (errorObject) => any): void {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_USER);
		var temp = {}
		temp[issueId] = rating;
		rootRef.child(userId).child("ratedIssues").update(temp, function (errorObject) {
			callback(errorObject);
		});
	}

	/*
		Takes a user id and issue id and adds the fact that the issue was skipped by the 
		given user to the database
	*/
	public static skipIssue(userId: string, issueId: string, callback: (errorObject) => any): void {
		User.getUser(userId, function(user) {
			var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_USER);
			var temp = [];
			if (user.skippedIssueIds == null) {
				temp[0] = issueId;
			} else {
				temp = user.skippedIssueIds
				temp.push(issueId);
			}
			rootRef.child(userId).child("skippedIssueIds").set(temp, function(errorObject) {
				callback(errorObject);
			});

		});
	}

	/*
		Takes a userId and a categoryId and gets an issue in that category that the user
		has not yet seen. Calls the callback function with the Issue.
		
		Candidates receive equal representation.
		
		If null is passed as the categoryId, gets any issue that the user has not yet seen.

		invariant: userId must correspond to a user in the database
		invariant: categoryId must correspond to a category in the database or null
	*/
	public static getNextIssue(userId: string, categoryId: string,
					callback: (issue: Issue) => any): void {
		var candidates: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_CANDIDATE);
		this.getUser(userId, function(user) {
			candidates.orderByKey().once("value", function(snapshot) {
				var attemptedCandidates: string[] = [];
				var candidates = snapshot.val();
				var chosenCandidate: string = Math.floor((Math.random() * candidates.length)).toString();
				var foundIssue : boolean = false;
				var issues: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_ISSUE);
				issues.orderByKey().once("value", function(snapshot) {
					while (!foundIssue) {
						if (attemptedCandidates.length >= candidates.length) {
							callback(null);
							return;
						}
						while (attemptedCandidates.indexOf(chosenCandidate) != -1) {
							chosenCandidate = Math.floor((Math.random() * candidates.length)).toString();
						}
						attemptedCandidates.push(chosenCandidate);
						var attemptedIssues: string[] = [];
						if (user.skippedIssueIds != null) {
							attemptedIssues = user.skippedIssueIds;
						}
						var allIssues = snapshot.val();
						var allIssuesIdArray = Object.keys(allIssues);
						while (attemptedIssues.length < allIssuesIdArray.length && !foundIssue &&
									candidates[+chosenCandidate].active) {
							var chosenIssueIndex: string = Math.floor((Math.random() * allIssuesIdArray.length)).toString();
							while (attemptedIssues.indexOf(chosenIssueIndex) != -1) {
								chosenIssueIndex = Math.floor((Math.random() * allIssuesIdArray.length)).toString();
							}
							attemptedIssues.push(chosenIssueIndex);

							var chosenIssue = allIssuesIdArray[chosenIssueIndex];

							if (!("ratedIssues" in user) || user.ratedIssues[chosenIssue] == null) {							
								var nextIssue = allIssues[chosenIssue];
								if (nextIssue.approved > 0 && +nextIssue.candidateRatings[chosenCandidate] > 0 &&
											(categoryId === null || nextIssue.category.indexOf(+categoryId) != -1)) {
									foundIssue = true;
									nextIssue.id = chosenIssue;
									callback(nextIssue);
								}								
							}
						}
					}
				});
			});
		});
	}
}

export = User;