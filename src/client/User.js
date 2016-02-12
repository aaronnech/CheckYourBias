/// <reference path="../common/def/firebase.d.ts"/>
var Firebase = require("firebase");
var Constants = require('./Constants');
/*
    A class that represents a user and all the information that corresponds to them.
    
    invariant: id is a string comprised of only numbers that must represent the id of
    a user in Firebase

*/
var User = (function () {
    function User(id, firstName, lastName, admin, age, email, gender, hasSeenHelpText, submittedIssueIds, ratedIssues, categoryWeights) {
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
    User.getUser = function (id, callback) {
        var rootRef = new Firebase(Constants.FIRE_USER);
        rootRef.child(id).once("value", function (snapshot) {
            var user = snapshot.val();
            callback(new User(id, user.firstName, user.lastName, user.admin, user.age, user.email, user.gender, user.hasSeenHelpText, user.submittedIssueIds, user.ratedIssues, user.categoryWeights));
        }, function (errorObject) {
            // The id given was not valid or something went wrong.
            console.log("The read failed" + errorObject.code);
        });
    };
    /*
        Takes a user id and a category id and gets an ordered list of candidates
        in order of agreeement for the given category based on the user's issue ratings.
        The callback function will be called with the list of candidates as a parameter.

        invariant: userId must correspond to a user in the database
        invariant: categoryId must correspond to a category in the database
    */
    User.getRankings = function (userId, categoryId, callback) {
    };
    /*
        Takes a user id and gets all the issues the user has rated along with the user's
        rating on it. Calls the callback function with the dictionary as a parameter.

        invariant: userId must correspond to a user in the database
    */
    User.getRatedIssues = function (userId, callback) {
        var rootRef = new Firebase(Constants.FIRE_USER);
        rootRef.child(userId).once("value", function (snapshot) {
            var user = snapshot.val();
            callback(user.ratedIssues);
        }, function (errorObject) {
            console.log("getRatedIssues failed" + errorObject.code);
        });
    };
    /*
        Takes a user id, issue id and a rating and puts it into the database.

        invariant: userId must correspond to a user in the database
        invariant: issueId must correspond to an issue in the database
    */
    User.submitRating = function (userId, issueId, rating) {
        var rootRef = new Firebase(Constants.FIRE_USER);
        rootRef.child(userId).child("ratedIssues").update({
            issueId: rating
        }, function (errorObject) {
            // The id given was not valid or something went wrong.
            console.log("submitRating failed" + errorObject.code);
        });
    };
    /*
        Takes a userId and a categoryId and gets an issue in that category that the user
        has not yet seen. Calls the callback function with the Issue.

        invariant: userId must correspond to a user in the database
        invariant: categoryId must correspond to a category in the database
    */
    User.getNextIssue = function (userId, categoryId, callback) {
        var candidates = new Firebase(Constants.FIRE_CANDIDATE);
        var user = this.getUser(userId, function (user) {
            return user;
        });
        candidates.orderByKey().limitToLast(1).once("value", function (snapshot) {
            var chosenCandidate = Math.floor((Math.random() * snapshot.val()));
            var issue = 0;
            var issues = new Firebase(Constants.FIRE_ISSUE);
            while (issue == 0) {
                issues.orderByKey().limitToLast(1).once("value", function (snapshot) {
                    var chosenIssue = Math.floor((Math.random() * snapshot.val()));
                    /*
                    if(user.ratedIssues[chosenIssue] == 0)
                    {
                        var nextIssue = Issue.getIssue(chosenIssue, function(issue) {
                            return issue;
                        });
                        if(nextIssue.candidateRatings[chosenCandidate] > 0)
                        {
                            callback(nextIssue);
                        }
                    }*/
                }, function (errorObject) {
                    // The id given was not valid or something went wrong.
                    console.log("Issue read failed in getNextIssue" + errorObject.code);
                });
            }
        }, function (errorObject) {
            // The id given was not valid or something went wrong.
            console.log("Candidate read failed in getNextIssue" + errorObject.code);
        });
    };
    return User;
})();
module.exports = User;
