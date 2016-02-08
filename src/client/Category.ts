/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('./Constants');

/*
	A class that represents a category and all the information that corresponds to it.

	invariant: categoryId is a string comprised of only numbers that must
	represent the id of a user in Firebase.

	invariant: submittedIssueIds comprises all issues that have been submitted with
	this categoryId.
*/
class Category {
	categoryId: string;
	categoryName: string;
	description: string;
	submittedIssueIds: string[];	
	firebaseRef: Firebase;
}

export = Category;