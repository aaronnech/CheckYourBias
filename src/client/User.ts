/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('./Constants');

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

	public static getUser(id: string, callback: (user: User) => any): void {
		var rootRef: Firebase = new Firebase(Constants.FIRE_USER);
		rootRef.child(id).once("value", function(snapshot) {
			var user = snapshot.val();
			callback(new User(id, user.firstname, user.lastname, user.admin, 
				user.age, user.email, user.gender, user.hasSeenHelpText));
		});
	}
}

export = User;