/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('../client/Constants');

Constants.firebaseUrl = Constants.FIREBASE_URL;

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

	constructor(id: string, categoryName: string, description: string,
			submittedIssueIds: string[]) {
		this.categoryName = categoryName;
		this.description = description;
		this.submittedIssueIds = submittedIssueIds;
	}

	/*
		Fetches the Category with the given categoryId.
	*/
	public static getCategory(categoryId: string, callback: (category: Category) => any): void {
		console.log(Constants.firebaseUrl + Constants.FIRE_CATEGORY);
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_CATEGORY);
		rootRef.child(categoryId).once("value", function(snapshot) {
			var category = snapshot.val();
			category.id = category;
			callback(category);
		}, function(errorObject) {
			// The id given was not valid or something went wrong.
			console.log("The read failed" + errorObject.code);
		});
	}
}

export = Category;