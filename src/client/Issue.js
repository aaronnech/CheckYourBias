/// <reference path="../common/def/firebase.d.ts"/>
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
var Issue = (function () {
    function Issue() {
    }
    /*
        Fetches the Issue with the given issueId.
    */
    Issue.getIssue = function (issueId, callback) {
        // TODO: Implement
    };
    return Issue;
})();
module.exports = Issue;
