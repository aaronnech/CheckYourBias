/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('./Constants');

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
}

export = User;