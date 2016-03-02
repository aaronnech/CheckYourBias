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

	/*
		Fetches the Category with the given categoryId.
	*/
	public static getCategory(categoryId: string, callback: (category: Category) => any): void {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_CATEGORY);
		rootRef.child(categoryId).once("value", function(snapshot) {
			var category = snapshot.val();
			category.id = category;
			callback(category);
		});
	}

	/*
		Fetches all the categories
	*/
	public static getAllCategories(callback: (categories) => any): void {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_CATEGORY);
		rootRef.orderByKey().once("value", function(snapshot) {
			var categories = snapshot.val();
			callback(categories);
		});
	}

	/*
        Fetches all the categories, in lexicographically sorted order.

        Gets a array of objects that correspond to categories and their ids, in alphabetical order.
        Each object in the array has the following fields:

        category: The Category object that this entry corresponds to.
        id: The id of the Category
    */
	public static getAllCategoriesSorted(callback: (categories) => any): void {
		var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_CATEGORY);
		rootRef.orderByKey().once("value", function(snapshot) {
            var rootRef: Firebase = new Firebase(Constants.firebaseUrl + Constants.FIRE_CATEGORY);
            rootRef.orderByKey().once("value", function(snapshot) {
                var categories = snapshot.val();
                var resultObjects = [];

                for (var categoryId in categories) {
                    var resultObject = {};
                    resultObject["category"] = categories[categoryId];
                    resultObject["id"] = categoryId;
                    resultObjects.push(resultObject);
                }

                resultObjects.sort(function(a, b) {
                    return a.category.categoryName.localeCompare(b.category.categoryName);
                });
                callback(resultObjects);
            });
        });
	}

}

export = Category;