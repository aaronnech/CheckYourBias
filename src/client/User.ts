/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('./Constants');
import Candidate = require('./Candiate');
import Issue = require('./Issue');

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
	firebaseRef: Firebase;

	constructor(id: string, firstName: string, lastName: string, admin: string, 
				age: string, email: string, gender: string, hasSeenHelpText: string) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.admin = admin;
		this.age = age;
		this.email = email;
		this.gender = gender;
		this.hasSeenHelpText = hasSeenHelpText;
		this.firebaseRef = new Firebase(Constants.FIRE_USER + "/" + id);
	}

	/*
		Takes an ID for a user and calls the callback function with a constructed
		user object as a parameter. If something goes wrong or the ID does not
		correspond to a user, nothing happens.

		invariant: id must represent one of the users already in the database
	*/
	public static getUser(id: string, callback: (user: User) => any): void {
		var rootRef: Firebase = new Firebase(Constants.FIRE_USER);
		rootRef.child(id).once("value", function(snapshot) {
			var user = snapshot.val();
			callback(new User(id, user.firstname, user.lastname, user.admin, 
				user.age, user.email, user.gender, user.hasSeenHelpText));
		}, function (errorObject) {
			// The id given was not valid or something went wrong.
			console.log("The read failed" + errorObject.code);
		});
	}

	/*
		Takes a user id and a category id and gets an ordered list of candidates
		in order of agreeement for the given category based on the user's issue ratings.
		The callback function will be called with the list of candidates as a parameter.

		invariant: userId must correspond to a user in the database
		invariant: categoryId must correspond to a category in the database
	*/
	public static getRankings(userId: string, categoryId: string, 
					callback: (rankings: Candidate[]) => any): void {
	}

	/*
		Takes a user id and gets all the issues the user has rated along with the user's
		rating on it. Calls the callback function with the dictionary as a parameter.

		invariant: userId must correspond to a user in the database
	*/
	public static getRatedIssues(userId: string, 
					callback: (ratedIssues: {Issue: string}) => any): void {

	}

	/*
		Takes a user id, issue id and a rating and puts it into the database.

		invariant: userId must correspond to a user in the database
		invariant: issueId must correspond to an issue in the database
	*/
	public static submitRating(userId: string, issueId: string, rating: string): void {

	}

	/*
		Takes a userId and a categoryId and gets an issue in that category that the user
		has not yet seen. Calls the callback function with the Issue.

		invariant: userId must correspond to a user in the database
		invariant: categoryId must correspond to a category in the database
	*/
	public static getNextIssue(userId: string, categoryId: string,
					callback: (issue: Issue) => any): void {

	}
}

export = User;