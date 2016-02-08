/// <reference path="../common/def/firebase.d.ts"/>

import Firebase = require("firebase");
import Constants = require('./Constants');

/*
	A class that represents a user and all the information that corresponds to it.
	Main text represents the bulk of the issue and what will be displayed to the user.
	Sources represents the websites or other that were used as sources for this issue.
	The candidates dictionary will comprise of the candidates with their ratings on this
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
	candidates: {};
	category: string[];
	submitter: string;
}

export = Issue;