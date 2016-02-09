/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('./Constants');

/*
	A class that represents a category and all the information that corresponds to it.

	invariant: categoryId is a string comprised of only numbers that must
	represent the id of a user in Firebase.

	invariant: submittedIssueIds comprises all Issues that have been submitted with
	this categoryId.
*/
class Category {
	categoryId: string;
	categoryName: string;
	description: string;
	submittedIssueIds: string[];	
	firebaseRef: Firebase;

	/*
		Fetches the Category with the given categoryId.
	*/
	public static getCategory(categoryId: string, callback: (category: Category) => any): void {
		// TODO: Implement
	}
}

export = Category;